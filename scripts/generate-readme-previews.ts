import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium, type Page } from "playwright";

type ThemeName = "light" | "dark";

const DEFAULT_PORT = 3123;
const DEFAULT_OUT_DIR = "preview/readme-previews";

function isTruthyEnv(val: string | undefined): boolean {
    if (!val) return false;
    return ["1", "true", "yes", "on"].includes(val.trim().toLowerCase());
}

function getArgValue(args: string[], key: string): string | undefined {
    const idx = args.indexOf(key);
    if (idx === -1) return undefined;
    return args[idx + 1];
}

function hasFlag(args: string[], flag: string): boolean {
    return args.includes(flag);
}

async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}

async function waitForHttpOk(url: string, timeoutMs: number) {
    const start = Date.now();
    for (; ;) {
        try {
            const res = await fetch(url, { redirect: "manual" });
            if (res.ok) return;
        } catch {
            // ignore
        }
        if (Date.now() - start > timeoutMs) {
            throw new Error(`Timed out waiting for server: ${url}`);
        }
        await new Promise((r) => setTimeout(r, 200));
    }
}

function sampleProtocolData(hasSessionItems: boolean) {
    return {
        fsrMembers: ["Alice", "Bob"],
        guests: ["Eve"],
        protocolant: ["Alice"],
        meta: {
            Date: "2026-02-07",
            Start: "16:30",
            Ende: "17:30",
        },
        sessionItems: hasSessionItems
            ? [
                {
                    id: "t1",
                    topic: "Top 1: Begrüßung",
                    points: ["Anwesenheit festgestellt", "Tagesordnung beschlossen"],
                },
                {
                    id: "t2",
                    topic: "Top 2: Sonstiges",
                    points: ["Nächster Termin festgelegt"],
                },
            ]
            : [],
    };
}

async function gotoWithState(
    page: Page,
    baseUrl: string,
    theme: ThemeName,
    protocolData?: unknown,
) {
    await page.addInitScript(
        ({
            themeValue,
            storageKey,
            protocol,
        }: {
            themeValue: ThemeName;
            storageKey: string;
            protocol: unknown | null;
        }) => {
            localStorage.clear();
            localStorage.setItem("theme", themeValue);
            if (protocol) {
                localStorage.setItem(storageKey, JSON.stringify(protocol));
            }
        },
        {
            themeValue: theme,
            storageKey: "fsr-protocol-data",
            protocol: protocolData ?? null,
        },
    );

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
}

async function screenshot(page: Page, outPath: string) {
    await ensureDir(path.dirname(outPath));
    await page.screenshot({ path: outPath, fullPage: true });
}

async function waitForDialog(page: Page) {
    await page
        .locator('[role="dialog"]')
        .first()
        .waitFor({ state: "visible", timeout: 5000 });
}

async function openMemberSuggestions(page: Page) {
    const tagInput = page
        .locator("div")
        .filter({ has: page.locator('label:has-text("FSR Mitglieder")') })
        .first();

    const input = tagInput.locator('input[type="text"]').first();
    await input.click();
    await input.fill("a");
    await page.waitForTimeout(250);
}

async function run() {
    const args = process.argv.slice(2);

    const port = Number(getArgValue(args, "--port") ?? DEFAULT_PORT);
    const outDir = getArgValue(args, "--out") ?? DEFAULT_OUT_DIR;
    const baseUrl = getArgValue(args, "--baseUrl") ?? `http://127.0.0.1:${port}`;
    const smoke = hasFlag(args, "--smoke");

    const chromiumPath =
        getArgValue(args, "--chromium") ??
        process.env.CHROMIUM_PATH ??
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

    const themes: ThemeName[] = (getArgValue(args, "--themes")
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) as ThemeName[]) ?? ["light", "dark"];

    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

    // Build before starting the preview server
    await new Promise<void>((resolve, reject) => {
        const build = spawn(npmCmd, ["run", "build"], { stdio: "inherit" });
        build.on("error", reject);
        build.on("close", (code) => {
            if (code === 0) return resolve();
            reject(new Error(`Build failed (exit code ${code ?? "unknown"})`));
        });
    });

    const server = spawn(npmCmd, ["start", "--", "-p", String(port)], {
        stdio: "pipe",
        env: {
            ...process.env,
            FSR_MEMBERS: "Alice [Ali], Bob, Charlie",
            ASSOCIATED_MEMBERS: "Dave, Eve",
            // keep discord unconfigured so we can capture the error dialog reliably
            DISCORD_WEBHOOK_URL: "",
            DISCORD_PASSWORD: "",
        },
    });

    const serverLogs: string[] = [];
    server.stdout?.on("data", (d) => serverLogs.push(String(d)));
    server.stderr?.on("data", (d) => serverLogs.push(String(d)));

    const stopServer = async () => {
        if (server.killed) return;
        server.kill("SIGTERM");
        await new Promise((r) => setTimeout(r, 300));
    };

    const failWithLogs = (err: unknown) => {
        const logs = serverLogs.slice(-80).join("");
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`${msg}\n\n--- server logs (tail) ---\n${logs}`);
    };

    process.on("SIGINT", () => void stopServer());
    process.on("SIGTERM", () => void stopServer());

    try {
        await waitForHttpOk(baseUrl, 60_000);

        const browser = await chromium.launch({
            headless: !isTruthyEnv(process.env.PW_HEADFUL),
            ...(chromiumPath ? { executablePath: chromiumPath } : {}),
        });
        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 2,
        });

        for (const theme of themes) {
            const prefix = path.join(outDir, theme);

            // Full / Empty
            {
                const page = await context.newPage();
                await gotoWithState(page, baseUrl, theme, sampleProtocolData(true));
                await screenshot(page, path.join(prefix, "full.png"));
                await page.close();
            }
            {
                const page = await context.newPage();
                await gotoWithState(page, baseUrl, theme, sampleProtocolData(false));
                await screenshot(page, path.join(prefix, "empty.png"));
                await page.close();
            }

            // Member selection dropdown
            {
                const page = await context.newPage();
                await gotoWithState(page, baseUrl, theme, sampleProtocolData(false));
                await openMemberSuggestions(page);
                await screenshot(page, path.join(prefix, "member_select.png"));
                await page.close();
            }

            // New session item
            {
                const page = await context.newPage();
                await gotoWithState(page, baseUrl, theme, sampleProtocolData(false));
                await page.getByRole("button", { name: "Neues Thema" }).click();
                await page.waitForTimeout(200);
                await screenshot(page, path.join(prefix, "new_session_item.png"));
                await page.close();
            }

            // Dialogs: Reset / Import / Clipboard
            /*
            {
                const page = await context.newPage();
                await gotoWithState(page, baseUrl, theme, sampleProtocolData(true));

                await page.getByRole("button", { name: /reset/i }).click();
                await waitForDialog(page);
                await screenshot(page, path.join(prefix, "dialog_reset_confirm.png"));
                await page.getByRole("button", { name: /abbrechen/i }).click();
                await page.waitForTimeout(150);

                await page.getByRole("button", { name: /import/i }).click();
                await waitForDialog(page);
                await screenshot(page, path.join(prefix, "dialog_import_confirm.png"));
                await page.getByRole("button", { name: /abbrechen/i }).click();
                await page.waitForTimeout(150);

                await page.getByRole("button", { name: /clipboard/i }).click();
                await waitForDialog(page);
                await screenshot(
                    page,
                    path.join(prefix, "dialog_clipboard_confirm.png"),
                );
                await page.getByRole("button", { name: /abbrechen/i }).click();

                await page.close();
            }

            // Discord flow: confirm -> password prompt -> error alert
            {
                const page = await context.newPage();
                await gotoWithState(page, baseUrl, theme, sampleProtocolData(true));

                await page.getByRole("button", { name: /discord/i }).click();
                await waitForDialog(page);
                await screenshot(page, path.join(prefix, "dialog_discord_confirm.png"));

                await page.getByRole("button", { name: /ja/i }).click();
                await waitForDialog(page);
                await screenshot(
                    page,
                    path.join(prefix, "dialog_discord_password.png"),
                );

                await page.locator('[role="dialog"] input').fill("test");
                await page.getByRole("button", { name: /^ok$/i }).click();
                await waitForDialog(page);
                await screenshot(page, path.join(prefix, "dialog_discord_error.png"));

                await page.close();
            }
            */

            if (smoke) break;
        }

        await context.close();
        await browser.close();
    } catch (err) {
        const hint =
            err instanceof Error &&
                /NixOS cannot run dynamically linked executables|stub-ld/i.test(
                    err.message,
                )
                ? "\n\nNixOS hint: Playwright's downloaded Chromium won't run on NixOS. Install system Chromium and re-run with either:\n  CHROMIUM_PATH=$(command -v chromium) npm run previews -- --smoke\n  # or\n  npm run previews -- --smoke --chromium $(command -v chromium)\n\nIf you're using the flake devShell, add pkgs.chromium to devShell packages."
                : "";
        failWithLogs(
            new Error(`${err instanceof Error ? err.message : String(err)}${hint}`),
        );
    } finally {
        await stopServer();
    }
}

run().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});

"use server";

import { normalizeLanguage, t, type Language } from "@/common/i18n";

export async function sendToDiscord(
  yamlContent: string,
  date: string,
  password?: string,
  lang?: Language
) {
  const language = normalizeLanguage(lang);
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const configuredPassword = process.env.DISCORD_PASSWORD;

  if (!webhookUrl) {
    return { success: false, message: t(language, "discord.webhookMissing") };
  }

  if (configuredPassword) {
    if (!password) {
      return { success: false, message: t(language, "discord.passwordRequired") };
    }
    if (password !== configuredPassword) {
      return { success: false, message: t(language, "discord.passwordWrong") };
    }
  }

  const formData = new FormData();
  
  // Create a Blob-like object for the file content since we are in Node.js environment
  const file = new Blob([yamlContent], { type: "text/yaml" });
  formData.append("file", file, `${t(language, "export.filenamePrefix")}_${date}.yaml`);
  
  // formData.append("content", `Neues Protokoll vom ${date}`);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord Webhook Error:", errorText);
      return {
        success: false,
        message: `${t(language, "discord.sendFailed")}: ${response.status} ${response.statusText}`,
      };
    }

    return { success: true, message: t(language, "discord.sent") };
  } catch (error) {
    console.error("Failed to send to Discord:", error);
    return { success: false, message: t(language, "discord.networkError") };
  }
}

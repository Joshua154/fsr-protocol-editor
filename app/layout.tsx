import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DialogProvider } from "@/components/DialogProvider";

export const metadata: Metadata = {
  title: "FSR Protokoll Editor",
  description: "Sitzungsprotokolle gemeinsam, strukturiert und sicher erfassen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DialogProvider>{children}</DialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

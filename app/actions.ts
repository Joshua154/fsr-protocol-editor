"use server";

export async function sendToDiscord(yamlContent: string, date: string, password?: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const configuredPassword = process.env.DISCORD_PASSWORD;

  if (!webhookUrl) {
    return { success: false, message: "Discord Webhook URL nicht konfiguriert." };
  }

  if (configuredPassword) {
    if (!password) {
      return { success: false, message: "Bitte Passwort eingeben." };
    }
    if (password !== configuredPassword) {
      return { success: false, message: "Falsches Passwort." };
    }
  }

  const formData = new FormData();
  
  // Create a Blob-like object for the file content since we are in Node.js environment
  const file = new Blob([yamlContent], { type: "text/yaml" });
  formData.append("file", file, `Protokoll_${date}.yaml`);
  
  // formData.append("content", `Neues Protokoll vom ${date}`);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord Webhook Error:", errorText);
      return { success: false, message: `Fehler beim Senden: ${response.status} ${response.statusText}` };
    }

    return { success: true, message: "Protokoll erfolgreich an Discord gesendet!" };
  } catch (error) {
    console.error("Failed to send to Discord:", error);
    return { success: false, message: "Netzwerkfehler beim Senden an Discord." };
  }
}

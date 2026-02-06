"use server";

export async function sendToDiscord(yamlContent: string, date: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return { success: false, message: "Discord Webhook URL nicht konfiguriert." };
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

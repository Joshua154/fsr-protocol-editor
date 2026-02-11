export const SUPPORTED_LANGUAGES = ["de", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export type TranslationKey =
  | "app.title"
  | "header.reset"
  | "header.resetTitle"
  | "header.clipboard"
  | "header.import"
  | "header.export"
  | "header.discord"
  | "header.discordTitle"
  | "meta.attendance"
  | "meta.fsrMembers"
  | "meta.otherPeople"
  | "meta.details"
  | "meta.date"
  | "meta.start"
  | "meta.end"
  | "meta.now"
  | "meta.protocolant"
  | "session.content"
  | "session.newTopic"
  | "session.empty"
  | "session.dragToSort"
  | "session.topicPlaceholder"
  | "session.deleteTopicTitle"
  | "session.pointPlaceholder"
  | "session.addPoint"
  | "tagInput.placeholder"
  | "dialog.confirm.title"
  | "dialog.confirm.yes"
  | "dialog.confirm.cancel"
  | "dialog.alert.title"
  | "dialog.prompt.title"
  | "dialog.ok"
  | "protocol.reset.message"
  | "protocol.reset.title"
  | "import.confirm.message"
  | "import.confirm.title"
  | "paste.confirm.message"
  | "paste.confirm.title"
  | "clipboard.empty"
  | "clipboard.denied"
  | "export.filenamePrefix"
  | "export.filenameFallback"
  | "error.title"
  | "yaml.readError"
  | "discord.confirm.message"
  | "discord.confirm.title"
  | "discord.password.message"
  | "discord.password.title"
  | "discord.webhookMissing"
  | "discord.passwordRequired"
  | "discord.passwordWrong"
  | "discord.sendFailed"
  | "discord.networkError"
  | "discord.sent"
  | "success.title";

export const translations: Record<Language, Record<TranslationKey, string>> = {
  de: {
    "app.title": "FSR Protokoll Editor",

    "header.reset": "Reset",
    "header.resetTitle": "Protokoll zurücksetzen",
    "header.clipboard": "Clipboard",
    "header.import": "Import",
    "header.export": "Export",
    "header.discord": "Discord",
    "header.discordTitle": "An Discord senden",

    "meta.attendance": "Anwesenheit",
    "meta.fsrMembers": "FSR Mitglieder (Gewählt)",
    "meta.otherPeople": "Weitere Personen (Assoziierte / Gäste)",
    "meta.details": "Details",
    "meta.date": "Datum",
    "meta.start": "Start",
    "meta.end": "Ende",
    "meta.now": "jetzt",
    "meta.protocolant": "Protokollant:in",

    "session.content": "Sitzungsinhalte",
    "session.newTopic": "Neues Thema",
    "session.empty": "Keine Themen vorhanden. Füge ein Thema hinzu oder importiere ein Protokoll.",

    "session.dragToSort": "Ziehen zum Sortieren",
    "session.topicPlaceholder": "Thema Titel...",
    "session.deleteTopicTitle": "Thema löschen",
    "session.pointPlaceholder": "Inhalt des Tagesordnungspunkts...",
    "session.addPoint": "Punkt hinzufügen",

    "tagInput.placeholder": "Namen auswählen...",

    "dialog.confirm.title": "Bestätigen",
    "dialog.confirm.yes": "Ja",
    "dialog.confirm.cancel": "Abbrechen",
    "dialog.alert.title": "Hinweis",
    "dialog.prompt.title": "Eingabe",
    "dialog.ok": "OK",

    "protocol.reset.message": "Möchtest du das Protokoll wirklich zurücksetzen? Alle ungespeicherten Daten gehen verloren.",
    "protocol.reset.title": "Protokoll zurücksetzen",

    "import.confirm.message": "Das Importieren eines Protokolls überschreibt alle aktuellen Daten. Fortfahren?",
    "import.confirm.title": "Importieren",

    "paste.confirm.message": "Das Einfügen aus der Zwischenablage überschreibt alle aktuellen Daten. Fortfahren?",
    "paste.confirm.title": "Einfügen",

    "clipboard.empty": "Zwischenablage ist leer!",
    "clipboard.denied": "Clipboard Zugriff verweigert!",

    "export.filenamePrefix": "Protokoll",
    "export.filenameFallback": "Export",

    "error.title": "Fehler",
    "yaml.readError": "Fehler beim Lesen des YAMLs. Bitte Format prüfen.",

    "discord.confirm.message": "Möchtest du das Protokoll wirklich an Discord senden?",
    "discord.confirm.title": "An Discord senden",
    "discord.password.message": "Bitte Passwort eingeben:",
    "discord.password.title": "Passwort benötigt",

    "discord.webhookMissing": "Discord Webhook URL nicht konfiguriert.",
    "discord.passwordRequired": "Bitte Passwort eingeben.",
    "discord.passwordWrong": "Falsches Passwort.",
    "discord.sendFailed": "Fehler beim Senden",
    "discord.networkError": "Netzwerkfehler beim Senden an Discord.",
    "discord.sent": "Protokoll erfolgreich an Discord gesendet!",

    "success.title": "Erfolg",
  },
  en: {
    "app.title": "FSR Protocol Editor",

    "header.reset": "Reset",
    "header.resetTitle": "Reset protocol",
    "header.clipboard": "Clipboard",
    "header.import": "Import",
    "header.export": "Export",
    "header.discord": "Discord",
    "header.discordTitle": "Send to Discord",

    "meta.attendance": "Attendance",
    "meta.fsrMembers": "FSR members (elected)",
    "meta.otherPeople": "Other people (associated / guests)",
    "meta.details": "Details",
    "meta.date": "Date",
    "meta.start": "Start",
    "meta.end": "End",
    "meta.now": "now",
    "meta.protocolant": "Minute taker",

    "session.content": "Agenda",
    "session.newTopic": "New topic",
    "session.empty": "No topics yet. Add a topic or import a protocol.",

    "session.dragToSort": "Drag to sort",
    "session.topicPlaceholder": "Topic title...",
    "session.deleteTopicTitle": "Delete topic",
    "session.pointPlaceholder": "Agenda item content...",
    "session.addPoint": "Add point",

    "tagInput.placeholder": "Select names...",

    "dialog.confirm.title": "Confirm",
    "dialog.confirm.yes": "Yes",
    "dialog.confirm.cancel": "Cancel",
    "dialog.alert.title": "Notice",
    "dialog.prompt.title": "Input",
    "dialog.ok": "OK",

    "protocol.reset.message": "Do you really want to reset the protocol? All unsaved data will be lost.",
    "protocol.reset.title": "Reset protocol",

    "import.confirm.message": "Importing a protocol will overwrite all current data. Continue?",
    "import.confirm.title": "Import",

    "paste.confirm.message": "Pasting from clipboard will overwrite all current data. Continue?",
    "paste.confirm.title": "Paste",

    "clipboard.empty": "Clipboard is empty!",
    "clipboard.denied": "Clipboard access denied!",

    "export.filenamePrefix": "Protocol",
    "export.filenameFallback": "Export",

    "error.title": "Error",
    "yaml.readError": "Failed to read YAML. Please check the format.",

    "discord.confirm.message": "Do you really want to send the protocol to Discord?",
    "discord.confirm.title": "Send to Discord",
    "discord.password.message": "Please enter password:",
    "discord.password.title": "Password required",

    "discord.webhookMissing": "Discord webhook URL is not configured.",
    "discord.passwordRequired": "Please enter password.",
    "discord.passwordWrong": "Wrong password.",
    "discord.sendFailed": "Failed to send",
    "discord.networkError": "Network error while sending to Discord.",
    "discord.sent": "Protocol successfully sent to Discord!",

    "success.title": "Success",
  },
};

export function normalizeLanguage(input: string | null | undefined): Language {
  const raw = (input ?? "").trim().toLowerCase();
  if (raw.startsWith("de")) return "de";
  if (raw.startsWith("en")) return "en";
  return "de";
}

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}

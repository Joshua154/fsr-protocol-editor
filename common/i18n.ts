export const SUPPORTED_LANGUAGES = ["de", "en", "es", "ru"] as const;
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
    "session.empty":
      "Keine Themen vorhanden. Füge ein Thema hinzu oder importiere ein Protokoll.",

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

    "protocol.reset.message":
      "Möchtest du das Protokoll wirklich zurücksetzen? Alle ungespeicherten Daten gehen verloren.",
    "protocol.reset.title": "Protokoll zurücksetzen",

    "import.confirm.message":
      "Das Importieren eines Protokolls überschreibt alle aktuellen Daten. Fortfahren?",
    "import.confirm.title": "Importieren",

    "paste.confirm.message":
      "Das Einfügen aus der Zwischenablage überschreibt alle aktuellen Daten. Fortfahren?",
    "paste.confirm.title": "Einfügen",

    "clipboard.empty": "Zwischenablage ist leer!",
    "clipboard.denied": "Clipboard Zugriff verweigert!",

    "export.filenamePrefix": "Protokoll",
    "export.filenameFallback": "Export",

    "error.title": "Fehler",
    "yaml.readError": "Fehler beim Lesen des YAMLs. Bitte Format prüfen.",

    "discord.confirm.message":
      "Möchtest du das Protokoll wirklich an Discord senden?",
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

    "protocol.reset.message":
      "Do you really want to reset the protocol? All unsaved data will be lost.",
    "protocol.reset.title": "Reset protocol",

    "import.confirm.message":
      "Importing a protocol will overwrite all current data. Continue?",
    "import.confirm.title": "Import",

    "paste.confirm.message":
      "Pasting from clipboard will overwrite all current data. Continue?",
    "paste.confirm.title": "Paste",

    "clipboard.empty": "Clipboard is empty!",
    "clipboard.denied": "Clipboard access denied!",

    "export.filenamePrefix": "Protocol",
    "export.filenameFallback": "Export",

    "error.title": "Error",
    "yaml.readError": "Failed to read YAML. Please check the format.",

    "discord.confirm.message":
      "Do you really want to send the protocol to Discord?",
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
  ru: {
    "app.title": "FSR Редактор протоколов",

    "header.reset": "Сбросить",
    "header.resetTitle": "Сбросить протокол",
    "header.clipboard": "Буфер обмена",
    "header.import": "Импорт",
    "header.export": "Экспорт",
    "header.discord": "Discord",
    "header.discordTitle": "Отправить в Discord",

    "meta.attendance": "Посещаемость",
    "meta.fsrMembers": "Члены FSR (избранные)",
    "meta.otherPeople": "Другие (ассоциированные / гости)",
    "meta.details": "Детали",
    "meta.date": "Дата",
    "meta.start": "Начало",
    "meta.end": "Конец",
    "meta.now": "сейчас",
    "meta.protocolant": "Протоколист",

    "session.content": "Содержание заседания",
    "session.newTopic": "Новая тема",
    "session.empty": "Тем нет. Добавьте тему или импортируйте протокол.",

    "session.dragToSort": "Перетащите для сортировки",
    "session.topicPlaceholder": "Заголовок темы...",
    "session.deleteTopicTitle": "Удалить тему",
    "session.pointPlaceholder": "Содержание пункта повестки...",
    "session.addPoint": "Добавить пункт",

    "tagInput.placeholder": "Выберите имена...",

    "dialog.confirm.title": "Подтверждение",
    "dialog.confirm.yes": "Да",
    "dialog.confirm.cancel": "Отмена",
    "dialog.alert.title": "Уведомление",
    "dialog.prompt.title": "Ввод данных",
    "dialog.ok": "OK",

    "protocol.reset.message":
      "Вы действительно хотите сбросить протокол? Все несохраненные данные будут утеряны.",
    "protocol.reset.title": "Сбросить протокол",

    "import.confirm.message":
      "Импорт протокола перезапишет все текущие данные. Продолжить?",
    "import.confirm.title": "Импорт",

    "paste.confirm.message":
      "Вставка из буфера обмена перезапишет все текущие данные. Продолжить?",
    "paste.confirm.title": "Вставить",

    "clipboard.empty": "Буфер обмена пуст!",
    "clipboard.denied": "Доступ к буферу обмена запрещен!",

    "export.filenamePrefix": "Протокол",
    "export.filenameFallback": "Экспорт",

    "error.title": "Ошибка",
    "yaml.readError": "Ошибка чтения YAML. Пожалуйста, проверьте формат.",

    "discord.confirm.message":
      "Вы действительно хотите отправить протокол в Discord?",
    "discord.confirm.title": "Отправить в Discord",
    "discord.password.message": "Введите пароль:",
    "discord.password.title": "Требуется пароль",

    "discord.webhookMissing": "URL вебхука Discord не настроен.",
    "discord.passwordRequired": "Пожалуйста, введите пароль.",
    "discord.passwordWrong": "Неверный пароль.",
    "discord.sendFailed": "Ошибка при отправке",
    "discord.networkError": "Сетевая ошибка при отправке в Discord.",
    "discord.sent": "Протокол успешно отправлен в Discord!",

    "success.title": "Успех",
  },
  es: {
    "app.title": "Editor de Actas FSR",

    "header.reset": "Restablecer",
    "header.resetTitle": "Restablecer acta",
    "header.clipboard": "Portapapeles",
    "header.import": "Importar",
    "header.export": "Exportar",
    "header.discord": "Discord",
    "header.discordTitle": "Enviar a Discord",

    "meta.attendance": "Asistencia",
    "meta.fsrMembers": "Miembros del FSR (Electos)",
    "meta.otherPeople": "Otras personas (Asociados / Invitados)",
    "meta.details": "Detalles",
    "meta.date": "Fecha",
    "meta.start": "Inicio",
    "meta.end": "Fin",
    "meta.now": "ahora",
    "meta.protocolant": "Secretario/a",

    "session.content": "Contenido de la sesión",
    "session.newTopic": "Nuevo tema",
    "session.empty":
      "No hay temas disponibles. Añade un tema o importa un acta.",

    "session.dragToSort": "Arrastrar para ordenar",
    "session.topicPlaceholder": "Título del tema...",
    "session.deleteTopicTitle": "Eliminar tema",
    "session.pointPlaceholder": "Contenido del punto del día...",
    "session.addPoint": "Añadir punto",

    "tagInput.placeholder": "Seleccionar nombres...",

    "dialog.confirm.title": "Confirmar",
    "dialog.confirm.yes": "Sí",
    "dialog.confirm.cancel": "Cancelar",
    "dialog.alert.title": "Aviso",
    "dialog.prompt.title": "Entrada",
    "dialog.ok": "OK",

    "protocol.reset.message":
      "¿Realmente deseas restablecer el acta? Se perderán todos los datos no guardados.",
    "protocol.reset.title": "Restablecer acta",

    "import.confirm.message":
      "Importar un acta sobrescribirá todos los datos actuales. ¿Continuar?",
    "import.confirm.title": "Importar",

    "paste.confirm.message":
      "Pegar desde el portapapeles sobrescribirá todos los datos actuales. ¿Continuar?",
    "paste.confirm.title": "Pegar",

    "clipboard.empty": "¡El portapapeles está vacío!",
    "clipboard.denied": "¡Acceso al portapapeles denegado!",

    "export.filenamePrefix": "Acta",
    "export.filenameFallback": "Exportar",

    "error.title": "Error",
    "yaml.readError": "Error al leer el YAML. Por favor, comprueba el formato.",

    "discord.confirm.message": "¿Realmente deseas enviar el acta a Discord?",
    "discord.confirm.title": "Enviar a Discord",
    "discord.password.message": "Por favor, introduce la contraseña:",
    "discord.password.title": "Contraseña requerida",

    "discord.webhookMissing": "URL del webhook de Discord no configurada.",
    "discord.passwordRequired": "Por favor, introduce la contraseña.",
    "discord.passwordWrong": "Contraseña incorrecta.",
    "discord.sendFailed": "Error al enviar",
    "discord.networkError": "Error de red al enviar a Discord.",
    "discord.sent": "¡Acta enviada con éxito a Discord!",

    "success.title": "Éxito",
  },
};

export function normalizeLanguage(input: string | null | undefined): Language {
  const raw = (input ?? "").trim().toLowerCase();
  if (raw.startsWith("de")) return "de";
  if (raw.startsWith("en")) return "en";
  if (raw.startsWith("es")) return "es";
  if (raw.startsWith("ru")) return "ru";
  return "de";
}

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}

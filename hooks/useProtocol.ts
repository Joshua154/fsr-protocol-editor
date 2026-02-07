import { useState, useRef, useEffect } from "react";
import yaml from "js-yaml";
import { SessionItem, ProtocolData } from "@/common/types";
import { sessionObjectToArray, sessionArrayToObject } from "@/common/utils";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { sendToDiscord } from "@/app/actions";
import { useDialog } from "@/components/DialogProvider";

const STORAGE_KEY = "fsr-protocol-data";

export const useProtocol = () => {
  const { confirm, alert, prompt } = useDialog();
  const [isLoaded, setIsLoaded] = useState(false);
  const [fsrMembers, setFsrMembers] = useState<string[]>([]);
  const [guests, setGuests] = useState<string[]>([]);
  const [protocolant, setProtocolant] = useState<string[]>([]);

  const [meta, setMeta] = useState({
    Date: new Date().toISOString().split("T")[0],
    Start: "16:30",
    Ende: "17:30",
  });
  const [sessionItems, setSessionItems] = useState<SessionItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFsrMembers(parsed.fsrMembers || []);
        setGuests(parsed.guests || []);
        setProtocolant(parsed.protocolant || []);
        setMeta(
          parsed.meta || {
            Date: new Date().toISOString().split("T")[0],
            Start: "16:30",
            Ende: "17:30",
          }
        );
        setSessionItems(parsed.sessionItems || []);
      } catch (e) {
        console.error("Failed to load protocol data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    const dataToSave = {
      fsrMembers,
      guests,
      protocolant,
      meta,
      sessionItems,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [fsrMembers, guests, protocolant, meta, sessionItems, isLoaded]);

  const resetProtocol = async () => {
    if (
      !(await confirm(
        "Möchtest du das Protokoll wirklich zurücksetzen? Alle ungespeicherten Daten gehen verloren.",
        { destructive: true, title: "Protokoll zurücksetzen" }
      ))
    ) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    setFsrMembers([]);
    setGuests([]);
    setProtocolant([]);
    setMeta({
      Date: new Date().toISOString().split("T")[0],
      Start: "16:30",
      Ende: "17:30",
    });
    setSessionItems([]);
  };

  const processYamlContent = (content: string) => {
    try {
      const parsed = yaml.load(content) as ProtocolData;
      if (!parsed) throw new Error("Empty YAML");

      const parseList = (input: unknown): string[] => {
        if (Array.isArray(input))
          return input.map(String).map((s) => s.trim()).filter(Boolean);
        if (typeof input === "string")
          return input.split(",").map((s) => s.trim()).filter(Boolean);
        return [];
      };

      setFsrMembers(parseList(parsed.FSR));
      setProtocolant(parsed.Protokollant ? [String(parsed.Protokollant)] : []);
      setGuests(parseList(parsed.WeiterePersonen));

      setMeta({
        Date: parsed.Date
          ? new Date(parsed.Date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        Start: parsed.Start ? String(parsed.Start) : "16:30",
        Ende: parsed.Ende ? String(parsed.Ende) : "17:30",
      });

      if (parsed.Sitzung) {
        setSessionItems(sessionObjectToArray(parsed.Sitzung));
      } else {
        setSessionItems([]);
      }
    } catch (error) {
      alert("Fehler beim Lesen des YAMLs. Bitte Format prüfen.", {
        title: "Fehler",
        destructive: true,
      });
      console.error(error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processYamlContent(event.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportFileClick = async () => {
    if (sessionItems.length > 0) {
      if (
        !(await confirm(
          "Das Importieren eines Protokolls überschreibt alle aktuellen Daten. Fortfahren?",
          { title: "Importieren", destructive: true }
        ))
      ) {
        return;
      }
    }
    fileInputRef.current?.click();
  };

  const handlePasteFromClipboard = async () => {
    if (sessionItems.length > 0) {
      if (
        !(await confirm(
          "Das Einfügen aus der Zwischenablage überschreibt alle aktuellen Daten. Fortfahren?",
          { title: "Einfügen", destructive: true }
        ))
      ) {
        return;
      }
    }
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return alert("Zwischenablage ist leer!");
      processYamlContent(text);
    } catch (err) {
      console.error(err);
      alert("Clipboard Zugriff verweigert!", { title: "Fehler", destructive: true });
    }
  };

  const handleExport = () => {
    const dataToExport = {
      FSR: fsrMembers,
      Protokollant: protocolant[0] || "",
      WeiterePersonen: guests,
      Date: meta.Date,
      Start: meta.Start,
      Ende: meta.Ende,
      Sitzung: sessionArrayToObject(sessionItems),
    };

    let yamlString = yaml.dump(dataToExport, {
      lineWidth: -1,
      noRefs: true,
      replacer: (_key, value) => (
            value === null ? "" : 
            value === "'" ? "\'" : 
            value
          ),
    });

    yamlString = yamlString.replace(/^(Date|Start|Ende):\s*'(.+?)'/gm, "$1: $2");

    const blob = new Blob([yamlString], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Protokoll_${meta.Date || "Export"}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSendToDiscord = async () => {
    if (
      !(await confirm(
        "Möchtest du das Protokoll wirklich an Discord senden?",
        { title: "An Discord senden" }
      ))
    ) {
      return;
    }

    const passwordResult = await prompt("Bitte Passwort eingeben:", {
      title: "Passwort benötigt",
      hiddenInput: true,
    });
    if (passwordResult === null) return; // User cancelled

    const password = typeof passwordResult === "string" ? passwordResult : undefined;

    const dataToExport = {
      FSR: fsrMembers,
      Protokollant: protocolant[0] || "",
      WeiterePersonen: guests,
      Date: meta.Date,
      Start: meta.Start,
      Ende: meta.Ende,
      Sitzung: sessionArrayToObject(sessionItems),
    };

    const yamlString = yaml.dump(dataToExport, {
      lineWidth: -1,
      noRefs: true,
      replacer: (_key, value) =>
        value === null ? "" : value === "'" ? "'" : value,
    });

    const result = await sendToDiscord(yamlString, meta.Date || "Export", password);
    
    if (result.success) {
      await alert(result.message, { title: "Erfolg" });
    } else {
      await alert("Fehler: " + result.message, { title: "Fehler", destructive: true });
    }
  };

  const addTopic = () => {
    setSessionItems([
      ...sessionItems,
      { id: `new-${Date.now()}`, topic: "Neues Thema", points: [""] },
    ]);
  };

  const updateTopicTitle = (id: string, newTitle: string) => {
    setSessionItems((items) =>
      items.map((item) => (item.id === id ? { ...item, topic: newTitle } : item))
    );
  };

  const removeTopic = (id: string) => {
    setSessionItems((items) => items.filter((item) => item.id !== id));
  };

  const addPoint = (topicId: string) => {
    setSessionItems((items) =>
      items.map((item) => {
        if (item.id === topicId) return { ...item, points: [...item.points, ""] };
        return item;
      })
    );
  };

  const updatePoint = (topicId: string, pointIndex: number, val: string) => {
    setSessionItems((items) =>
      items.map((item) => {
        if (item.id === topicId) {
          const newPoints = [...item.points];
          newPoints[pointIndex] = val;
          return { ...item, points: newPoints };
        }
        return item;
      })
    );
  };

  const removePoint = (topicId: string, pointIndex: number) => {
    setSessionItems((items) =>
      items.map((item) => {
        if (item.id === topicId) {
          const newPoints = item.points.filter((_, idx) => idx !== pointIndex);
          return { ...item, points: newPoints };
        }
        return item;
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSessionItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return {
    fsrMembers,
    setFsrMembers,
    guests,
    setGuests,
    protocolant,
    setProtocolant,
    meta,
    setMeta,
    sessionItems,
    setSessionItems,
    fileInputRef,
    handleFileUpload,
    handleImportFileClick,
    handlePasteFromClipboard,
    handleExport,
    handleSendToDiscord,
    addTopic,
    updateTopicTitle,
    removeTopic,
    addPoint,
    updatePoint,
    removePoint,
    handleDragEnd,
    resetProtocol,
  };
};

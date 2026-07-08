import {
  asRegisteredSessionCommand,
  defineSessionCommand,
} from "@/common/sessionCommandBase";

type TodoListItem = {
  topic: string;
  deadline: string;
};

type TodoListArgs = {
  title: string;
  items: TodoListItem[];
};

export default asRegisteredSessionCommand(
  defineSessionCommand<TodoListArgs>({
    name: "todolist",
    description: "Todo-Liste mit Themen und Fristen einfügen",
    arguments: [
      {
        name: "title",
        label: "Titel",
        type: "string",
        required: true,
        placeholder: "Todo list",
      },
      {
        name: "items",
        label: "Aufgaben",
        type: "list",
        required: true,
        minItems: 1,
        itemLabel: "Aufgabe",
        addLabel: "Aufgabe hinzufügen",
        fields: [
          {
            name: "topic",
            label: "Thema",
            type: "string",
            required: true,
            placeholder: "Beschreibung",
          },
          {
            name: "deadline",
            label: "Frist",
            type: "date",
            required: false,
          },
        ],
      },
    ],
    execute: (args) => {
      const lines = args.items.map((item) => {
        const deadline = item.deadline ? ` (bis ${item.deadline})` : "";
        return `- [ ] ${item.topic}${deadline}`;
      });

      return {
        text: `${args.title}\n${lines.join("\n")}`,
        data: { type: "todolist", title: args.title, items: args.items },
        shouldReplaceCommand: true,
      };
    },
  })
);

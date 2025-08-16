import { schemaType } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export type messageItem = {
  id: string;
  type: "schema" | "sql";
  userInput: string;
  dbSchema?: string;
  result: schemaType | string;
  isLoading: boolean;
};

interface AppState {
  mode: "schema" | "sql";
  userInput: string;
  dbSchemaInput: string;
  isLoading: boolean;
  history: messageItem[];

  setMode: (mode: "schema" | "sql") => void;
  setUserInput: (input: string) => void;
  setDbSchemaInput: (input: string) => void;

  handleSubmit: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: "schema",
  userInput: "",
  dbSchemaInput: "",
  isLoading: false,
  history: [],

  setMode: (mode) => set({ mode }),
  setUserInput: (input) => set({ userInput: input }),
  setDbSchemaInput: (input) => set({ dbSchemaInput: input }),

  handleSubmit: async () => {
    const { mode, userInput, dbSchemaInput } = get();
    if (!userInput) {
      return;
    }

    const newMessageId = uuidv4();

    const newMessageItem: messageItem = {
      id: newMessageId,
      type: mode,
      userInput: userInput,
      dbSchema: dbSchemaInput,
      result: "",
      isLoading: true,
    };

    set((state) => ({
      isLoading: true,
      history: [...state.history, newMessageItem],
      userInput: "",
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptType: mode,
          description: userInput,
          db_schema: dbSchemaInput,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      let finalResult: schemaType | string = "";

      if (mode === "schema") {
        const data = await response.json();
        finalResult = data.schema;
      } else {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        let streamedText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          streamedText += decoder.decode(value);

          set((state) => ({
            history: state.history.map((item) =>
              item.id === newMessageId
                ? {
                    ...item,
                    result: streamedText,
                  }
                : item
            ),
          }));
        }

        finalResult = streamedText;
      }
      set((state) => ({
        history: state.history.map((item) =>
          item.id === newMessageId
            ? { ...item, result: finalResult, isLoading: false }
            : item
        ),
        isLoading: false,
      }));

      console.log(finalResult);
    } catch (err) {
      console.error("An error occured during fetch:", err);

      set((state) => ({
        history: state.history.map((item) =>
          item.id === newMessageId
            ? { ...item, result: "An error occurred.", isLoading: false }
            : item
        ),
      }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

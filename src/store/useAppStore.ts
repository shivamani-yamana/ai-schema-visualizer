import { schemaType } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export type messageItem = {
  id: string;
  type: "schema_visualization" | "sql_query" | "conversational";
  userInput: string;
  result: schemaType | string;
  isLoading: boolean;
};

interface AppState {
  userInput: string;
  isLoading: boolean;
  history: messageItem[];

  setUserInput: (input: string) => void;

  handleSubmit: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  userInput: "",
  isLoading: false,
  history: [],

  setUserInput: (input) => set({ userInput: input }),

  handleSubmit: async () => {
    const { userInput } = get();

    if (!userInput) return;

    const newMessageId: string = uuidv4();

    const newMessage: messageItem = {
      id: newMessageId,
      type: "conversational",
      userInput: userInput,
      result: "",
      isLoading: true,
    };

    set((state) => ({
      history: [...state.history, newMessage],
      userInput: "",
      isLoading: true,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const res = await response.json();

      let finalResult: schemaType | string;

      switch (res.intent) {
        case "schema_visualization":
          finalResult = res.data as schemaType;
          break;
        case "sql_query":
          finalResult = res.data.query as string;
          break;
        case "conversational":
          finalResult = res.data.response as string;
          break;
        default:
          throw new Error("Invalid format received from API");
      }

      set((state) => ({
        history: state.history.map((item) =>
          item.id === newMessageId
            ? {
                ...item,
                type: res.intent,
                result: finalResult,
                isLoading: false,
              }
            : item
        ),
      }));
    } catch (error) {
      console.error("Failed to handle submit:", error);
      set((state) => ({
        history: state.history.map((item) =>
          item.id === newMessageId
            ? {
                ...item,
                result: "An error occurred. Please try again.",
                isLoading: false,
              }
            : item
        ),
      }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

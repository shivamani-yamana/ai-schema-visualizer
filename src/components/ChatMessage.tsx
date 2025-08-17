import { useAppStore } from "@/store/useAppStore";
import { Snippet } from "@heroui/react";
import SchemaVisualizer from "./SchemaVisualizer";
import { schemaType } from "@/lib/types";

export default function ChatMessage({ id }: { id: number }) {
  const { history } = useAppStore();
  if (id >= history.length) return;
  const { userInput, isLoading, result, type } = history[id];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end my-2 w-full">
        <div className="flex items-end gap-2">
          <div className="bg-blue-600 px-4 py-2 rounded-4xl rounded-br-none max-w-xl text-white">
            {userInput}
          </div>
          <div className="flex justify-center items-center bg-gray-800 rounded-full w-8 h-8">
            U
          </div>
        </div>
      </div>
      {/* AI Part */}
      <div className="flex justify-start my-2 w-full">
        <div className="flex items-end gap-2">
          <div className="flex justify-center items-center bg-gray-800 rounded-full w-8 h-8">
            AI
          </div>
          <div>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span
                  className="bg-white rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="bg-white rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="bg-white rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </span>
            ) : type === "sql_query" ? (
              <Snippet
                symbol=""
                tooltipProps={{
                  color: "foreground",
                  content: "Copy this SQL Query",
                  disableAnimation: true,
                  placement: "right",
                  closeDelay: 0,
                }}
              >
                {result as string}
              </Snippet>
            ) : type === "conversational" ? (
              <p>{result as string}</p>
            ) : (
              <SchemaVisualizer data={result as schemaType} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

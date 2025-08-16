import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, streamText } from "ai";

import { z } from "zod/v4";

const google = createGoogleGenerativeAI();

const schema_generation_schema = z.object({
  tables: z.array(
    z.object({
      name: z.string().describe("The name of the SQL table."),
      sql: z
        .string()
        .describe("The complete 'CREATE TABLE' SQL statement for this table."),
      columns: z.array(
        z.object({
          name: z.string().describe("Column name"),
          dataType: z.string().describe("SQL data type"),
          isPrimaryKey: z.boolean(),
          isForeignKey: z.boolean(),
        })
      ),
    })
  ),
  relationships: z.array(
    z.object({
      from: z.string().describe("The table containing the foreign key."),
      to: z.string().describe("The table being referenced."),
    })
  ),
});

const SCHEMA_PROMPT_URL = process.env.SCHEMA_PROMPT_URL || "";
const SQL_PROMPT_URL = process.env.SQL_PROMPT_URL || "";

async function getPrompt(type: string) {
  switch (type) {
    case "schema":
      const schemaRes = await fetch(SCHEMA_PROMPT_URL);
      return schemaRes.text();
    case "sql":
      const sqlRes = await fetch(SQL_PROMPT_URL);
      return sqlRes.text();
    default:
      return "";
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const user_description = body.description;
  const promptType = body.promptType;

  if (!user_description || !promptType) {
    return new Response(
      JSON.stringify({
        error: "Desription and Prompt Type is required.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (promptType === "schema") {
    const schemaGenerationPrompt = await getPrompt("schema");
    schemaGenerationPrompt.replace("{{input}}", user_description);
    try {
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: schema_generation_schema,
        prompt: schemaGenerationPrompt,
      });

      return new Response(
        JSON.stringify({
          schema: object,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("Error in API route:", err);

      return new Response(
        JSON.stringify({
          error: "Failed to generate Schema",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } else if (promptType === "sql") {
    const db_schema = body.db_schema;
    if (!db_schema) {
      return new Response(
        JSON.stringify({
          error: "Database Schema is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const queryPrompt = await getPrompt("sql");
    queryPrompt.replace("{{dbSchema}}", db_schema);
    queryPrompt.replace("{{input}}", user_description);

    try {
      const { textStream } = await streamText({
        model: google("gemini-2.5-flash"),
        prompt: queryPrompt,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const text of textStream) {
            controller.enqueue(encoder.encode(text));
          }

          controller.close();
        },
      });

      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    } catch (err) {
      console.error("Error in API route:", err);

      return new Response(
        JSON.stringify({
          error: "Failed to generate SQL Query",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "applicaiton/json",
          },
        }
      );
    }
  }
}

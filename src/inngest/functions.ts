import prisma from "@/lib/database";
import { inngest } from "./client";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openAi = createOpenAI();
const anthropic = createAnthropic(); // do not have key for this one

export const execute = inngest.createFunction(
  { id: "execute-ai", retries: 1 },
  { event: "execute/gemini-ai" },
  async ({ event, step }) => {
    // Gemini
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "How deep is the deepest part of the great lakes? ",
      }
    );

    // OpenAi
    const { steps: openAiSteps } = await step.ai.wrap(
      "openAi-generate-text",
      generateText,
      {
        model: openAi("gpt-4"),
        system: "You are an expert aviator",
        prompt: "Explain to me what is ILS as if I was brand new to aviation",
      }
    );

    // Anthropic
    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-3-7-sonnet-20250219"),
        system: "You are a software engineer",
        prompt:
          "In your opinion what is the best languge to learn when moving from a Frontend Engineer (JS) to a backend engineer that wants to learn a backend language?",
      }
    );
    return {
      geminiSteps,
      openAiSteps,
      anthropicSteps,
    };
  }
);

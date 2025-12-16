import prisma from "@/lib/database";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", retries: 0 },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // fetching
    await step.sleep("fetching data from google", "5s");

    // transcribing
    await step.sleep("transcirbing data with chattie", "5s");

    // doing stuff
    await step.sleep("putting everythign together", "5s");

    await step.run("creating-workflow-result", () => {
      return prisma.workflow.create({
        data: {
          name: "test-from-ingest",
        },
      });
    });
  }
);

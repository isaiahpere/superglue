import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { NodeType } from "@/generated/prisma/enums";

import prisma from "@/lib/database";
import { topoplogicalSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-worfklow", retries: 1 }, // TODO: update retires for production
  {
    event: "worfklows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) throw new NonRetriableError("Workflow Id is missing");

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: { nodes: true, connections: true },
      });

      return topoplogicalSort(workflow.nodes, workflow.connections);
    });

    // initialData is set by items such as googleForm webhook to pass down form data.
    // data is captured and pass it down in our next call to inngest.
    let context = event.data.initialData || {};

    // execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  },
);

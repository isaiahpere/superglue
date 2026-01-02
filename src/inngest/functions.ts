import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { NodeType } from "@/generated/prisma/enums";

import prisma from "@/lib/database";
import { topoplogicalSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/executor-registry";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-worfklow", retries: 3 },
  { event: "worfklows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;

    console.log("executeWorkflow-Event");
    console.log(event);

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

    // init context with initial data from trigger
    // usecase webhooks could pass data, we capture it here and pass it down in our next call to inngest.
    let context = event.data.initialData || {};

    // execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);

import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topoplogicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  // if zero nodes are connected returned nodes
  if (connections.length === 0) {
    return nodes;
  }

  // edges array for toposort
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // add nodes with zero connections as self-edges to be included
  const connectedNodes = new Set<string>();
  for (const connection of connections) {
    connectedNodes.add(connection.fromNodeId);
    connectedNodes.add(connection.toNodeId);
  }
  for (const node of nodes) {
    if (!connectedNodes.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // topological sort
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    // remove dups (from self edges)
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (err) {
    if (err instanceof Error && err.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw err;
  }

  // map sorted IDs back to node object
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

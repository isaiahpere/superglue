"use client";

import { useState, useCallback, useMemo } from "react";
import { useSetAtom } from "jotai";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import { nodeComponents } from "@/config/node-components";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { AddNodeButton } from "./add-node-button";
import { editorAtom } from "../store/atoms";

import "@xyflow/react/dist/style.css";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        fitView
        onInit={setEditor}
        // multi selection
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        // proOptions={{
        //   hideAttribution: true,
        // }}
      >
        <Background />
        <Controls />
        <MiniMap />
        {/* add custom componets */}
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

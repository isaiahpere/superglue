import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Fetch all workflows using suspense
 * @returns return list of user workflows
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
};

/**
 * Create a new workflow
 */
export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions());
      },
      onError: (error) => {
        toast.error(`failed to create workflow: ${error?.message}`);
      },
    })
  );
};

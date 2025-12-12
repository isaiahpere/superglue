import { getQueryClient, trpc } from "@/trpc/server";
import { caller } from "@/trpc/server";
import { Client } from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";

const Home = async () => {
  const queryClient = getQueryClient();
  //server use
  const users = await caller.getUsers();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  // Client
  // const trpc = useTRPC();
  // const {data: users} = useQuery(trpc.getUsers.queryOptions())
  return (
    <main>
      <h1 className="text-blue-600 text-5xl">This is home page</h1>
      <p>This is a second paragraph</p>
      <p>another paragraph</p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
      {/* {JSON.stringify(users)} */}
    </main>
  );
};

export default Home;

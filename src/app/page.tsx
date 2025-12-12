import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Home = async () => {
  await requireAuth();
  const data = await caller.getUsers();
  return (
    <main>
      <h1 className="text-blue-600 text-5xl">This is home page</h1>
      <div>{JSON.stringify(data, null, 2)}</div>
      <LogoutButton />
    </main>
  );
};

export default Home;

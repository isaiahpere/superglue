import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    <div>
      <p>Workflow Page</p>
    </div>
  );
};

export default Page;

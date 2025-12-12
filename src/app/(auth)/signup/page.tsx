import { RegisterForm } from "@/features/auth/components/register-form";
import { requireAuth, requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return (
    <section>
      <RegisterForm />
    </section>
  );
};

export default Page;

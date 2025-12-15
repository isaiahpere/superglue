import { RegisterForm } from "@/features/auth/components/register-form";
import { requireAuth, requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return (
    <>
      <h2 className="sr-only" id="auth-form">
        Register Form
      </h2>
      <RegisterForm />
    </>
  );
};

export default Page;

import Image from "next/image";
import Link from "next/link";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section
      className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10"
      aria-labelledby="auth-form"
    >
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 self-center font-semibold"
        >
          <Image
            src="/logos/logo.svg"
            alt="company logo"
            width={30}
            height={30}
          />
          Superglue
        </Link>
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;

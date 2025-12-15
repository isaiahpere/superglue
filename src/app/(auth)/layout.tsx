import AuthLayout from "@/features/auth/components/auth-layout";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;

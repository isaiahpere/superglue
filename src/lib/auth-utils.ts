import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Utils are for user experience and not a security data access layer.
 * Data access security is handled on the server.
 */

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
};

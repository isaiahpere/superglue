import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database";
import { headers } from "next/headers";
import { polarClient } from "@/lib/polar";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({
      status: "none",
      isSubscribed: false,
    });
  }

  const { result: subscriptions } = await polarClient.subscriptions.list({
    externalCustomerId: user.id,
  });

  const activeSubscriptions = subscriptions.items.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  return NextResponse.json({
    isSubscribed: Boolean(activeSubscriptions),
    subscription: activeSubscriptions ?? null,
  });
}

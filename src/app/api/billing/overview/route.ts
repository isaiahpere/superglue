import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { polarClient } from "@/lib/polar";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { result: subscriptions } = await polarClient.subscriptions.list({
    externalCustomerId: session?.user.id,
  });

  const customerId = subscriptions.items[0]?.customerId;
  console.log("\n");
  console.log("Customer ID : ", customerId);
  console.log("\n");

  const [ordersRes, subsRes] = await Promise.all([
    polarClient.orders.list({
      customerId: customerId,
      limit: 20,
    }),
    polarClient.subscriptions.list({
      customerId: customerId,
    }),
  ]);

  const activeSubscription = subsRes.result.items.find(
    (s) => s.status === "active" || s.status === "trialing"
  );

  const orders = ordersRes.result.items;

  return NextResponse.json({
    subscription: activeSubscription ?? null,
    orders: orders,
  });
}

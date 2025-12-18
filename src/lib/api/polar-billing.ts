import * as Sentry from "@sentry/nextjs";

export const startCheckout = async (slug: string) => {
  const res = await fetch("/api/auth/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ slug }),
  });

  if (!res.ok) {
    Sentry.logger.error("Failed to start polar checkout");
    throw new Error("Failed to start checkout");
  }

  const data = await res.json();

  if (!data?.url) {
    Sentry.logger.error("Failed to start polar checkout ");
    throw new Error("Checkout URL missing");
  }

  return data.url as string;
};

// Portal not being exposed for some reason
// export const startBillingPortal = async () => {
//   const res = await fetch("/api/auth/portal", {
//     method: "POST",
//     credentials: "include",
//   });

//   const text = await res.text();
//   console.log("PORTAL RESPONSE:", res, res.status, text);

//   if (!res.ok) {
//     throw new Error("Failed to open billing portal");
//   }

//   const data = JSON.parse(text);

//   if (!data?.url) {
//     throw new Error("Billing portal URL missing");
//   }

//   return data.url;
// };

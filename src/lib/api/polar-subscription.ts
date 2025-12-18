import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import * as Sentry from "@sentry/nextjs";

export type SubscriptionApiResponse = {
  isSubscribed: boolean;
  subscription: Subscription;
};

export const fetchSubscription = async (): Promise<SubscriptionApiResponse> => {
  const res = await fetch("/api/billing/subscription", {
    credentials: "include",
  });

  if (!res.ok) {
    Sentry.logger.error("Failed to fetch Polar Subscription");
    throw new Error("Failed to fetch subscription");
  }

  return res.json();
};

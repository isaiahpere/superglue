import { useQuery } from "@tanstack/react-query";

/**
 * @deprecated this is no longer needed since import { polarClient } from "@polar-sh/better-auth/client"; works with next.js 15.5.9 & turbopack
 */
export const useBillingOverview = () => {
  return useQuery({
    queryKey: ["billing-overview"],
    queryFn: async () => {
      const res = await fetch("/api/billing/overview", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load billing data");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};

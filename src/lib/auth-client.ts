import { createAuthClient } from "better-auth/react";

// IMPORTANT:
// Must import from @polar-sh/better-auth/client
// Server entrypoint breaks Turbopack / App Router
import { polarClient } from "@polar-sh/better-auth/client";

export const authClient = createAuthClient({
  plugins: [polarClient()],
});

/**
 * As of 12/17/25 Polar does not want to be configurable with better-auth 1.4.6 and next.js 15.5.9.
 * The server plugins get correctly configured but when I attempt to set up the client plugins for
 * polar, turbopack break as it tries to include it in the build which is not the case.
 *
 * For now, the portal and memebership cancellations will not work until better-auth and portal get
 * their stuff together.
 */

"use client";
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// No baseURL: requests go to the current origin (/api/auth/*), which Next.js proxies to the Express server.
export const authClient = createAuthClient({ plugins: [jwtClient()] });

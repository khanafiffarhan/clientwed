import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fast gate: unauthenticated visitors never see private pages. Role checks happen in the dashboard layout
// (verified against the server) and again on every API call by the Express JWT + role middleware.
export function middleware(req: NextRequest) {
  if (!getSessionCookie(req)) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/services/:id+", "/payment/:path*", "/profile"] };

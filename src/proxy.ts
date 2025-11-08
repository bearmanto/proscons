import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const res = NextResponse.next();

  // Only set once
  if (!request.cookies.get("uid")) {
    const uid = crypto.randomUUID(); // Web Crypto in the Edge runtime
    res.cookies.set({
      name: "uid",
      value: uid,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 5, // 5 years
    });
  }

  return res;
}

// Run on app routes and skip static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|js|css|map)$).*)",
  ],
};

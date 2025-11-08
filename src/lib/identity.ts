import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "uid";
const FIVE_YEARS = 60 * 60 * 24 * 365 * 5;

/**
 * Returns a stable anonymous user key and ensures it exists as an httpOnly cookie.
 * NOTE: With Next.js 15/16, `cookies()` is async. Call this from Route Handlers or
 * Server Actions when you need to set cookies. In Server Components, reading works
 * but setting will be ignored.
 */
export async function getOrSetUserKey(): Promise<string> {
  const store = await cookies();
  let uid = store.get(COOKIE_NAME)?.value;
  if (!uid) {
    uid = randomUUID();
    store.set({
      name: COOKIE_NAME,
      value: uid,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: FIVE_YEARS,
    });
  }
  return uid;
}

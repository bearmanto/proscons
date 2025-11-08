import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "uid";
const FIVE_YEARS = 60 * 60 * 24 * 365 * 5;

export function getOrSetUserKey(): string {
  const store = cookies();
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

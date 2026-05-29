import { buildClearCookie } from "@/lib/auth";
import { ok } from "@/lib/api-helpers";


export async function POST() {
  const response = ok({ message: "Logged out" });
  response.headers.set("Set-Cookie", buildClearCookie());
  return response;
}

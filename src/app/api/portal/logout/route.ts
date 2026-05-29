import { buildClientClearCookie } from "@/lib/client-auth";
import { ok } from "@/lib/api-helpers";


export async function POST() {
  const response = ok({ message: "Logged out" });
  response.headers.set("Set-Cookie", buildClientClearCookie());
  return response;
}

import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";

export function isBookingAdmin(user: ChatGPTUser | null) {
  return Boolean(user && env.CARTIME_ADMIN_USER_ID && user.userId === env.CARTIME_ADMIN_USER_ID);
}

export async function currentBookingAdmin() {
  const user = await getChatGPTUser();
  return isBookingAdmin(user) ? user : null;
}

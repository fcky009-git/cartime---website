import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";

export function isBookingAdmin(user: ChatGPTUser | null) {
  if (!user) return false;
  const adminId = env.CARTIME_ADMIN_USER_ID?.trim();
  const adminEmail = env.CARTIME_ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(
    (adminId && user.userId === adminId) ||
    (adminEmail && user.email.trim().toLowerCase() === adminEmail),
  );
}

export async function currentBookingAdmin() {
  const user = await getChatGPTUser();
  return isBookingAdmin(user) ? user : null;
}

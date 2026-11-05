import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/locales";

export default function AdminRedirect() {
  redirect(`/${defaultLocale}/admin`);
}

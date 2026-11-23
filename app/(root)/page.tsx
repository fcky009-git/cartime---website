import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@/lib/locales";

export default function Home() {
  permanentRedirect(`/${defaultLocale}`);
}

import { notFound } from "next/navigation";
import CarTimeSite from "@/components/site";
import { dictionaries, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "az" }, { locale: "en" }];
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  return <CarTimeSite locale={locale as Locale} />;
}

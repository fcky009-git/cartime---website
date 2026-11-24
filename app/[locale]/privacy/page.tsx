import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import { isLocale, localeParams } from "@/lib/locales";
import { measurementCopy } from "@/lib/measurement-copy";
import { privacyCopy } from "@/lib/privacy-copy";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/lib/service-info";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() { return localeParams(); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    ...pageMetadata(locale, "privacy", measurementCopy[locale].privacy, privacyCopy[locale].draft),
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const policy = privacyCopy[locale];
  return <InfoShell locale={locale} current="privacy">
    <main>
      <header className="info-hero">
        <div className="container info-hero-inner">
          <h1>{measurementCopy[locale].privacy}</h1>
          <p>{policy.draft}</p>
        </div>
      </header>
      <article className="info-article container">
        <section>
          <p>{policy.request}</p>
          <p>{policy.measurement}</p>
          <p>{policy.contact} <a href={`mailto:${contact.email}`}><bdi>{contact.email}</bdi></a>.</p>
        </section>
      </article>
    </main>
  </InfoShell>;
}

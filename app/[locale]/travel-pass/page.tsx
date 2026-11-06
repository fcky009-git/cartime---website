import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale,localeParams } from "@/lib/locales";
import { pageMetadata } from "@/lib/seo";
import { travelUi } from "@/lib/travel-ui";
import InfoShell from "@/components/info-shell";
import TravelPass from "@/components/travel-pass";
import JsonLd from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";
export function generateStaticParams(){return localeParams();}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return {};return {...pageMetadata(locale,"travel-pass",travelUi[locale].lookup,travelUi[locale].lead),robots:{index:false,follow:false},referrer:"no-referrer"};}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <InfoShell locale={locale} current="travel-pass"><JsonLd data={breadcrumbJsonLd(locale,[{name:travelUi[locale].lookup,path:"travel-pass"}])}/><TravelPass locale={locale}/></InfoShell>;}

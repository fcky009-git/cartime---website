import { notFound } from "next/navigation";

// Sends unknown addresses such as /en/abc to the branded app/[locale]/not-found.tsx.
export default function UnknownPage() {
  notFound();
}

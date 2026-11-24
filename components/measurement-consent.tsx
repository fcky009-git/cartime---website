"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import type { MeasurementChoice } from "@/lib/analytics";
import type { Locale } from "@/lib/locales";
import { measurementCopy } from "@/lib/measurement-copy";
import "@/app/measurement-consent.css";

function subscribe(onChange: () => void) {
  window.addEventListener("cartime-measurement-change", onChange);
  return () => window.removeEventListener("cartime-measurement-change", onChange);
}

const readChoice = () => window.cartimeMeasurement ? window.cartimeMeasurement.getChoice() : undefined;
const readServerChoice = () => undefined;

export default function MeasurementConsent({ locale }: { locale: Locale }) {
  const choice = useSyncExternalStore(subscribe, readChoice, readServerChoice);
  const [opened, setOpened] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);
  const copy = measurementCopy[locale];

  useEffect(() => {
    if (opened) dialogRef.current?.showModal();
  }, [opened]);

  if (choice === undefined) return null;

  function choose(next: MeasurementChoice) {
    window.cartimeMeasurement?.setChoice(next);
  }

  if (choice === null) return <aside className="measurement-banner" aria-labelledby="measurement-title">
    <h2 id="measurement-title">{copy.title}</h2>
    <MeasurementActions locale={locale} onChoose={choose} />
  </aside>;

  return <>
    <button ref={settingsRef} type="button" className="measurement-settings" aria-label={copy.settings} title={copy.settings} onClick={() => setOpened(true)}><Cookie size={19} aria-hidden="true" /></button>
    <dialog ref={dialogRef} className="measurement-dialog" aria-labelledby="measurement-dialog-title" onClose={() => { setOpened(false); settingsRef.current?.focus(); }}>
      <h2 id="measurement-dialog-title">{copy.title}</h2>
      <MeasurementActions locale={locale} onChoose={(next) => { dialogRef.current?.close(); choose(next); }} />
    </dialog>
  </>;
}


function MeasurementActions({ locale, onChoose }: { locale: Locale; onChoose: (choice: MeasurementChoice) => void }) {
  const copy = measurementCopy[locale];
  return <>
    <p>{copy.message} <a href={`/${locale}/privacy`}>{copy.privacy}</a></p>
    <div className="measurement-actions">
      <button type="button" onClick={() => onChoose("reject")}>{copy.reject}</button>
      <button type="button" onClick={() => onChoose("allow")}>{copy.allow}</button>
    </div>
  </>;
}

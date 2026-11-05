"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, X } from "lucide-react";
import fleet from "@/lib/fleet.json";
import fleetImages from "@/lib/fleet-images.json";
import { fleetUi } from "@/lib/fleet-ui";
import type { Locale } from "@/lib/locales";
import { saveShortlist, shareLink, useShortlist } from "@/lib/shortlist";
import { upgradeUi } from "@/lib/upgrade-ui";

const images = fleetImages as Record<string, string>;

export default function CarCompare({ locale }: { locale: Locale }) {
  const t = upgradeUi[locale].shortlist;
  const f = fleetUi[locale];
  const { ids, toggle } = useShortlist();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hadCars = useRef(false);
  const [copied, setCopied] = useState(false);
  const cars = ids.map((id) => fleet.find((car) => car.id === id)).filter((car) => !!car);

  // A shared link opens the same comparison on another device.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("compare");
    if (!shared) return;
    saveShortlist(shared.split(","));
    dialogRef.current?.showModal();
  }, []);

  // Close the window once the last car is removed, but not while a shared list is still loading.
  useEffect(() => {
    if (hadCars.current && !cars.length && dialogRef.current?.open) dialogRef.current.close();
    hadCars.current = cars.length > 0;
  }, [cars.length]);

  async function share() {
    const result = await shareLink(`${window.location.origin}/${locale}?compare=${ids.join(",")}`, t.title);
    if (result === "copied") { setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
  }

  return <>
    {cars.length > 0 && <div className="compare-tray" role="region" aria-label={t.title}>
      <div className="compare-tray-photos" aria-hidden="true">{cars.map((car) => <img key={car.id} src={images[car.id]} alt="" />)}</div>
      <button type="button" className="compare-tray-open" onClick={() => dialogRef.current?.showModal()}>{t.compare} ({cars.length})</button>
      <button type="button" className="compare-tray-clear" aria-label={t.clear} title={t.clear} onClick={() => saveShortlist([])}><X size={16} /></button>
    </div>}
    <dialog ref={dialogRef} className="compare-dialog" aria-labelledby="compare-title" onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
      <div className="compare-panel">
        <div className="compare-head">
          <h2 id="compare-title">{t.title}</h2>
          <button type="button" className="compare-share" onClick={() => void share()}>{copied ? <Check size={16} /> : <Link2 size={16} />}<span role="status">{copied ? t.copied : t.share}</span></button>
          <button type="button" className="compare-close" aria-label={t.close} onClick={() => dialogRef.current?.close()}><X size={20} /></button>
        </div>
        <div className="compare-scroll">
          <table>
            <thead><tr><td />{cars.map((car) => <th scope="col" key={car.id}>
              <img src={images[car.id]} alt="" />
              <strong>{car.name}</strong>
              <small>{car.year}, {f.categories[car.category]}</small>
              <button type="button" onClick={() => toggle(car.id)}>{t.remove}</button>
            </th>)}</tr></thead>
            <tbody>
              {f.durations.map((duration, index) => {
                const lowest = Math.min(...cars.map((car) => car.ratesUsd[index]));
                return <tr key={duration}><th scope="row">{duration}<small>{f.perDay}</small></th>{cars.map((car) => {
                  const isLowest = cars.length > 1 && car.ratesUsd[index] === lowest;
                  return <td key={car.id} className={isLowest ? "lowest" : ""}>${car.ratesUsd[index]}{isLowest && <span className="sr-only"> ({t.lowest})</span>}</td>;
                })}</tr>;
              })}
              <tr className="compare-actions"><td />{cars.map((car) => <td key={car.id}><a href={`/${locale}/booking?car=${car.id}`}>{t.book}</a></td>)}</tr>
            </tbody>
          </table>
        </div>
      </div>
    </dialog>
  </>;
}

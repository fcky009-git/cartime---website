"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import fleet from "@/lib/fleet.json";
import fleetImages from "@/lib/fleet-images.json";
import { dayCountLabel } from "@/lib/count-labels";
import { fleetUi } from "@/lib/fleet-ui";
import type { Locale } from "@/lib/locales";
import { addDaysIso, rateTierIndex } from "@/lib/rental-duration";
import { upgradeUi, type TripType } from "@/lib/upgrade-ui";

const tripClasses: Record<TripType, string[]> = {
  city: ["Mini", "Economy", "Comfort"],
  road: ["SUV", "Comfort"],
  business: ["Business", "Luxury"],
  group: ["VAN", "SUV"],
};
const trips: TripType[] = ["city", "road", "business", "group"];
const budgets = [0, 50, 100, 200];
const images = fleetImages as Record<string, string>;

export default function CarFinder({ locale, today, onOpenCar }: { locale: Locale; today: string; onOpenCar: (id: string) => void }) {
  const t = upgradeUi[locale].finder;
  const f = fleetUi[locale];
  const [trip, setTrip] = useState<TripType>("city");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(0);
  const tier = rateTierIndex(days);

  const matches = useMemo(() => {
    const classes = tripClasses[trip];
    return fleet
      .filter((car) => classes.includes(car.category) && (!budget || car.ratesUsd[tier] <= budget))
      .sort((a, b) => classes.indexOf(a.category) - classes.indexOf(b.category) || a.ratesUsd[tier] - b.ratesUsd[tier])
      .slice(0, 3);
  }, [trip, budget, tier]);

  const start = today ? addDaysIso(today, 1) : "";
  const dates = start ? `&from=${start}&to=${addDaysIso(start, days)}` : "";

  return <section className="section car-finder" id="finder" aria-labelledby="car-finder-title">
    <div className="container car-finder-grid">
      <div className="car-finder-controls">
        <h2 id="car-finder-title">{t.title}</h2>
        <p>{t.lead}</p>
        <fieldset><legend>{t.trip}</legend><div className="car-finder-options">{trips.map((key) => <button key={key} type="button" aria-pressed={trip === key} onClick={() => setTrip(key)}>{t.trips[key]}</button>)}</div></fieldset>
        <div className="car-finder-days">
          <label htmlFor="car-finder-range">{t.days}</label>
          <output htmlFor="car-finder-range">{dayCountLabel(locale, days)}</output>
          <input id="car-finder-range" type="range" min={2} max={45} value={days} aria-valuetext={dayCountLabel(locale, days)} onChange={(event) => setDays(Number(event.target.value))} />
        </div>
        <fieldset><legend>{t.budget}</legend><div className="car-finder-options">{budgets.map((value) => <button key={value} type="button" aria-pressed={budget === value} onClick={() => setBudget(value)}>{value ? `${t.upTo} $${value}` : t.anyBudget}</button>)}</div></fieldset>
      </div>
      <div className="car-finder-results" aria-live="polite">
        {matches.length ? matches.map((car) => <article key={car.id}>
          <button type="button" className="car-finder-photo" onClick={() => onOpenCar(car.id)} aria-label={`${t.details}: ${car.name} ${car.year}`}><img src={images[car.id]} alt="" /></button>
          <div className="car-finder-name"><h3>{car.name}</h3><p>{car.year}, {f.categories[car.category]}</p><span>${car.ratesUsd[tier]} {f.perDay}</span></div>
          <div className="car-finder-total"><small>{t.total}</small><strong>${car.ratesUsd[tier] * days}</strong><a href={`/${locale}/booking?car=${car.id}${dates}`}>{t.book}<ArrowRight size={15} aria-hidden="true" /></a></div>
        </article>) : <p className="car-finder-empty">{t.empty}</p>}
        <small className="car-finder-note">{t.note}</small>
      </div>
    </div>
  </section>;
}

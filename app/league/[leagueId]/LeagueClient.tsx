"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

interface VenueItem {
  id: string;
  name: string;
  team: string;
  city: string;
  state: string;
  capacity: number;
  roof: "open" | "retractable" | "fixed" | string;
}

interface LeagueClientProps {
  leagueName: string;
  venues: VenueItem[];
}

export default function LeagueClient({ leagueName, venues }: LeagueClientProps) {
  const [query, setQuery] = useState("");
  const [roof, setRoof] = useState<string>("all");
  const [sort, setSort] = useState<string>("name-asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = venues.filter((v) =>
      q
        ? v.name.toLowerCase().includes(q) ||
          v.team.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.state.toLowerCase().includes(q)
        : true
    );

    if (roof !== "all") {
      list = list.filter((v) => v.roof === roof);
    }

    switch (sort) {
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "capacity-desc":
        list.sort((a, b) => b.capacity - a.capacity);
        break;
      case "capacity-asc":
        list.sort((a, b) => a.capacity - b.capacity);
        break;
      default:
        break;
    }

    return list;
  }, [venues, query, roof, sort]);

  return (
    <div className="box-border w-full max-w-full overflow-x-hidden">
      <div className="box-border grid gap-3 grid-cols-1 mb-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${leagueName} venues (team, city, name)`}
            aria-label={`Search ${leagueName} venues`}
            className="box-border w-full h-11 rounded-lg border border-gray-200 px-3 text-sm md:h-12 md:text-base md:px-4"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <label className="flex items-center gap-2">
            <span>Roof</span>
            <select value={roof} onChange={(e) => setRoof(e.target.value)} className="box-border h-10 rounded-lg border border-gray-200 px-2.5 bg-white md:h-11 md:text-base md:px-3 md:min-w-[100px]">
              <option value="all">All</option>
              <option value="open">Open Air</option>
              <option value="retractable">Retractable</option>
              <option value="fixed">Covered</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="box-border h-10 rounded-lg border border-gray-200 px-2.5 bg-white md:h-11 md:text-base md:px-3 md:min-w-[100px]">
              <option value="name-asc">Name (A→Z)</option>
              <option value="name-desc">Name (Z→A)</option>
              <option value="capacity-desc">Capacity (High→Low)</option>
              <option value="capacity-asc">Capacity (Low→High)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="box-border grid grid-cols-1 gap-4 w-full max-w-full overflow-x-hidden md:grid-cols-2 md:gap-3 lg:grid-cols-3">
        {filtered.map((venue) => (
          <Link
            key={venue.id}
            href={`/venue/${venue.id}`}
            className="block bg-white border-2 border-gray-200 rounded-xl p-4 no-underline text-inherit transition-all box-border w-full max-w-full min-w-0 overflow-hidden break-words hover:shadow-lg hover:-translate-y-0.5 md:p-5 md:min-h-[100px] md:touch-manipulation md:[-webkit-tap-highlight-color:rgba(33,150,243,0.1)] md:cursor-pointer active:md:scale-[0.98] active:md:bg-blue-50 active:md:border-primary-600 active:md:shadow-[0_2px_8px_rgba(37,99,235,0.15)]"
          >
            <div className="flex justify-between items-start gap-3">
              <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1 md:text-xl md:leading-normal md:whitespace-normal">{venue.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 md:px-3 md:py-1.5 md:text-[13px] md:font-bold ${
                  venue.roof === "fixed"
                    ? "bg-green-100 text-green-800"
                    : venue.roof === "retractable"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {venue.roof === "fixed"
                  ? "🏢 Covered"
                  : venue.roof === "retractable"
                  ? "🏟️ Retractable"
                  : "☀️ Open Air"}
              </span>
            </div>
            <p className="text-ink-700 my-1.5 font-medium overflow-hidden text-ellipsis whitespace-nowrap md:text-base md:my-2 md:whitespace-normal">{venue.team}</p>
            <p className="text-ink-700 text-[13px] mb-2 overflow-hidden text-ellipsis whitespace-nowrap md:text-[15px] md:whitespace-normal">📍 {venue.city}, {venue.state}</p>
            <div className="flex justify-between items-center text-ink-700 text-[13px] flex-wrap gap-2 md:text-sm md:gap-3">
              <span>🏟️ {venue.capacity.toLocaleString()} seats</span>
              <span className="text-primary-600 font-semibold md:text-base md:py-2 md:block md:text-center">View Shade Guide →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-ink-700 p-6 border border-dashed border-gray-200 rounded-xl">No venues match your filters.</div>
        )}
      </div>
    </div>
  );
}
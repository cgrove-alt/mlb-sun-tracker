"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./LeagueClient.module.css";

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
    <div className={styles.leagueClient}>
      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${leagueName} venues (team, city, name)`}
            aria-label={`Search ${leagueName} venues`}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          <label className={styles.filter}>
            <span>Roof</span>
            <select value={roof} onChange={(e) => setRoof(e.target.value)} className={styles.filterSelect}>
              <option value="all">All</option>
              <option value="open">Open Air</option>
              <option value="retractable">Retractable</option>
              <option value="fixed">Covered</option>
            </select>
          </label>
          <label className={styles.filter}>
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.filterSelect}>
              <option value="name-asc">Name (A→Z)</option>
              <option value="name-desc">Name (Z→A)</option>
              <option value="capacity-desc">Capacity (High→Low)</option>
              <option value="capacity-asc">Capacity (Low→High)</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((venue) => (
          <Link
            key={venue.id}
            href={`/venue/${venue.id}`}
            className={styles.card}
          >
            <div className={styles.cardHead}>
              <h3>{venue.name}</h3>
              <span
                className={`${styles.badge} ${
                  venue.roof === "fixed"
                    ? styles.badgeCovered
                    : venue.roof === "retractable"
                    ? styles.badgeRetractable
                    : styles.badgeOpen
                }`}
              >
                {venue.roof === "fixed"
                  ? "🏢 Covered"
                  : venue.roof === "retractable"
                  ? "🏟️ Retractable"
                  : "☀️ Open Air"}
              </span>
            </div>
            <p className={styles.muted}>{venue.team}</p>
            <p className={styles.sub}>📍 {venue.city}, {venue.state}</p>
            <div className={styles.meta}>
              <span>🏟️ {venue.capacity.toLocaleString()} seats</span>
              <span className={styles.cta}>View Shade Guide →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>No venues match your filters.</div>
        )}
      </div>
    </div>
  );
}
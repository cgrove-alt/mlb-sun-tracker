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
    <div className="league-client">
      <div className="controls">
        <div className="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${leagueName} venues (team, city, name)`}
            aria-label={`Search ${leagueName} venues`}
          />
        </div>
        <div className="filters">
          <label className="filter">
            <span>Roof</span>
            <select value={roof} onChange={(e) => setRoof(e.target.value)}>
              <option value="all">All</option>
              <option value="open">Open Air</option>
              <option value="retractable">Retractable</option>
              <option value="fixed">Covered</option>
            </select>
          </label>
          <label className="filter">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name-asc">Name (A→Z)</option>
              <option value="name-desc">Name (Z→A)</option>
              <option value="capacity-desc">Capacity (High→Low)</option>
              <option value="capacity-asc">Capacity (Low→High)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid">
        {filtered.map((venue) => (
          <Link
            key={venue.id}
            href={`/venue/${venue.id}`}
            className="card"
          >
            <div className="card-head">
              <h3>{venue.name}</h3>
              <span
                className={`badge ${
                  venue.roof === "fixed"
                    ? "badge-covered"
                    : venue.roof === "retractable"
                    ? "badge-retractable"
                    : "badge-open"
                }`}
              >
                {venue.roof === "fixed"
                  ? "🏢 Covered"
                  : venue.roof === "retractable"
                  ? "🏟️ Retractable"
                  : "☀️ Open Air"}
              </span>
            </div>
            <p className="muted">{venue.team}</p>
            <p className="sub">📍 {venue.city}, {venue.state}</p>
            <div className="meta">
              <span>🏟️ {venue.capacity.toLocaleString()} seats</span>
              <span className="cta">View Shade Guide →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="empty">No venues match your filters.</div>
        )}
      </div>

      <style jsx>{`
        .controls {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
          margin-bottom: 16px;
        }
        @media (min-width: 768px) {
          .controls {
            grid-template-columns: 1fr auto;
            align-items: center;
          }
        }
        .search input {
          width: 100%;
          height: 44px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 0 12px;
          font-size: 14px;
        }
        .filters { display: flex; gap: 12px; flex-wrap: wrap; }
        .filter { display: flex; align-items: center; gap: 8px; }
        .filter select {
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 0 10px;
          background: #fff;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
        }
        .card {
          display: block;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .card:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .badge { padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .badge-open { background: #fef3c7; color: #92400e; }
        .badge-retractable { background: #dbeafe; color: #1e40af; }
        .badge-covered { background: #dcfce7; color: #166534; }
        .muted { color: #4b5563; margin: 6px 0; }
        .sub { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
        .meta { display: flex; justify-content: space-between; align-items: center; color: #6b7280; font-size: 13px; }
        .cta { color: #2563eb; font-weight: 600; }
        .empty { text-align: center; color: #6b7280; padding: 24px; border: 1px dashed #e5e7eb; border-radius: 12px; }
      `}</style>
    </div>
  );
}
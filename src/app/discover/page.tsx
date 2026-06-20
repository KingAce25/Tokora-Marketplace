"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Event, EventCategory } from "../../components/types";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = "Date" | "Distance" | "Free" | "Paid" | "Popular";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Web3 Lagos Summit 2025",
    date: "2025-06-14",
    time: "8:00 AM - 7:00 PM",
    venue: "Eko Convention Center",
    organizer: { id: "o1", name: "TechAfrica DAO", color: "#FF6B2C" },
    categories: ["Web3"],
    tags: ["Trending"],
    cryptoPrice: "0.05 SOL",
    rating: 4.6,
    going: 1246,
    isTrending: true,
  },
  {
    id: "2",
    title: "Afrobeats Underground Night",
    date: "2025-06-20",
    time: "8:00 PM - 3:00 AM",
    venue: "Tins Podium",
    organizer: { id: "o2", name: "Rhythm Collective", color: "#a78bfa" },
    categories: ["Music"],
    tags: ["Free"],
    rating: 4.0,
    going: 900,
    isTrending: true,
  },
  {
    id: "3",
    title: "Founders & Funders Mixer",
    date: "2025-07-02",
    time: "6:00 PM - 10:00 PM",
    venue: "Co-Create Hub",
    organizer: { id: "o3", name: "Startup Lagos", color: "#fbbf24" },
    categories: ["Business"],
    tags: ["Trending"],
    cryptoPrice: "0.02 SOL",
    rating: 1.0,
    going: 320,
    isTrending: true,
  },
  {
    id: "4",
    title: "Campus Dev Hackathon",
    date: "2025-07-08",
    time: "9:00 AM - 6:00 PM",
    venue: "UNILAG Adeniran Auditorium",
    organizer: { id: "o4", name: "DevLagos", color: "#34d399" },
    categories: ["Campus"],
    tags: ["Free"],
    rating: 4.1,
    going: 521,
    isTrending: false,
  },
  {
    id: "5",
    title: "Lagos Music Festival",
    date: "2025-07-15",
    time: "4:00 PM - 11:00 PM",
    venue: "Eko Atlantic Park",
    organizer: { id: "o5", name: "SoundCity Events", color: "#f472b6" },
    categories: ["Music"],
    tags: ["Trending"],
    price: 15000,
    rating: 4.8,
    going: 3200,
    isTrending: true,
  },
  {
    id: "6",
    title: "DeFi Deep Dive Workshop",
    date: "2025-07-20",
    time: "10:00 AM - 4:00 PM",
    venue: "Hub One, Victoria Island",
    organizer: { id: "o6", name: "ChainBuilders NG", color: "#60a5fa" },
    categories: ["Web3"],
    tags: ["Trending"],
    cryptoPrice: "0.01 SOL",
    rating: 4.3,
    going: 210,
    isTrending: false,
  },
];

const FILTERS: FilterType[] = ["Date", "Distance", "Free", "Paid", "Popular"];

// ─── API hook ─────────────────────────────────────────────────────────────────

function useDiscoverEvents(activeFilters: FilterType[], query: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Replace with real API call:
    // const params = new URLSearchParams();
    // activeFilters.forEach(f => params.append("filter", f));
    // if (query) params.set("q", query);
    // fetch(`/api/discover?${params}`)
    //   .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
    //   .then(data => setEvents(data.events))
    //   .catch(e => setError(e.message))
    //   .finally(() => setLoading(false));

    const timer = setTimeout(() => {
      try {
        let filtered = [...MOCK_EVENTS];
        if (activeFilters.includes("Free"))
          filtered = filtered.filter((e) => e.tags.includes("Free"));
        if (activeFilters.includes("Paid"))
          filtered = filtered.filter((e) => !e.tags.includes("Free"));
        if (activeFilters.includes("Popular"))
          filtered = [...filtered].sort((a, b) => b.going - a.going);
        if (activeFilters.includes("Date"))
          filtered = [...filtered].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
        if (query.trim())
          filtered = filtered.filter(
            (e) =>
              e.title.toLowerCase().includes(query.toLowerCase()) ||
              e.venue.toLowerCase().includes(query.toLowerCase()) ||
              e.organizer.name.toLowerCase().includes(query.toLowerCase()),
          );
        setEvents(filtered);
      } catch {
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [activeFilters, query]);

  return { events, loading, error };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF6B2C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridEventCard({
  event,
  onClick,
  animationDelay = "0ms",
}: {
  event: Event;
  onClick?: (e: Event) => void;
  animationDelay?: string;
}) {
  const [pressed, setPressed] = useState(false);
  const isFree = event.tags.includes("Free");

  return (
    <button
      onClick={() => onClick?.(event)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ animationDelay }}
      className={`
        animate-cardIn w-full text-left rounded-2xl overflow-hidden
        bg-[#1e1e1e] border border-white/5
        transition-transform duration-150 ease-out
        ${pressed ? "scale-[0.96]" : "scale-100"}
        shadow-[0_2px_12px_rgba(0,0,0,0.4)]
        group
      `}
    >
      {/* Image */}
      <div className="relative w-full h-32.5 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={100}
            height={130}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="text-white text-[13px] font-bold leading-snug line-clamp-2 min-h-8.5">
          {event.title}
        </p>
        <p className="text-[#6b6b6b] text-[11px]">{formatDate(event.date)}</p>
        {isFree ? (
          <p className="text-emerald-400 text-[11px] font-semibold">Free</p>
        ) : event.cryptoPrice ? (
          <p className="text-[#FF6B2C] text-[11px] font-semibold">
            {event.cryptoPrice}
          </p>
        ) : event.price ? (
          <p className="text-[#FF6B2C] text-[11px] font-semibold">
            ₦{event.price.toLocaleString()}
          </p>
        ) : null}
      </div>
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonGridCard() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden bg-[#1e1e1e] border border-white/5">
      <div className="h-32.5 bg-[#2a2a2a]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#2a2a2a] rounded-full w-4/5" />
        <div className="h-2.5 bg-[#2a2a2a] rounded-full w-3/5" />
        <div className="h-2.5 bg-[#2a2a2a] rounded-full w-2/5" />
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-20 gap-4 animate-fadeIn">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-[#6b6b6b] text-sm text-center max-w-50">{message}</p>
      <button
        onClick={onRetry}
        className="px-5 py-2 rounded-full bg-[#FF6B2C] text-white text-sm font-semibold
          active:scale-95 transition-transform duration-150"
      >
        Try Again
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-20 gap-3 animate-fadeIn">
      <div className="w-14 h-14 rounded-full bg-[#FF6B2C]/10 flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF6B2C"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <p className="text-[#6b6b6b] text-sm text-center">
        No events match your filters.
        <br />
        Try adjusting your search.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { events, loading, error } = useDiscoverEvents(
    activeFilters,
    debouncedQuery,
  );

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const handleRetry = useCallback(() => {
    setActiveFilters([]);
    setSearchQuery("");
  }, []);

  return (
    <div
      className="
      fixed inset-0
      w-full overflow-x-hidden overflow-y-auto
      bg-[#0f0f0f] text-white
      pb-25
      font-[system-ui,-apple-system,'Helvetica_Neue',sans-serif]
      [-webkit-overflow-scrolling:touch]
    "
    >
      {/* ── Header ── */}
      <div className="px-4 pt-10 pb-4 animate-headerIn">
        <h1 className="text-[28px] font-extrabold tracking-tight">Discover</h1>
      </div>

      {/* ── Search ── */}
      <div
        className="px-4 mb-4 animate-slideDown"
        style={{ animationDelay: "60ms" }}
      >
        <div
          className="
          flex items-center gap-3
          bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-3.5
          focus-within:border-[#FF6B2C]/50 transition-colors duration-200
        "
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b6b6b"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search events, organizers, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-white text-sm placeholder:text-[#4a4a4a] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="shrink-0 text-[#6b6b6b] active:scale-90 transition-transform"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div
        className="mb-2 animate-slideDown"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
          {FILTERS.map((filter) => {
            const active = activeFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`
                  shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold
                  border transition-all duration-200 active:scale-95
                  ${
                    active
                      ? "bg-[#FF6B2C] border-[#FF6B2C] text-white shadow-[0_0_10px_rgba(255,107,44,0.35)]"
                      : "bg-transparent border-white/15 text-[#aaa]"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Clear filters */}
        {activeFilters.length > 0 && (
          <div className="px-4 mt-2.5 flex items-center gap-2 animate-fadeIn">
            <span className="text-[#6b6b6b] text-[11px]">
              {activeFilters.length} filter{activeFilters.length > 1 ? "s" : ""}{" "}
              active
            </span>
            <button
              onClick={() => setActiveFilters([])}
              className="text-[#FF6B2C] text-[11px] font-semibold active:opacity-70 transition-opacity"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Event count ── */}
      {!loading && !error && (
        <div className="px-4 mb-3 mt-3 animate-fadeIn">
          <span className="text-[#6b6b6b] text-xs">
            {events.length} event{events.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            [0, 1, 2, 3, 4, 5].map((i) => <SkeletonGridCard key={i} />)
          ) : error ? (
            <ErrorState message={error} onRetry={handleRetry} />
          ) : events.length === 0 ? (
            <EmptyState />
          ) : (
            events.map((event, i) => (
              <GridEventCard
                key={event.id}
                event={event}
                animationDelay={`${i * 50}ms`}
                onClick={(e) => {
                  router.push(`/events/${e.id}`);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

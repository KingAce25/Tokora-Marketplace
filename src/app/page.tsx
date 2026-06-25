// 📁 FILE LOCATION: app/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Event, EventCategory } from "../components/types";
import { TrendingCard, EventListCard } from "../components/EventCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Web3 Lagos Summit 2025",
    date: "2025-06-18",
    time: "8:00 AM - 7:00 PM",
    venue: "Eko Convention Center",
    organizer: { id: "o1", name: "TechAfrica DAO", color: "#FF6B2C" },
    categories: ["Web3"],
    tags: ["Trending"],
    cryptoPrice: "0.02 SOL",
    rating: 4.6,
    going: 1246,
    isTrending: true,
  },
  {
    id: "2",
    title: "Afrobeats Underground Night",
    date: "2025-06-30",
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
    date: "2025-06-08",
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
];

const CATEGORIES: EventCategory[] = [
  "All",
  "Web3",
  "Music",
  "Business",
  "Campus",
];

// ─── API hook ─────────────────────────────────────────────────────────────────

function useEvents(category: EventCategory, query: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // ── Swap this block for your real API call ────────────────────────────────
    // const controller = new AbortController();
    // const timeout = setTimeout(() => controller.abort(), 10000); // 10s hard timeout
    // fetch(`/api/events?category=${category}&q=${encodeURIComponent(query)}`, {
    //   signal: controller.signal,
    // })
    //   .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
    //   .then(data => { if (!cancelled) setEvents(data.events ?? []); })
    //   .catch(e => { if (!cancelled) setError(e.name === "AbortError" ? "Request timed out." : "Failed to load events."); })
    //   .finally(() => { clearTimeout(timeout); if (!cancelled) setLoading(false); });
    // return () => { cancelled = true; controller.abort(); };
    // ──────────────────────────────────────────────────────────────────────────

    // Mock: always resolves, never hangs
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        let filtered = [...MOCK_EVENTS];
        if (category !== "All")
          filtered = filtered.filter((e) => e.categories.includes(category));
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
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, query]);

  return { events, loading, error };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`
        animate-pulse rounded-2xl overflow-hidden
        bg-[#1e1e1e] border border-white/5
        ${tall ? "w-full" : "flex-shrink-0 w-[200px]"}
      `}
    >
      <div className={`bg-[#2a2a2a] ${tall ? "h-[150px]" : "h-[110px]"}`} />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#2a2a2a] rounded-full w-3/4" />
        <div className="h-2.5 bg-[#2a2a2a] rounded-full w-1/2" />
        <div className="h-2.5 bg-[#2a2a2a] rounded-full w-2/3" />
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
    <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fadeIn">
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
      <p className="text-[#6b6b6b] text-sm text-center max-w-[220px]">
        {message}
      </p>
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
    <div className="flex flex-col items-center justify-center py-16 gap-3 animate-fadeIn">
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
        No events found.
        <br />
        Try a different search or category.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<EventCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { events, loading, error } = useEvents(activeCategory, debouncedQuery);
  const trendingEvents = events.filter((e) => e.isTrending);
  const allEvents = events;

  const handleRetry = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("All");
  }, []);

  // Navigate to event detail page — single source of truth for both card lists
  const handleEventClick = useCallback(
    (event: Event) => {
      router.push(`/events/${event.id}`);
    },
    [router],
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div
      className="
      relative w-full
      bg-[#0f0f0f] text-white
      pb-[100px]
      font-[system-ui,-apple-system,'Helvetica_Neue',sans-serif]
      [-webkit-overflow-scrolling:touch]
    "
    >
      {/* ── Header ── */}
      <div className="px-4 pt-10 pb-4 animate-headerIn">
        <p className="text-[#6b6b6b] text-xs tracking-wide mb-0.5">
          {greeting}
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-extrabold tracking-tight">
            Discover Events
          </h1>
          <div className="flex items-center gap-2.5">
            {/* Bell */}
            <button
              className="
              relative w-9 h-9 rounded-full bg-[#1e1e1e] border border-white/8
              flex items-center justify-center
              active:scale-90 transition-transform duration-150
            "
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B2C] ring-2 ring-[#0f0f0f]" />
            </button>
            {/* Avatar */}
            <button
              className="
              w-9 h-9 rounded-full bg-[#FF6B2C]/20 border border-[#FF6B2C]/40
              flex items-center justify-center
              active:scale-90 transition-transform duration-150
            "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF6B2C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div
        className="px-4 mb-3 animate-slideDown"
        style={{ animationDelay: "60ms" }}
      >
        <div
          className="
          flex items-center gap-2.5
          bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-3
          focus-within:border-[#FF6B2C]/50 transition-colors duration-200
        "
        >
          <svg
            width="16"
            height="16"
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
            ref={searchRef}
            type="text"
            placeholder="Search events, organizers, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-white text-sm placeholder:text-[#4a4a4a] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="flex-shrink-0 text-[#6b6b6b] active:scale-90 transition-transform"
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

      {/* ── Location ── */}
      <div
        className="px-4 mb-4 animate-slideDown"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-1.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF6B2C"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[#6b6b6b] text-xs">Lagos, Nigeria</span>
        </div>
      </div>

      {/* ── Category filters ── */}
      <div
        className="mb-5 animate-slideDown"
        style={{ animationDelay: "140ms" }}
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold
                transition-all duration-200 active:scale-95
                ${
                  activeCategory === cat
                    ? "bg-[#FF6B2C] text-white shadow-[0_0_12px_rgba(255,107,44,0.4)]"
                    : "bg-[#1e1e1e] text-[#6b6b6b] border border-white/8"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Trending Now ── */}
      <section
        className="mb-6 animate-slideDown"
        style={{ animationDelay: "180ms" }}
      >
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold">Trending Now</h2>
          <button className="text-[#FF6B2C] text-xs font-semibold active:opacity-70 transition-opacity">
            See all
          </button>
        </div>

        {loading ? (
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-4">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : trendingEvents.length > 0 ? (
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-4">
            {trendingEvents.map((event, i) => (
              <TrendingCard
                key={event.id}
                event={event}
                animationDelay={`${i * 80}ms`}
                onClick={handleEventClick}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* ── All Events ── */}
      <section
        className="px-4 animate-slideDown"
        style={{ animationDelay: "220ms" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold">All Events</h2>
          <span className="text-[#6b6b6b] text-xs">
            {loading ? "…" : `${allEvents.length} events`}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} tall />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : allEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {allEvents.map((event, i) => (
              <EventListCard
                key={event.id}
                event={event}
                animationDelay={`${i * 60}ms`}
                onClick={handleEventClick}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

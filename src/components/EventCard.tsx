"use client";

import { useState } from "react";
import type { Event } from "./types";
import Image from "next/image";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PriceBadge({ event }: { event: Event }) {
  if (event.tags.includes("Free"))
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        Free
      </span>
    );
  if (event.cryptoPrice)
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF6B2C]/20 text-[#FF6B2C] border border-[#FF6B2C]/30">
        {event.cryptoPrice}
      </span>
    );
  if (event.price)
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF6B2C]/20 text-[#FF6B2C] border border-[#FF6B2C]/30">
        ₦{event.price.toLocaleString()}
      </span>
    );
  return null;
}

function OrganizerDot({ organizer }: { organizer: Event["organizer"] }) {
  return organizer.avatarUrl ? (
    <Image
      src={organizer.avatarUrl}
      alt={organizer.name}
      className="w-4 h-4 rounded-full object-cover ring-1 ring-white/10"
      width={16}
      height={16}
    />
  ) : (
    <span
      className="w-4 h-4 rounded-full shrink-0"
      style={{ background: organizer.color ?? "#FF6B2C" }}
    />
  );
}

function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF6B2C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

// ─── Trending (horizontal) card ───────────────────────────────────────────────

interface TrendingCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  animationDelay?: string;
}

export function TrendingCard({
  event,
  onClick,
  animationDelay = "0ms",
}: TrendingCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => onClick?.(event)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ animationDelay }}
      className={`
        animate-cardIn
        shrink-0 w-50 rounded-2xl overflow-hidden
        bg-[#1e1e1e] border border-white/5
        text-left cursor-pointer
        transition-transform duration-200 ease-out
        ${pressed ? "scale-[0.97]" : "scale-100"}
        hover:border-[#FF6B2C]/30
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        group
      `}
    >
      {/* Image */}
      <div className="relative w-full h-27.5 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
        {/* Badges row */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
          {event.isTrending && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FF6B2C] text-white">
              Trending
            </span>
          )}
          <div className="ml-auto">
            <PriceBadge event={event} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-white text-[13px] font-semibold leading-snug line-clamp-1">
          {event.title}
        </p>
        <p className="text-[#6b6b6b] text-[10px] leading-tight">
          {formatDate(event.date)} · {event.venue}
        </p>
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <OrganizerDot organizer={event.organizer} />
            <span className="text-[#6b6b6b] text-[10px] truncate max-w-20">
              {event.organizer.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF6B2C">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-[#6b6b6b] text-[10px]">
              {event.rating.toFixed(1)} ·{" "}
              {event.going >= 1000
                ? `${(event.going / 1000).toFixed(1)}k`
                : event.going}{" "}
              going
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── All Events (vertical) card ───────────────────────────────────────────────

interface EventListCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  animationDelay?: string;
}

export function EventListCard({
  event,
  onClick,
  animationDelay = "0ms",
}: EventListCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => onClick?.(event)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ animationDelay }}
      className={`
        animate-cardIn
        w-full rounded-2xl overflow-hidden
        bg-[#1e1e1e] border border-white/5
        text-left cursor-pointer
        transition-transform duration-200 ease-out
        ${pressed ? "scale-[0.985]" : "scale-100"}
        hover:border-[#FF6B2C]/25
        shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        group
      `}
    >
      {/* Image */}
      <div className="relative w-full h-37.5 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={100}
            height={100}
          />
        ) : (
          <ImagePlaceholder />
        )}
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
          {event.isTrending && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF6B2C] text-white">
              Trending
            </span>
          )}
          <div className="ml-auto">
            <PriceBadge event={event} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-white text-[15px] font-bold leading-snug line-clamp-2">
          {event.title}
        </p>
        <p className="text-[#6b6b6b] text-[11px]">
          {formatDate(event.date)} · {event.time} · {event.venue}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <OrganizerDot organizer={event.organizer} />
            <span className="text-[#6b6b6b] text-[11px]">
              {event.organizer.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF6B2C">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-[#6b6b6b] text-[11px]">
              {event.rating.toFixed(1)} ·{" "}
              {event.going >= 1000
                ? `${(event.going / 1000).toFixed(1)}k`
                : event.going}{" "}
              going
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

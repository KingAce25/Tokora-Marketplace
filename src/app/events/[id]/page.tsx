"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import type { EventDetail, TicketTier } from "../../../components/types";
import TicketSheet from "../../../components/TicketSheet";
import PaymentSheet from "../../../components/PaymentSheet";
import Image from "next/image";

// ─── Mock data layer (replace with real API) ──────────────────────────────────
// In production this whole block disappears — only useEventDetail()'s fetch
// call matters. Kept here so the page works standalone during development.

const MOCK_DETAILS: Record<string, EventDetail> = {
  "1": {
    id: "1",
    title: "Web3 Lagos Summit 2025",
    date: "2025-06-14",
    time: "10:00 AM",
    venue: "Eko Convention Center",
    organizer: { id: "o1", name: "TechAfrica DAO", color: "#FF6B2C" },
    organizerRole: "Event Organizer",
    isFollowingOrganizer: false,
    categories: ["Web3"],
    tags: ["Trending"],
    cryptoPrice: "0.05 SOL",
    rating: 4.8,
    ratingBasis: "Based on past events",
    going: 1240,
    attendingCount: 1240,
    isTrending: true,
    description:
      "Join Africa's most anticipated Web3 summit. Connect with founders, investors, and builders shaping the future of decentralized technology across the continent. Expect keynotes, panels, live demos, and unmatched networking opportunities.",
    attendeePreview: [
      { id: "a1", name: "Tola", color: "#FF6B2C" },
      { id: "a2", name: "Ife", color: "#a78bfa" },
      { id: "a3", name: "Chidi", color: "#34d399" },
    ],
    ticketTiers: [
      {
        id: "t1",
        name: "General Access",
        perks: "Entry + digital NFT ticket",
        priceLabel: "0.05 SOL",
        priceValue: 0.05,
        currency: "SOL",
        spotsLeft: 200,
        isMostPopular: true,
      },
      {
        id: "t2",
        name: "VIP Experience",
        perks: "Priority entry + lounge + exclusive NFT",
        priceLabel: "0.15 SOL",
        priceValue: 0.15,
        currency: "SOL",
        spotsLeft: 42,
      },
      {
        id: "t3",
        name: "Speaker Seating",
        perks: "Front row + speaker meet & greet + rare NFT",
        priceLabel: "0.30 SOL",
        priceValue: 0.3,
        currency: "SOL",
        spotsLeft: 5,
      },
    ],
  },

  "2": {
    id: "2",
    title: "Afrobeats Underground Night",
    date: "2025-06-30",
    time: "8:00 PM",
    venue: "Tins Podium",
    organizer: { id: "o2", name: "Rhythm Collective", color: "#a78bfa" },
    organizerRole: "Event Organizer",
    isFollowingOrganizer: false,
    categories: ["Music"],
    tags: ["Free"],
    rating: 4.0,
    ratingBasis: "Based on past events",
    going: 900,
    attendingCount: 900,
    isTrending: true,
    description:
      "An intimate underground night celebrating the rawest Afrobeats talent in Lagos. Live sets from rising artists, immersive sound, and a crowd that lives for the music. Doors open at 8PM — come early, it fills up fast.",
    attendeePreview: [
      { id: "a4", name: "Bisi", color: "#f472b6" },
      { id: "a5", name: "Kunle", color: "#60a5fa" },
      { id: "a6", name: "Ada", color: "#fbbf24" },
    ],
    ticketTiers: [
      {
        id: "t1",
        name: "General Entry",
        perks: "Standing access + welcome drink",
        priceLabel: "Free",
        priceValue: 0,
        currency: "NGN",
        spotsLeft: 300,
        isMostPopular: true,
      },
      {
        id: "t2",
        name: "Reserved Table",
        perks: "Seated section + bottle service",
        priceLabel: "₦25,000",
        priceValue: 25000,
        currency: "NGN",
        spotsLeft: 18,
      },
    ],
  },

  "3": {
    id: "3",
    title: "Founders & Funders Mixer",
    date: "2025-07-02",
    time: "6:00 PM",
    venue: "Co-Create Hub",
    organizer: { id: "o3", name: "Startup Lagos", color: "#fbbf24" },
    organizerRole: "Event Organizer",
    isFollowingOrganizer: true,
    categories: ["Business"],
    tags: ["Trending"],
    cryptoPrice: "0.02 SOL",
    rating: 4.5,
    ratingBasis: "Based on past events",
    going: 320,
    attendingCount: 320,
    isTrending: true,
    description:
      "A curated evening connecting early-stage founders with angel investors and VCs active across West Africa. Pitch practice, warm intros, and candid conversations over drinks — no decks required, just good energy and sharp ideas.",
    attendeePreview: [
      { id: "a7", name: "Seun", color: "#34d399" },
      { id: "a8", name: "Mariam", color: "#FF6B2C" },
      { id: "a9", name: "David", color: "#a78bfa" },
    ],
    ticketTiers: [
      {
        id: "t1",
        name: "Founder Pass",
        perks: "Entry + 2-min pitch slot",
        priceLabel: "0.02 SOL",
        priceValue: 0.02,
        currency: "SOL",
        spotsLeft: 60,
        isMostPopular: true,
      },
      {
        id: "t2",
        name: "Investor Pass",
        perks: "Entry + curated founder intros",
        priceLabel: "0.04 SOL",
        priceValue: 0.04,
        currency: "SOL",
        spotsLeft: 25,
      },
    ],
  },

  "4": {
    id: "4",
    title: "Campus Dev Hackathon",
    date: "2025-06-08",
    time: "9:00 AM",
    venue: "UNILAG Adeniran Auditorium",
    organizer: { id: "o4", name: "DevLagos", color: "#34d399" },
    organizerRole: "Event Organizer",
    isFollowingOrganizer: false,
    categories: ["Campus"],
    tags: ["Free"],
    rating: 4.1,
    ratingBasis: "Based on past events",
    going: 521,
    attendingCount: 521,
    isTrending: false,
    description:
      "24 hours of building, breaking, and shipping. Open to all students — bring a team or find one on-site. Mentors from top Lagos tech companies will be on hand, with prizes for the best projects across multiple tracks.",
    attendeePreview: [
      { id: "a10", name: "Funmi", color: "#60a5fa" },
      { id: "a11", name: "Emeka", color: "#fbbf24" },
      { id: "a12", name: "Zainab", color: "#f472b6" },
    ],
    ticketTiers: [
      {
        id: "t1",
        name: "Participant",
        perks: "Entry + meals + swag pack",
        priceLabel: "Free",
        priceValue: 0,
        currency: "NGN",
        spotsLeft: 150,
        isMostPopular: true,
      },
      {
        id: "t2",
        name: "Spectator Pass",
        perks: "Demo day access only",
        priceLabel: "Free",
        priceValue: 0,
        currency: "NGN",
        spotsLeft: 80,
      },
    ],
  },

  "5": {
    id: "5",
    title: "Lagos Music Festival",
    date: "2025-07-15",
    time: "4:00 PM",
    venue: "Eko Atlantic Park",
    organizer: { id: "o5", name: "SoundCity Events", color: "#f472b6" },
    organizerRole: "Event Organizer",
    isFollowingOrganizer: false,
    categories: ["Music"],
    tags: ["Trending"],
    price: 15000,
    rating: 4.8,
    ratingBasis: "Based on past events",
    going: 3200,
    attendingCount: 3200,
    isTrending: true,
    description:
      "The biggest open-air music festival on the Lagos calendar returns. A full day lineup spanning Afrobeats, amapiano, and alté across three stages, with food vendors, art installations, and a sunset main-stage closing set.",
    attendeePreview: [
      { id: "a13", name: "Tobi", color: "#FF6B2C" },
      { id: "a14", name: "Halima", color: "#34d399" },
      { id: "a15", name: "Chuka", color: "#60a5fa" },
    ],
    ticketTiers: [
      {
        id: "t1",
        name: "General Admission",
        perks: "Full day access, all stages",
        priceLabel: "₦15,000",
        priceValue: 15000,
        currency: "NGN",
        spotsLeft: 800,
        isMostPopular: true,
      },
      {
        id: "t2",
        name: "VIP Deck",
        perks: "Elevated viewing + private bar",
        priceLabel: "₦45,000",
        priceValue: 45000,
        currency: "NGN",
        spotsLeft: 60,
      },
      {
        id: "t3",
        name: "Backstage Pass",
        perks: "Artist meet & greet + VIP deck",
        priceLabel: "₦90,000",
        priceValue: 90000,
        currency: "NGN",
        spotsLeft: 8,
      },
    ],
  },
};

// ─── API hook (wire your real endpoint here) ───────────────────────────────────

function useEventDetail(id: string) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(() => {
    setLoading(true);
    setError(null);

    // ── Replace this block with your real API call ──────────────────────────
    // fetch(`/api/events/${id}`)
    //   .then(r => {
    //     if (r.status === 404) throw new Error("NOT_FOUND");
    //     if (!r.ok) throw new Error(r.statusText);
    //     return r.json();
    //   })
    //   .then(data => setEvent(data))
    //   .catch(e => setError(e.message === "NOT_FOUND" ? "NOT_FOUND" : "Failed to load event. Please try again."))
    //   .finally(() => setLoading(false));
    // ────────────────────────────────────────────────────────────────────────

    const timer = setTimeout(() => {
      try {
        const data = MOCK_DETAILS[id];
        if (!data) {
          setError("NOT_FOUND");
        } else {
          setEvent(data);
        }
      } catch {
        setError("Failed to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => fetchEvent(), [fetchEvent]);

  return { event, loading, error, refetch: fetchEvent };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

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
        width="64"
        height="64"
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

function AttendeeAvatar({
  attendee,
  index,
}: {
  attendee: { color?: string; avatarUrl?: string; name: string };
  index: number;
}) {
  return attendee.avatarUrl ? (
    <Image
      src={attendee.avatarUrl}
      alt={attendee.name}
      style={{ marginLeft: index === 0 ? 0 : -10, zIndex: 10 - index }}
      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#141414] relative"
    />
  ) : (
    <span
      style={{
        background: attendee.color ?? "#FF6B2C",
        marginLeft: index === 0 ? 0 : -10,
        zIndex: 10 - index,
      }}
      className="w-8 h-8 rounded-full ring-2 ring-[#141414] relative flex items-center justify-center text-[10px] font-bold text-white"
    >
      {attendee.name.charAt(0)}
    </span>
  );
}

// ─── Skeleton (lazy-load placeholder matching final layout) ───────────────────

function DetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 w-full overflow-x-hidden overflow-y-auto bg-[#0f0f0f] text-white pb-25">
      {/* Hero */}
      <div className="relative w-full h-65 bg-[#2a2a2a] animate-pulse">
        <button
          onClick={onBack}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform z-10"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div className="px-4 pt-5 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-[#1e1e1e] rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-[#1e1e1e] rounded-full animate-pulse" />
        </div>
        <div className="h-7 w-3/4 bg-[#1e1e1e] rounded-lg animate-pulse" />
        <div className="h-14 w-full bg-[#1e1e1e] rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[#1e1e1e] rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-4 w-40 bg-[#1e1e1e] rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#1e1e1e] rounded-lg animate-pulse" />
          <div className="h-3 w-full bg-[#1e1e1e] rounded-lg animate-pulse" />
          <div className="h-3 w-2/3 bg-[#1e1e1e] rounded-lg animate-pulse" />
        </div>
        <div className="space-y-2.5 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-[#1e1e1e] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Not found state ────────────────────────────────────────────────────────────

function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 w-full bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-4 px-8 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-[#1e1e1e] flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF6B2C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <p className="text-white text-base font-semibold text-center">
        Event not found
      </p>
      <p className="text-[#6b6b6b] text-sm text-center">
        This event may have been removed or the link is invalid.
      </p>
      <button
        onClick={onBack}
        className="mt-2 px-6 py-2.5 rounded-full bg-[#FF6B2C] text-white text-sm font-semibold active:scale-95 transition-transform duration-150"
      >
        Go Back
      </button>
    </div>
  );
}

// ─── Error state ────────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 w-full bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-4 px-8 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg
          width="26"
          height="26"
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
      <p className="text-[#6b6b6b] text-sm text-center max-w-60">{message}</p>
      <div className="flex gap-3 mt-1">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-[#1e1e1e] border border-white/10 text-white text-sm font-semibold active:scale-95 transition-transform duration-150"
        >
          Go Back
        </button>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-full bg-[#FF6B2C] text-white text-sm font-semibold active:scale-95 transition-transform duration-150"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────────

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { event, loading, error, refetch } = useEventDetail(id);

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [ticketSheetOpen, setTicketSheetOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);

  // Initialize derived state once event loads
  useEffect(() => {
    if (event) {
      setIsFollowing(!!event.isFollowingOrganizer);
      const popular = event.ticketTiers.find(
        (t) => t.isMostPopular && !t.soldOut,
      );
      const firstAvailable = event.ticketTiers.find((t) => !t.soldOut);
      setSelectedTier((popular ?? firstAvailable)?.id ?? null);
    }
  }, [event]);

  const handleBack = () => router.back();

  const handleFollow = async () => {
    setFollowLoading(true);
    setActionError(null);
    try {
      // Replace with real API call:
      // const res = await fetch(`/api/organizers/${event.organizer.id}/follow`, { method: isFollowing ? "DELETE" : "POST" });
      // if (!res.ok) throw new Error();
      await new Promise((r) => setTimeout(r, 500));
      setIsFollowing((prev) => !prev);
    } catch {
      setActionError("Couldn't update follow status. Try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  // "Get Ticket" on the page just opens the selection sheet —
  // TicketSheet hands off to PaymentSheet, which owns the actual charge call.
  const handleOpenTicketSheet = () => setTicketSheetOpen(true);

  const handleTicketConfirmed = (tierId: string) => {
    setSelectedTier(tierId);
    setTicketSheetOpen(false);
    // Small delay lets the ticket sheet's close animation finish before
    // the payment sheet slides up, so they don't visually collide.
    setTimeout(() => setPaymentSheetOpen(true), 240);
  };

  const handlePaymentSuccess = (result: {
    tierId: string;
    method: string;
    txId: string;
    event: EventDetail;
    tier: TicketTier;
  }) => {
    setPaymentSheetOpen(false);

    // ── Mock-only: stash the real event/tier so the receipt page can show
    // the correct event name instead of a hardcoded placeholder. This is
    // standing in for what your backend does for real: when /purchase
    // succeeds, it persists a ticket row with eventTitle, venue, date, etc.
    // already correct — the receipt page then just GETs that row by id.
    // Delete this block once that endpoint exists.
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `mock_ticket_${result.txId}`,
        JSON.stringify({
          eventId: result.event.id,
          eventTitle: result.event.title,
          eventImageUrl: result.event.imageUrl,
          date: result.event.date,
          time: result.event.time,
          venue: result.event.venue,
          tierName: result.tier.name,
        }),
      );
    }

    // The receipt page is the real destination — it's a persistent route the
    // user can revisit anytime (e.g. from a "My Tickets" list), not just a
    // one-time confirmation.
    router.push(`/tickets/${result.txId}`);
  };

  // ── States ──
  if (loading) return <DetailSkeleton onBack={handleBack} />;
  if (error === "NOT_FOUND") return <NotFoundState onBack={handleBack} />;
  if (error)
    return <ErrorState message={error} onRetry={refetch} onBack={handleBack} />;
  if (!event) return null;

  const activeTier = event.ticketTiers.find((t) => t.id === selectedTier);
  const ctaLabel = activeTier
    ? `Get Ticket · ${activeTier.priceLabel}`
    : "Select a ticket";

  return (
    <div
      className="
      fixed inset-0 w-full overflow-x-hidden overflow-y-auto
      bg-[#0f0f0f] text-white pb-27.5
      font-[system-ui,-apple-system,'Helvetica_Neue',sans-serif]
      [-webkit-overflow-scrolling:touch]
    "
    >
      {/* ── Hero image ── */}
      <div className="relative w-full h-65 overflow-hidden animate-fadeIn">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
        <div className="absolute inset-0 bg-linears-to-t from-[#0f0f0f] via-transparent to-black/20" />
        <button
          onClick={handleBack}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform duration-150"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div className="px-4 -mt-6 relative z-10">
        {/* ── Categories ── */}
        <div
          className="flex gap-2 mb-3 animate-slideUpFade"
          style={{ animationDelay: "40ms" }}
        >
          {event.categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#1e1e1e] border border-[#FF6B2C]/40 text-[#FF6B2C]"
            >
              {cat}
            </span>
          ))}
          {/* Optional secondary tag (e.g. "Networking") shown if present */}
          {event.tags.includes("Trending") && (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#1e1e1e] border border-white/15 text-[#ccc]">
              Networking
            </span>
          )}
        </div>

        {/* ── Title ── */}
        <h1
          className="text-[22px] font-extrabold leading-tight mb-4 animate-slideUpFade"
          style={{ animationDelay: "80ms" }}
        >
          {event.title}
        </h1>

        {/* ── Organizer row ── */}
        <div
          className="flex items-center justify-between bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-3 mb-4 animate-slideUpFade"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {event.organizer.avatarUrl ? (
              <Image
                src={event.organizer.avatarUrl}
                alt={event.organizer.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: event.organizer.color ?? "#FF6B2C" }}
              >
                {event.organizer.name.charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {event.organizer.name}
              </p>
              <p className="text-[#6b6b6b] text-[11px]">
                {event.organizerRole ?? "Organizer"}
              </p>
            </div>
          </div>
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`
              shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold
              border transition-all duration-200 active:scale-95
              disabled:opacity-50
              ${
                isFollowing
                  ? "bg-transparent border-white/20 text-white"
                  : "bg-transparent border-[#FF6B2C] text-[#FF6B2C]"
              }
            `}
          >
            {followLoading ? (
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isFollowing ? (
              "Following"
            ) : (
              "Follow"
            )}
          </button>
        </div>

        {/* ── Info grid ── */}
        <div
          className="grid grid-cols-2 gap-2.5 mb-4 animate-slideUpFade"
          style={{ animationDelay: "160ms" }}
        >
          <InfoCard label="Date" value={formatDate(event.date)} />
          <InfoCard label="Time" value={event.time} />
          <InfoCard label="Venue" value={event.venue} />
          <InfoCard
            label="Attending"
            value={`${event.attendingCount.toLocaleString()} people`}
          />
        </div>

        {/* ── Rating ── */}
        <div
          className="flex items-center gap-1.5 mb-5 animate-slideUpFade"
          style={{ animationDelay: "200ms" }}
        >
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B2C]/15 text-[#FF6B2C] text-xs font-bold">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {event.rating.toFixed(1)}
          </span>
          {event.ratingBasis && (
            <span className="text-[#6b6b6b] text-[11px]">
              {event.ratingBasis}
            </span>
          )}
        </div>

        {/* ── About ── */}
        <div
          className="mb-6 animate-slideUpFade"
          style={{ animationDelay: "240ms" }}
        >
          <h2 className="text-[15px] font-bold mb-2">About this Event</h2>
          <p className="text-[#9a9a9a] text-[13px] leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* ── Ticket Tiers ── */}
        <div
          className="mb-6 animate-slideUpFade"
          style={{ animationDelay: "280ms" }}
        >
          <h2 className="text-[15px] font-bold mb-3">Ticket Tiers</h2>
          <div className="space-y-2.5">
            {event.ticketTiers.map((tier) => (
              <TicketTierCard
                key={tier.id}
                tier={tier}
                selected={selectedTier === tier.id}
                onSelect={() => !tier.soldOut && setSelectedTier(tier.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Who's Going ── */}
        <div
          className="mb-4 animate-slideUpFade"
          style={{ animationDelay: "320ms" }}
        >
          <h2 className="text-[15px] font-bold mb-3">Who&apos;s Going</h2>
          <div className="flex items-center gap-3">
            <div className="flex">
              {event.attendeePreview.slice(0, 4).map((a, i) => (
                <AttendeeAvatar key={a.id} attendee={a} index={i} />
              ))}
            </div>
            <span className="text-[#6b6b6b] text-xs">
              +
              {Math.max(
                event.attendingCount - event.attendeePreview.length,
                0,
              ).toLocaleString()}{" "}
              others attending
            </span>
          </div>
        </div>

        {/* ── Inline action error ── */}
        {actionError && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeIn">
            <p className="text-red-400 text-xs">{actionError}</p>
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div
        className="
        bottom-17 left-0 right-0 px-4 py-3
        bg-linear-to-t from-[#0f0f0f] via-[#0f0f0f]/95 to-transparent
        animate-slideUpFade
      "
        style={{ animationDelay: "360ms" }}
      >
        <button
          onClick={handleOpenTicketSheet}
          disabled={!selectedTier}
          className="
            w-full py-4 rounded-2xl bg-[#FF6B2C] text-white text-[15px] font-bold
            shadow-[0_4px_24px_rgba(255,107,44,0.4)]
            active:scale-[0.98] transition-transform duration-150
            disabled:opacity-50 disabled:active:scale-100
            flex items-center justify-center gap-2
          "
        >
          {ctaLabel}
        </button>
      </div>

      {/* ── Ticket selection sheet ── */}
      <TicketSheet
        open={ticketSheetOpen}
        event={event}
        initialTierId={selectedTier}
        onClose={() => setTicketSheetOpen(false)}
        onConfirmed={handleTicketConfirmed}
      />

      {/* ── Payment confirmation sheet ── */}
      {activeTier && (
        <PaymentSheet
          open={paymentSheetOpen}
          event={event}
          tier={activeTier}
          onClose={() => setPaymentSheetOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-3.5 py-3">
      <p className="text-[#6b6b6b] text-[10px] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-white text-[13px] font-semibold truncate">{value}</p>
    </div>
  );
}

function TicketTierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: TicketTier;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={tier.soldOut}
      className={`
        relative w-full text-left rounded-2xl px-4 py-3.5
        border transition-all duration-200 active:scale-[0.98]
        disabled:opacity-40 disabled:active:scale-100
        ${
          selected
            ? "bg-linear-to-r from-[#FF6B2C]/25 to-[#FF6B2C]/5 border-[#FF6B2C]"
            : "bg-[#1a1a1a] border-white/8"
        }
      `}
    >
      {tier.isMostPopular && (
        <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FF6B2C] text-white">
          Most popular
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <p className="text-white text-sm font-bold">{tier.name}</p>
          <p className="text-[#6b6b6b] text-[11px] mt-0.5">{tier.perks}</p>
          {tier.spotsLeft !== undefined && (
            <p
              className={`text-[10px] mt-1 ${tier.spotsLeft <= 10 ? "text-red-400" : "text-[#6b6b6b]"}`}
            >
              {tier.soldOut ? "Sold out" : `${tier.spotsLeft} spots left`}
            </p>
          )}
        </div>
        <span className="shrink-0 text-[#FF6B2C] text-sm font-bold">
          {tier.priceLabel}
        </span>
      </div>
    </button>
  );
}

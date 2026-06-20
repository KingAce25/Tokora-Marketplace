export type EventCategory = "All" | "Web3" | "Music" | "Business" | "Campus";

export type EventTag = "Trending" | "Free" | "Sold Out";

export interface Organizer {
  id: string;
  name: string;
  avatarUrl?: string;
  /** fallback color for avatar dot when no image */
  color?: string;
}

export interface Event {
  id: string;
  title: string;
  /** ISO date string e.g. "2025-06-18" */
  date: string;
  /** e.g. "6:00 PM - 11:00 PM" */
  time: string;
  venue: string;
  /** Full URL to cover image; undefined = show placeholder */
  imageUrl?: string;
  organizer: Organizer;
  categories: EventCategory[];
  tags: EventTag[];
  /** undefined = free */
  price?: number;
  /** e.g. "0.02 SOL" for crypto pricing */
  cryptoPrice?: string;
  rating: number;
  /** number of people going */
  going: number;
  isTrending?: boolean;
}

// ─── Event Detail (extends Event with full-page data) ─────────────────────────

export interface TicketTier {
  id: string;
  name: string;
  /** short perks line, e.g. "Entry + digital NFT ticket" */
  perks: string;
  /** display price string, e.g. "0.05 SOL" or "₦5,000" */
  priceLabel: string;
  /** raw numeric price used for checkout/payment calc */
  priceValue: number;
  currency: "SOL" | "ETH" | "NGN" | "USD";
  spotsLeft?: number;
  isMostPopular?: boolean;
  soldOut?: boolean;
}

export interface Attendee {
  id: string;
  name: string;
  avatarUrl?: string;
  color?: string;
}

// ─── Payment ────────────────────────────────────────────────────────────────

export interface PaymentMethod {
  id: string;
  /** display label, e.g. "SOL", "USDC" */
  symbol: string;
  /** whether gas fees are sponsored for this method */
  gasless?: boolean;
}

export interface EventDetail extends Event {
  description: string;
  /** organizer's role label, e.g. "Event Organizer" */
  organizerRole?: string;
  isFollowingOrganizer?: boolean;
  attendingCount: number;
  attendeePreview: Attendee[];
  ticketTiers: TicketTier[];
  ratingBasis?: string;
}

// ─── Purchased Ticket (persistent receipt) ─────────────────────────────────────
// Created once a purchase succeeds. This is what /tickets/[id] renders —
// a standalone record independent of the live event/tier data, so it still
// displays correctly even if the event is later edited or removed.

export interface MyTicket {
  /** ticket id used in the URL, e.g. /tickets/tk_8821 */
  id: string;
  eventId: string;
  eventTitle: string;
  eventImageUrl?: string;
  date: string;
  time: string;
  venue: string;
  tierName: string;
  /** on-chain transaction id from the payment step */
  txId: string;
  /** NFT serial / ticket number shown on the stub, e.g. "NFT #0042" */
  serial: string;
  /** organizer or platform name shown in the footer, e.g. "TOKORA MARKETPLACE" */
  issuer: string;
  purchasedAt: string; // ISO datetime
  verified: boolean;
  verifiedAt?: string; // ISO datetime
  /** opaque payload encoded into the QR code, verified by venue scanners */
  qrPayload: string;
}

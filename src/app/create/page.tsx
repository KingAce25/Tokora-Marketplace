"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EventCategory } from "../../components/types";
import Image from "next/image";

// ─── Form state types ──────────────────────────────────────────────────────────

interface TicketTierDraft {
  id: string;
  name: string;
  perks: string;
  priceLabel: string;
  priceValue: number;
  currency: "SOL" | "ETH" | "NGN" | "FREE";
  spots: string;
}

interface CreateEventForm {
  // Step 1
  title: string;
  description: string;
  bannerFile: File | null;
  bannerPreview: string | null;
  // Step 2
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  category: EventCategory | "";
  // Step 3
  tiers: TicketTierDraft[];
  // Step 4 — review only, no extra fields
}

const EMPTY_FORM: CreateEventForm = {
  title: "",
  description: "",
  bannerFile: null,
  bannerPreview: null,
  date: "",
  startTime: "",
  endTime: "",
  venue: "",
  category: "",
  tiers: [],
};

const EMPTY_TIER = (): TicketTierDraft => ({
  id: `tier_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  perks: "",
  priceLabel: "",
  priceValue: 0,
  currency: "NGN",
  spots: "",
});

const CATEGORIES: EventCategory[] = ["Web3", "Music", "Business", "Campus"];
const CURRENCIES = ["FREE", "NGN", "SOL", "ETH"] as const;

const STEPS = [
  { number: 1, label: "Event Info" },
  { number: 2, label: "Date & Venue" },
  { number: 3, label: "Tickets" },
  { number: 4, label: "Review" },
];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center px-4 mb-2">
      {STEPS.map((step, i) => (
        <div
          key={step.number}
          className="flex items-center flex-1 last:flex-none"
        >
          <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
            transition-all duration-300
            ${
              current === step.number
                ? "bg-[#FF6B2C] text-white shadow-[0_0_12px_rgba(255,107,44,0.5)]"
                : current > step.number
                  ? "bg-[#FF6B2C]/30 text-[#FF6B2C] border border-[#FF6B2C]/40"
                  : "bg-[#1e1e1e] text-[#6b6b6b] border border-white/10"
            }
          `}
          >
            {current > step.number ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              step.number
            )}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`
              flex-1 h-px mx-1.5 transition-all duration-500
              ${current > step.number ? "bg-[#FF6B2C]/50" : "bg-white/10"}
            `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Shared input components ──────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-white text-sm font-semibold mb-2">{children}</p>;
}

function TextInput({
  placeholder,
  value,
  onChange,
  error,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full bg-[#1a1a1a] border rounded-2xl px-4 py-3.5 text-white text-sm
          placeholder:text-[#4a4a4a] outline-none
          transition-colors duration-200
          focus:border-[#FF6B2C]/60
          ${error ? "border-red-500/60" : "border-white/8"}
        `}
      />
      {error && <p className="text-red-400 text-xs mt-1.5 pl-1">{error}</p>}
    </div>
  );
}

function Textarea({
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`
          w-full bg-[#1a1a1a] border rounded-2xl px-4 py-3.5 text-white text-sm
          placeholder:text-[#4a4a4a] outline-none resize-none
          transition-colors duration-200 focus:border-[#FF6B2C]/60
          ${error ? "border-red-500/60" : "border-white/8"}
        `}
      />
      {error && <p className="text-red-400 text-xs mt-1.5 pl-1">{error}</p>}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full bg-[#1a1a1a] border rounded-2xl px-4 py-3.5 text-sm
          outline-none transition-colors duration-200 focus:border-[#FF6B2C]/60
          appearance-none
          ${value ? "text-white" : "text-[#4a4a4a]"}
          ${error ? "border-red-500/60" : "border-white/8"}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            className="bg-[#1a1a1a] text-white"
          >
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1.5 pl-1">{error}</p>}
    </div>
  );
}

// ─── Step 1: Event Info ────────────────────────────────────────────────────────

function Step1({
  form,
  setForm,
  errors,
}: {
  form: CreateEventForm;
  setForm: React.Dispatch<React.SetStateAction<CreateEventForm>>;
  errors: Partial<Record<keyof CreateEventForm, string>>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleBanner = (file: File | null) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, bannerFile: file, bannerPreview: preview }));
  };

  return (
    <div className="space-y-5 animate-slideUpFade">
      <div>
        <Label>Event Title</Label>
        <TextInput
          placeholder="e.g. Web3 Lagos Summit 2025"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          error={errors.title}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="What is the event about?"
          value={form.description}
          onChange={(v) => setForm((f) => ({ ...f, description: v }))}
          rows={5}
          error={errors.description}
        />
      </div>

      {/* Banner upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
          onChange={(e) => handleBanner(e.target.files?.[0] ?? null)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className={`
            w-full rounded-2xl border-2 border-dashed
            flex flex-col items-center justify-center py-8 gap-2
            transition-all duration-200 active:scale-[0.98]
            ${errors.bannerFile ? "border-red-500/40" : "border-[#FF6B2C]/30 hover:border-[#FF6B2C]/60"}
            ${form.bannerPreview ? "p-0 overflow-hidden" : ""}
          `}
        >
          {form.bannerPreview ? (
            <div className="relative w-full h-40">
              <Image
                src={form.bannerPreview}
                alt="Banner preview"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-semibold">
                  Tap to change
                </p>
              </div>
            </div>
          ) : (
            <>
              <span className="w-12 h-12 rounded-xl bg-[#FF6B2C]/15 flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B2C"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </span>
              <p className="text-white text-sm font-semibold">
                Upload Event Banner
              </p>
              <p className="text-[#6b6b6b] text-xs">
                JPG, PNG or GIF – Max 10MB
              </p>
            </>
          )}
        </button>
        {errors.bannerFile && (
          <p className="text-red-400 text-xs mt-1.5 pl-1">
            {errors.bannerFile}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Date & Venue ──────────────────────────────────────────────────────

function Step2({
  form,
  setForm,
  errors,
}: {
  form: CreateEventForm;
  setForm: React.Dispatch<React.SetStateAction<CreateEventForm>>;
  errors: Partial<Record<keyof CreateEventForm, string>>;
}) {
  return (
    <div className="space-y-5 animate-slideUpFade">
      <div>
        <Label>Event Date</Label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          min={new Date().toISOString().split("T")[0]}
          className={`
            w-full bg-[#1a1a1a] border rounded-2xl px-4 py-3.5 text-white text-sm
            outline-none transition-colors duration-200 focus:border-[#FF6B2C]/60
            scheme-dark
            ${errors.date ? "border-red-500/60" : "border-white/8"}
          `}
        />
        {errors.date && (
          <p className="text-red-400 text-xs mt-1.5 pl-1">{errors.date}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Start Time</Label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm((f) => ({ ...f, startTime: e.target.value }))
            }
            className={`
              w-full bg-[#1a1a1a] border rounded-2xl px-4 py-3.5 text-white text-sm
              outline-none transition-colors duration-200 focus:border-[#FF6B2C]/60
              scheme-dark
              ${errors.startTime ? "border-red-500/60" : "border-white/8"}
            `}
          />
          {errors.startTime && (
            <p className="text-red-400 text-xs mt-1.5 pl-1">
              {errors.startTime}
            </p>
          )}
        </div>
        <div>
          <Label>End Time</Label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm((f) => ({ ...f, endTime: e.target.value }))
            }
            className={`
              w-full bg-[#1a1a1a] border rounded-2xl px-4 py-3.5 text-white text-sm
              outline-none transition-colors duration-200 focus:border-[#FF6B2C]/60
              scheme-dark
              ${errors.endTime ? "border-red-500/60" : "border-white/8"}
            `}
          />
          {errors.endTime && (
            <p className="text-red-400 text-xs mt-1.5 pl-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Venue</Label>
        <TextInput
          placeholder="e.g. Eko Convention Center, Lagos"
          value={form.venue}
          onChange={(v) => setForm((f) => ({ ...f, venue: v }))}
          error={errors.venue}
        />
      </div>

      <div>
        <Label>Category</Label>
        <SelectInput
          value={form.category}
          onChange={(v) =>
            setForm((f) => ({ ...f, category: v as EventCategory }))
          }
          placeholder="Select a category"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.category}
        />
      </div>
    </div>
  );
}

// ─── Step 3: Tickets ───────────────────────────────────────────────────────────

function TierCard({
  tier,
  onChange,
  onRemove,
  index,
}: {
  tier: TicketTierDraft;
  onChange: (updated: TicketTierDraft) => void;
  onRemove: () => void;
  index: number;
}) {
  const isFree = tier.currency === "FREE";

  return (
    <div
      className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4 space-y-3 animate-rowIn"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-bold">Ticket Tier {index + 1}</p>
        <button
          onClick={onRemove}
          className="text-[#6b6b6b] active:scale-90 transition-transform"
        >
          <svg
            width="16"
            height="16"
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
      </div>

      <input
        type="text"
        placeholder="Tier name (e.g. General Access)"
        value={tier.name}
        onChange={(e) => onChange({ ...tier, name: e.target.value })}
        className="w-full bg-[#111] border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#4a4a4a] outline-none focus:border-[#FF6B2C]/60 transition-colors"
      />

      <input
        type="text"
        placeholder="Perks (e.g. Entry + digital NFT)"
        value={tier.perks}
        onChange={(e) => onChange({ ...tier, perks: e.target.value })}
        className="w-full bg-[#111] border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#4a4a4a] outline-none focus:border-[#FF6B2C]/60 transition-colors"
      />

      <div className="grid grid-cols-2 gap-2.5">
        {/* Currency selector */}
        <select
          value={tier.currency}
          onChange={(e) => {
            const c = e.target.value as TicketTierDraft["currency"];
            onChange({
              ...tier,
              currency: c,
              priceValue: c === "FREE" ? 0 : tier.priceValue,
              priceLabel: c === "FREE" ? "Free" : tier.priceLabel,
            });
          }}
          className="bg-[#111] border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#FF6B2C]/60 transition-colors scheme-dark"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c} className="bg-[#111]">
              {c}
            </option>
          ))}
        </select>

        {/* Price input */}
        <input
          type="number"
          min="0"
          step={
            tier.currency === "SOL" || tier.currency === "ETH" ? "0.001" : "100"
          }
          placeholder={isFree ? "—" : "Price"}
          disabled={isFree}
          value={isFree ? "" : tier.priceValue || ""}
          onChange={(e) => {
            const v = parseFloat(e.target.value) || 0;
            const label =
              tier.currency === "NGN"
                ? `₦${v.toLocaleString()}`
                : `${v} ${tier.currency}`;
            onChange({ ...tier, priceValue: v, priceLabel: label });
          }}
          className="bg-[#111] border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-[#4a4a4a] outline-none focus:border-[#FF6B2C]/60 transition-colors disabled:opacity-40"
        />
      </div>

      <input
        type="number"
        min="1"
        placeholder="Available spots (leave blank for unlimited)"
        value={tier.spots}
        onChange={(e) => onChange({ ...tier, spots: e.target.value })}
        className="w-full bg-[#111] border border-white/8 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#4a4a4a] outline-none focus:border-[#FF6B2C]/60 transition-colors"
      />
    </div>
  );
}

function Step3({
  form,
  setForm,
}: {
  form: CreateEventForm;
  setForm: React.Dispatch<React.SetStateAction<CreateEventForm>>;
}) {
  const addTier = () =>
    setForm((f) => ({ ...f, tiers: [...f.tiers, EMPTY_TIER()] }));

  const updateTier = (id: string, updated: TicketTierDraft) =>
    setForm((f) => ({
      ...f,
      tiers: f.tiers.map((t) => (t.id === id ? updated : t)),
    }));

  const removeTier = (id: string) =>
    setForm((f) => ({ ...f, tiers: f.tiers.filter((t) => t.id !== id) }));

  return (
    <div className="space-y-4 animate-slideUpFade">
      {form.tiers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-2xl border border-dashed border-white/10">
          <div className="w-12 h-12 rounded-xl bg-[#1e1e1e] flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b6b6b"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <p className="text-[#6b6b6b] text-sm text-center">
            No ticket tiers yet.
            <br />
            Add one below.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {form.tiers.map((tier, i) => (
            <TierCard
              key={tier.id}
              tier={tier}
              index={i}
              onChange={(updated) => updateTier(tier.id, updated)}
              onRemove={() => removeTier(tier.id)}
            />
          ))}
        </div>
      )}

      <button
        onClick={addTier}
        className="
          w-full py-3.5 rounded-2xl border border-dashed border-[#FF6B2C]/40
          text-[#FF6B2C] text-sm font-semibold
          flex items-center justify-center gap-2
          active:scale-[0.98] transition-all duration-150
          hover:border-[#FF6B2C]/70 hover:bg-[#FF6B2C]/5
        "
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Ticket Tier
      </button>
    </div>
  );
}

// ─── Step 4: Review ────────────────────────────────────────────────────────────

function ReviewRow({
  label,
  value,
  orange,
}: {
  label: string;
  value: string;
  orange?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-white/6 last:border-0">
      <span className="text-[#6b6b6b] text-xs uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span
        className={`text-right text-sm font-semibold ${orange ? "text-[#FF6B2C]" : "text-white"}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function Step4({ form }: { form: CreateEventForm }) {
  function fmt12(t: string) {
    if (!t) return "—";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  }

  return (
    <div className="space-y-4 animate-slideUpFade">
      {/* Banner preview */}
      {form.bannerPreview && (
        <div className="w-full h-35 rounded-2xl overflow-hidden">
          <Image
            src={form.bannerPreview}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 pt-1 pb-1">
        <ReviewRow label="Title" value={form.title} />
        <ReviewRow label="Category" value={form.category} orange />
        <ReviewRow
          label="Date"
          value={
            form.date
              ? new Date(form.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ""
          }
        />
        <ReviewRow
          label="Time"
          value={
            form.startTime
              ? `${fmt12(form.startTime)} – ${fmt12(form.endTime)}`
              : ""
          }
        />
        <ReviewRow label="Venue" value={form.venue} />
      </div>

      {/* Description */}
      {form.description && (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-3">
          <p className="text-[#6b6b6b] text-[10px] uppercase tracking-wide mb-1.5">
            Description
          </p>
          <p className="text-white text-sm leading-relaxed">
            {form.description}
          </p>
        </div>
      )}

      {/* Tiers */}
      {form.tiers.length > 0 && (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 pt-3 pb-1">
          <p className="text-[#6b6b6b] text-[10px] uppercase tracking-wide mb-2">
            Ticket Tiers
          </p>
          {form.tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center justify-between py-2.5 border-b border-white/6 last:border-0"
            >
              <div>
                <p className="text-white text-sm font-semibold">
                  {tier.name || "Unnamed tier"}
                </p>
                <p className="text-[#6b6b6b] text-xs">{tier.perks || "—"}</p>
                {tier.spots && (
                  <p className="text-[#6b6b6b] text-[10px] mt-0.5">
                    {tier.spots} spots
                  </p>
                )}
              </div>
              <span className="text-[#FF6B2C] text-sm font-bold shrink-0 ml-3">
                {tier.currency === "FREE" ? "Free" : tier.priceLabel || "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="px-1">
        <p className="text-[#6b6b6b] text-[11px] text-center leading-relaxed">
          By publishing, you confirm this event complies with Tokora
          Marketplace&apos;s community guidelines.
        </p>
      </div>
    </div>
  );
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validate(
  step: number,
  form: CreateEventForm,
): Partial<Record<keyof CreateEventForm, string>> {
  const e: Partial<Record<keyof CreateEventForm, string>> = {};
  if (step === 1) {
    if (!form.title.trim()) e.title = "Event title is required.";
    else if (form.title.trim().length < 5)
      e.title = "Title must be at least 5 characters.";
    if (!form.description.trim()) e.description = "Please add a description.";
  }
  if (step === 2) {
    if (!form.date) e.date = "Please pick a date.";
    if (!form.startTime) e.startTime = "Start time is required.";
    if (!form.venue.trim()) e.venue = "Venue is required.";
    if (!form.category) e.category = "Pick a category.";
  }
  return e;
}

// ─── API submission (wire your real endpoint here) ─────────────────────────────

async function submitEvent(form: CreateEventForm): Promise<{ id: string }> {
  // ── Replace with your real API call ──────────────────────────────────────
  // const body = new FormData();
  // body.append("title", form.title);
  // body.append("description", form.description);
  // body.append("date", form.date);
  // body.append("startTime", form.startTime);
  // body.append("endTime", form.endTime);
  // body.append("venue", form.venue);
  // body.append("category", form.category);
  // if (form.bannerFile) body.append("banner", form.bannerFile);
  // body.append("tiers", JSON.stringify(form.tiers));
  // const res = await fetch("/api/events", { method: "POST", body });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json(); // expects { id: string }
  // ──────────────────────────────────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 1400));
  return { id: `evt_${Math.random().toString(36).slice(2, 8)}` };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateEventForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateEventForm, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Scroll to top on step change
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleContinue = async () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }

    // Step 4 → publish
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { id } = await submitEvent(form);
      // Navigate to the new event's detail page
      router.push(`/events/${id}`);
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Failed to publish. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setErrors({});
    setStep((s) => s - 1);
  };

  const ctaLabel = step === 4 ? "Publish Event" : "Continue";

  return (
    <div
      ref={scrollRef}
      className="
        fixed inset-0 w-full overflow-x-hidden overflow-y-auto
        bg-[#0f0f0f] text-white pb-25
        font-[system-ui,-apple-system,'Helvetica_Neue',sans-serif]
        [-webkit-overflow-scrolling:touch]
      "
    >
      {/* ── Header ── */}
      <div className="px-4 pt-12 pb-5 animate-headerIn">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-[#1e1e1e] border border-white/8 flex items-center justify-center active:scale-90 transition-transform shrink-0"
          >
            <svg
              width="16"
              height="16"
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
          <h1 className="text-[22px] font-extrabold tracking-tight">
            Create Event
          </h1>
        </div>

        <StepIndicator current={step} />
      </div>

      {/* ── Step label ── */}
      <div
        className="px-4 mb-5 animate-slideDown"
        style={{ animationDelay: "40ms" }}
      >
        <p className="text-[#8a8a8a] text-xs">
          Step {step}:{" "}
          <span className="text-white font-semibold">
            {STEPS[step - 1].label}
          </span>
        </p>
      </div>

      {/* ── Form content ── */}
      <div className="px-4">
        {step === 1 && <Step1 form={form} setForm={setForm} errors={errors} />}
        {step === 2 && <Step2 form={form} setForm={setForm} errors={errors} />}
        {step === 3 && <Step3 form={form} setForm={setForm} />}
        {step === 4 && <Step4 form={form} />}
      </div>

      {/* ── Submit error ── */}
      {submitError && (
        <div className="px-4 mt-4 animate-fadeIn">
          <div className="px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-xs">{submitError}</p>
          </div>
        </div>
      )}

      {/* ── Sticky CTA ── */}
      <div
        className="
        fixed bottom-17 left-0 right-0 px-4 py-3
        bg-linear-to-t from-[#0f0f0f] via-[#0f0f0f]/95 to-transparent
      "
      >
        <button
          onClick={handleContinue}
          disabled={submitting}
          className="
            w-full py-4 rounded-2xl bg-[#FF6B2C] text-white text-[15px] font-bold
            shadow-[0_4px_24px_rgba(255,107,44,0.4)]
            active:scale-[0.98] transition-transform duration-150
            disabled:opacity-60 disabled:active:scale-100
            flex items-center justify-center gap-2
          "
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            ctaLabel
          )}
        </button>
      </div>
    </div>
  );
}

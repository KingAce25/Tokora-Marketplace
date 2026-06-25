// 📁 FILE LOCATION: app/create/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Types ─────────────────────────────────────────────────────────────────────

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
  title: string;
  description: string;
  bannerFile: File | null;
  bannerPreview: string | null;
  venue: string;
  datetime: string;
  capacity: string;
  ticketType: "free" | "paid";
  tiers: TicketTierDraft[];
}

const EMPTY_FORM: CreateEventForm = {
  title: "",
  description: "",
  bannerFile: null,
  bannerPreview: null,
  venue: "",
  datetime: "",
  capacity: "",
  ticketType: "free",
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

const STEPS = [
  { number: 1, label: "Event Info" },
  { number: 2, label: "Venue & Time" },
  { number: 3, label: "Tickets" },
  { number: 4, label: "Review" },
];

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center w-full mt-4 mb-4">
      {STEPS.map((step, i) => (
        <div
          key={step.number}
          className="flex items-center flex-1 last:flex-none"
        >
          {/* Circle */}
          {/* Circle: orange fill for current AND completed, dark for future */}
          <div
            className={`
            w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0
            transition-all duration-300
            ${
              current >= step.number
                ? "bg-[#FF6B2C] text-white shadow-[0_0_8px_rgba(255,107,44,0.4)]"
                : "bg-[#1e1e1e] text-[#6b6b6b] border border-[#3a3a3a]"
            }
          `}
          >
            {step.number}
          </div>
          {/* Line: orange when both ends are completed/active */}
          {i < STEPS.length - 1 && (
            <div
              className={`
              flex-1 h-[2px] mx-2 rounded-full transition-all duration-500
              ${current > step.number ? "bg-[#FF6B2C]" : "bg-[#2a2a2a]"}
            `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Shared input styles ───────────────────────────────────────────────────────

const inputBase =
  "w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl px-4 py-3.5 text-white text-[14px] placeholder:text-[#444] outline-none transition-colors duration-200 focus:border-[#FF6B2C]/50";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white text-[13px] font-semibold mb-2">{children}</p>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? (
    <p className="text-red-400 text-[11px] mt-1.5 pl-1">{msg}</p>
  ) : null;
}

// ─── Step 1: Event Info ────────────────────────────────────────────────────────

function Step1({
  form,
  setForm,
  errors,
}: {
  form: CreateEventForm;
  setForm: React.Dispatch<React.SetStateAction<CreateEventForm>>;
  errors: Record<string, string>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setForm((f) => ({
      ...f,
      bannerFile: file,
      bannerPreview: URL.createObjectURL(file),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Event Title */}
      <div>
        <FieldLabel>Event Title</FieldLabel>
        <input
          type="text"
          placeholder="e.g. Web3 Lagos Summit 2025"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={`${inputBase} ${errors.title ? "border-red-500/50" : ""}`}
        />
        <FieldError msg={errors.title} />
      </div>

      {/* Description */}
      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          placeholder="What is the event about?"
          value={form.description}
          rows={5}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className={`${inputBase} resize-none leading-relaxed ${errors.description ? "border-red-500/50" : ""}`}
        />
        <FieldError msg={errors.description} />
      </div>

      {/* Upload Banner */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-2xl border border-dashed border-[#3a3a3a] bg-[#1c1c1c] overflow-hidden active:scale-[0.99] transition-transform duration-150"
        >
          {form.bannerPreview ? (
            <div className="relative w-full h-[150px]">
              <img
                src={form.bannerPreview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-semibold">
                  Tap to change
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-9 gap-2">
              {/* Orange image icon — matches the design exactly */}
              <div className="w-12 h-12 rounded-xl bg-[#FF6B2C]/15 flex items-center justify-center mb-1">
                <svg
                  width="26"
                  height="26"
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
              </div>
              <p className="text-white text-[14px] font-semibold">
                Upload Event Banner
              </p>
              <p className="text-[#555] text-[11px]">
                JPG, PNG or GIF – Max 10MB
              </p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Venue & Time ─────────────────────────────────────────────────────

function Step2({
  form,
  setForm,
  errors,
}: {
  form: CreateEventForm;
  setForm: React.Dispatch<React.SetStateAction<CreateEventForm>>;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      {/* Venue — placeholder is orange/accent coloured, matching the image */}
      <div>
        <FieldLabel>Venue</FieldLabel>
        <input
          type="text"
          placeholder="Event location or online link"
          value={form.venue}
          onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
          className={`
            w-full bg-[#1c1c1c] border rounded-2xl px-4 py-3.5 text-white text-[14px]
            outline-none transition-colors duration-200 focus:border-[#FF6B2C]/50
            placeholder:text-[#FF6B2C]/70
            ${errors.venue ? "border-red-500/50" : "border-[#2a2a2a]"}
          `}
        />
        <FieldError msg={errors.venue} />
      </div>

      {/* Date & Time — single datetime-local input, matches "dd --- yyyy --:-- --" */}
      <div>
        <FieldLabel>Date &amp; Time</FieldLabel>
        <input
          type="datetime-local"
          value={form.datetime}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setForm((f) => ({ ...f, datetime: e.target.value }))}
          className={`
            w-full bg-[#1c1c1c] border rounded-2xl px-4 py-3.5 text-white text-[14px]
            outline-none transition-colors duration-200 focus:border-[#FF6B2C]/50
            [color-scheme:dark]
            ${errors.datetime ? "border-red-500/50" : "border-[#2a2a2a]"}
          `}
        />
        <FieldError msg={errors.datetime} />
      </div>

      {/* Capacity */}
      <div>
        <FieldLabel>Capacity</FieldLabel>
        <input
          type="number"
          min="1"
          placeholder="Max attendees (e.g. 500)"
          value={form.capacity}
          onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
          className={`${inputBase} ${errors.capacity ? "border-red-500/50" : ""}`}
        />
        <FieldError msg={errors.capacity} />
      </div>
    </div>
  );
}

// ─── Step 3: Tickets ──────────────────────────────────────────────────────────

function Step3({
  form,
  setForm,
}: {
  form: CreateEventForm;
  setForm: React.Dispatch<React.SetStateAction<CreateEventForm>>;
}) {
  return (
    <div className="space-y-5">
      {/* Ticket Type toggle */}
      <div>
        <FieldLabel>Ticket Type</FieldLabel>
        <div className="flex gap-3">
          {/* Free Event */}
          <button
            onClick={() => setForm((f) => ({ ...f, ticketType: "free" }))}
            className={`
              flex-1 py-3 rounded-full text-[14px] font-bold
              border-2 transition-all duration-200 active:scale-[0.97]
              ${
                form.ticketType === "free"
                  ? "border-[#FF6B2C] text-[#FF6B2C] bg-transparent"
                  : "border-[#2a2a2a] text-[#555] bg-[#1c1c1c]"
              }
            `}
          >
            Free Event
          </button>

          {/* Paid Tickets */}
          <button
            onClick={() => setForm((f) => ({ ...f, ticketType: "paid" }))}
            className={`
              flex-1 py-3 rounded-full text-[14px] font-bold
              border-2 transition-all duration-200 active:scale-[0.97]
              ${
                form.ticketType === "paid"
                  ? "border-[#FF6B2C] text-[#FF6B2C] bg-transparent"
                  : "border-[#2a2a2a] text-[#555] bg-[#1c1c1c]"
              }
            `}
          >
            Paid Tickets
          </button>
        </div>
      </div>

      {/* Paid tier inputs — only shown when "Paid Tickets" is selected */}
      {form.ticketType === "paid" && (
        <div className="space-y-3">
          {form.tiers.length === 0 ? (
            <p className="text-[#555] text-[13px] text-center py-4">
              Add at least one ticket tier below.
            </p>
          ) : (
            form.tiers.map((tier, i) => (
              <PaidTierCard
                key={tier.id}
                tier={tier}
                index={i}
                onChange={(u) =>
                  setForm((f) => ({
                    ...f,
                    tiers: f.tiers.map((t) => (t.id === tier.id ? u : t)),
                  }))
                }
                onRemove={() =>
                  setForm((f) => ({
                    ...f,
                    tiers: f.tiers.filter((t) => t.id !== tier.id),
                  }))
                }
              />
            ))
          )}
          <button
            onClick={() =>
              setForm((f) => ({ ...f, tiers: [...f.tiers, EMPTY_TIER()] }))
            }
            className="w-full py-3 rounded-2xl border border-dashed border-[#FF6B2C]/40 text-[#FF6B2C] text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-[#FF6B2C]/5"
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
      )}

      {/* NFT Ticket Minting info card — always visible, matches image exactly */}
      <div className="rounded-2xl border border-[#FF6B2C]/50 bg-[#1c1c1c] px-4 py-4">
        <p className="text-[#FF6B2C] text-[13px] font-bold mb-1.5">
          NFT Ticket Minting
        </p>
        <p className="text-[#888] text-[12px] leading-relaxed">
          Every ticket is automatically minted as an NFT. Attendees receive a
          verifiable digital collectible with onchain proof of attendance.
        </p>
      </div>
    </div>
  );
}

// ─── Paid tier card (only shown in paid mode) ─────────────────────────────────

function PaidTierCard({
  tier,
  onChange,
  onRemove,
  index,
}: {
  tier: TicketTierDraft;
  onChange: (u: TicketTierDraft) => void;
  onRemove: () => void;
  index: number;
}) {
  const mini =
    "bg-[#131313] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-white text-[13px] placeholder:text-[#444] outline-none focus:border-[#FF6B2C]/50 transition-colors";
  return (
    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-white text-[13px] font-bold">Tier {index + 1}</p>
        <button
          onClick={onRemove}
          className="text-[#555] p-1 active:scale-90 transition-transform"
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
      </div>
      <input
        type="text"
        placeholder="Tier name (e.g. General Access)"
        value={tier.name}
        onChange={(e) => onChange({ ...tier, name: e.target.value })}
        className={`w-full ${mini}`}
      />
      <input
        type="text"
        placeholder="Perks (e.g. Entry + digital NFT)"
        value={tier.perks}
        onChange={(e) => onChange({ ...tier, perks: e.target.value })}
        className={`w-full ${mini}`}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <select
          value={tier.currency}
          onChange={(e) => {
            const c = e.target.value as TicketTierDraft["currency"];
            onChange({ ...tier, currency: c, priceValue: 0, priceLabel: "" });
          }}
          className={`${mini} [color-scheme:dark]`}
        >
          {(["NGN", "SOL", "ETH"] as const).map((c) => (
            <option key={c} value={c} className="bg-[#131313]">
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Price"
          value={tier.priceValue || ""}
          step={
            tier.currency === "SOL" || tier.currency === "ETH" ? "0.001" : "100"
          }
          onChange={(e) => {
            const v = parseFloat(e.target.value) || 0;
            const label =
              tier.currency === "NGN"
                ? `₦${v.toLocaleString()}`
                : `${v} ${tier.currency}`;
            onChange({ ...tier, priceValue: v, priceLabel: label });
          }}
          className={mini}
        />
      </div>
      <input
        type="number"
        min="1"
        placeholder="Available spots (blank = unlimited)"
        value={tier.spots}
        onChange={(e) => onChange({ ...tier, spots: e.target.value })}
        className={`w-full ${mini}`}
      />
    </div>
  );
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────

function Step4({ form }: { form: CreateEventForm }) {
  return (
    <div className="space-y-4">
      {form.bannerPreview && (
        <div className="w-full h-[140px] rounded-2xl overflow-hidden">
          <img
            src={form.bannerPreview}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl px-4 divide-y divide-white/5">
        {[
          { label: "Title", value: form.title },
          { label: "Venue", value: form.venue },
          {
            label: "Date & Time",
            value: form.datetime
              ? new Date(form.datetime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "",
          },
          {
            label: "Capacity",
            value: form.capacity
              ? `${parseInt(form.capacity).toLocaleString()} attendees`
              : "Unlimited",
          },
        ].map(
          ({
            label,
            value,
            orange,
          }: {
            label: string;
            value: string;
            orange?: boolean;
          }) => (
            <div
              key={label}
              className="flex items-start justify-between gap-3 py-3"
            >
              <span className="text-[#555] text-[10px] uppercase tracking-wide flex-shrink-0">
                {label}
              </span>
              <span
                className={`text-right text-[13px] font-semibold truncate max-w-[60%] ${orange ? "text-[#FF6B2C]" : "text-white"}`}
              >
                {value || "—"}
              </span>
            </div>
          ),
        )}
      </div>

      {form.description && (
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl px-4 py-3.5">
          <p className="text-[#555] text-[10px] uppercase tracking-wide mb-2">
            Description
          </p>
          <p className="text-white text-[13px] leading-relaxed">
            {form.description}
          </p>
        </div>
      )}

      {form.tiers.length > 0 && (
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl px-4 pt-3.5 pb-1">
          <p className="text-[#555] text-[10px] uppercase tracking-wide mb-2">
            Ticket Tiers
          </p>
          {form.tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <div className="min-w-0 pr-3">
                <p className="text-white text-[13px] font-semibold truncate">
                  {tier.name || "Unnamed tier"}
                </p>
                <p className="text-[#555] text-xs">{tier.perks || "—"}</p>
                {tier.spots && (
                  <p className="text-[#555] text-[10px] mt-0.5">
                    {tier.spots} spots
                  </p>
                )}
              </div>
              <span className="text-[#FF6B2C] text-[13px] font-bold flex-shrink-0">
                {tier.currency === "FREE" ? "Free" : tier.priceLabel || "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[#444] text-[11px] text-center leading-relaxed px-2 pb-2">
        By publishing, you confirm this event complies with Tokora Marketplace's
        community guidelines.
      </p>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(step: number, form: CreateEventForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1) {
    if (!form.title.trim()) e.title = "Event title is required.";
    else if (form.title.trim().length < 5)
      e.title = "Title must be at least 5 characters.";
    if (!form.description.trim()) e.description = "Please add a description.";
  }
  if (step === 2) {
    if (!form.venue.trim()) e.venue = "Venue is required.";
    if (!form.datetime) e.datetime = "Please pick a date and time.";
  }
  return e;
}

// ─── API submission ───────────────────────────────────────────────────────────

async function submitEvent(form: CreateEventForm): Promise<{ id: string }> {
  // ── Replace with your real API call ──────────────────────────────────────
  // const body = new FormData();
  // body.append("title", form.title);
  // body.append("description", form.description);
  // body.append("venue", form.venue);
  // body.append("datetime", form.datetime);
  // body.append("capacity", form.capacity);
  // if (form.bannerFile) body.append("banner", form.bannerFile);
  // body.append("tiers", JSON.stringify(form.tiers));
  // const res = await fetch("/api/events", { method: "POST", body });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();
  // ──────────────────────────────────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 1400));
  return { id: `evt_${Math.random().toString(36).slice(2, 8)}` };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateEventForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top between steps
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
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { id } = await submitEvent(form);
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

  return (
    <div
      ref={scrollRef}
      className="
        fixed inset-0 w-full overflow-x-hidden overflow-y-auto
        bg-[#0f0f0f] text-white
        font-[system-ui,-apple-system,'Helvetica_Neue',sans-serif]
        [-webkit-overflow-scrolling:touch]
        pb-[120px]
      "
    >
      {/* ── Header — matches image: no back button, just the title ── */}
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-[26px] font-extrabold tracking-tight mb-0">
          Create Event
        </h1>
        <StepIndicator current={step} />
      </div>

      {/* ── Step label — small grey, matches "Step 1: Event Info" in image ── */}
      <div className="px-4 mb-5">
        <p className="text-[#777] text-[12px]">
          Step {step}: {STEPS[step - 1].label}
        </p>
      </div>

      {/* ── Form fields ── */}
      <div className="px-4">
        {step === 1 && <Step1 form={form} setForm={setForm} errors={errors} />}
        {step === 2 && <Step2 form={form} setForm={setForm} errors={errors} />}
        {step === 3 && <Step3 form={form} setForm={setForm} />}
        {step === 4 && <Step4 form={form} />}
      </div>

      {/* ── Submit error ── */}
      {submitError && (
        <div className="px-4 mt-4">
          <div className="px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-xs">{submitError}</p>
          </div>
        </div>
      )}

      {/* ── Continue / Publish button — matches image exactly ── */}
      <div className="px-4 mt-8">
        <button
          onClick={handleContinue}
          disabled={submitting}
          className="
            w-full py-4 rounded-full bg-[#FF6B2C] text-white text-[15px] font-bold
            shadow-[0_4px_24px_rgba(255,107,44,0.35)]
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
          ) : step < 4 ? (
            "Continue"
          ) : (
            "Publish Event"
          )}
        </button>

        {/* Back link on steps 2-4 */}
        {step > 1 && (
          <button
            onClick={handleBack}
            className="w-full mt-3 py-3 text-[#777] text-[13px] font-semibold active:opacity-60 transition-opacity"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

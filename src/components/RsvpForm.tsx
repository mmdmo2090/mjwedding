"use client";

import { useState, useTransition } from "react";
import { submitRsvp, type GuestSubmission } from "@/app/rsvp/[code]/actions";
import type { MealChoice } from "@/generated/prisma/client";

const MEAL_OPTIONS: { value: MealChoice; label: string }[] = [
  { value: "CHICKEN", label: "Chicken" },
  { value: "FISH", label: "Fish" },
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "KIDS", label: "Kids Menu" },
];

type ExistingGuest = {
  id: string;
  firstName: string;
  lastName: string;
  rsvpStatus: string;
  mealChoice: MealChoice | null;
  dietaryRestrictions: string | null;
};

type Row = {
  id: string | null;
  firstName: string;
  lastName: string;
  attending: boolean;
  mealChoice: MealChoice | null;
  dietaryRestrictions: string;
};

function toRow(guest: ExistingGuest): Row {
  return {
    id: guest.id,
    firstName: guest.firstName,
    lastName: guest.lastName,
    attending: guest.rsvpStatus !== "DECLINED",
    mealChoice: guest.mealChoice,
    dietaryRestrictions: guest.dietaryRestrictions ?? "",
  };
}

export default function RsvpForm({
  inviteCode,
  householdName,
  guests,
  maxGuests,
  initialNotes,
  isOpen,
}: {
  inviteCode: string;
  householdName: string;
  guests: ExistingGuest[];
  maxGuests: number;
  initialNotes: string;
  isOpen: boolean;
}) {
  const openSlots = Math.max(0, maxGuests - guests.length);

  const [rows, setRows] = useState<Row[]>([
    ...guests.map(toRow),
    ...Array.from({ length: openSlots }, () => ({
      id: null,
      firstName: "",
      lastName: "",
      attending: true,
      mealChoice: null,
      dietaryRestrictions: "",
    })),
  ]);
  const [notes, setNotes] = useState(initialNotes);
  const [result, setResult] = useState<
    { ok: true } | { ok: false; error: string } | null
  >(null);
  const [isPending, startTransition] = useTransition();

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: GuestSubmission[] = rows.map((row) => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      attending: row.attending,
      mealChoice: row.mealChoice,
      dietaryRestrictions: row.dietaryRestrictions,
    }));

    startTransition(async () => {
      const res = await submitRsvp(inviteCode, payload, notes);
      setResult(res);
    });
  }

  if (!isOpen) {
    return (
      <p className="mt-8 text-neutral-700">
        The RSVP deadline for {householdName} has passed. If you need to make a
        change, please contact us directly.
      </p>
    );
  }

  if (result?.ok) {
    return (
      <p className="mt-8 text-neutral-700">
        Thank you! Your RSVP has been recorded. You can revisit this page any
        time before the deadline to make changes.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {result && !result.ok && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </p>
      )}

      {rows.map((row, index) => {
        const isNewSlot = row.id === null;
        return (
          <div key={row.id ?? `new-${index}`} className="border-b border-neutral-200 pb-6">
            {isNewSlot ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={row.firstName}
                  onChange={(e) => updateRow(index, { firstName: e.target.value })}
                  className="w-1/2 rounded-md border border-neutral-300 px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={row.lastName}
                  onChange={(e) => updateRow(index, { lastName: e.target.value })}
                  className="w-1/2 rounded-md border border-neutral-300 px-3 py-2"
                />
              </div>
            ) : (
              <p className="font-medium text-neutral-900">
                {row.firstName} {row.lastName}
              </p>
            )}

            {(row.firstName.trim() || !isNewSlot) && (
              <div className="mt-3 space-y-3">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={row.attending}
                    onChange={(e) => updateRow(index, { attending: e.target.checked })}
                  />
                  Attending
                </label>

                {row.attending && (
                  <>
                    <select
                      value={row.mealChoice ?? ""}
                      onChange={(e) =>
                        updateRow(index, {
                          mealChoice: (e.target.value || null) as MealChoice | null,
                        })
                      }
                      className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select a meal</option>
                      {MEAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Dietary restrictions (optional)"
                      value={row.dietaryRestrictions}
                      onChange={(e) =>
                        updateRow(index, { dietaryRestrictions: e.target.value })
                      }
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div>
        <label className="block text-sm text-neutral-700">
          Song request / notes for the couple
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-neutral-900 px-4 py-3 text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit RSVP"}
      </button>
    </form>
  );
}

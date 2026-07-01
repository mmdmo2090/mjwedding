"use server";

import { prisma } from "@/lib/prisma";
import { isRsvpOpen } from "@/lib/rsvp";
import { MealChoice } from "@/generated/prisma/client";

export type GuestSubmission = {
  id: string | null;
  firstName: string;
  lastName: string;
  attending: boolean;
  mealChoice: MealChoice | null;
  dietaryRestrictions: string;
};

export type SubmitRsvpResult = { ok: true } | { ok: false; error: string };

export async function submitRsvp(
  code: string,
  guests: GuestSubmission[],
  notes: string,
): Promise<SubmitRsvpResult> {
  if (!isRsvpOpen()) {
    return { ok: false, error: "The RSVP deadline has passed." };
  }

  const household = await prisma.household.findUnique({
    where: { inviteCode: code },
    include: { guests: true },
  });

  if (!household) {
    return { ok: false, error: "Invite code not found." };
  }

  const existingGuestIds = new Set(household.guests.map((g) => g.id));
  const newGuests = guests.filter(
    (g) => g.id === null && g.firstName.trim().length > 0,
  );
  const updatedGuests = guests.filter(
    (g) => g.id !== null && existingGuestIds.has(g.id),
  );

  if (existingGuestIds.size + newGuests.length > household.maxGuests) {
    return {
      ok: false,
      error: `This household is limited to ${household.maxGuests} guests.`,
    };
  }

  await prisma.$transaction([
    ...updatedGuests.map((g) =>
      prisma.guest.update({
        where: { id: g.id! },
        data: {
          rsvpStatus: g.attending ? "ATTENDING" : "DECLINED",
          mealChoice: g.attending ? g.mealChoice : null,
          dietaryRestrictions: g.attending ? g.dietaryRestrictions || null : null,
          respondedAt: new Date(),
        },
      }),
    ),
    ...newGuests.map((g) =>
      prisma.guest.create({
        data: {
          householdId: household.id,
          firstName: g.firstName.trim(),
          lastName: g.lastName.trim(),
          rsvpStatus: g.attending ? "ATTENDING" : "DECLINED",
          mealChoice: g.attending ? g.mealChoice : null,
          dietaryRestrictions: g.attending ? g.dietaryRestrictions || null : null,
          respondedAt: new Date(),
        },
      }),
    ),
    prisma.household.update({
      where: { id: household.id },
      data: { songRequest: notes || null },
    }),
  ]);

  return { ok: true };
}

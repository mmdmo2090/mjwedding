import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isRsvpOpen } from "@/lib/rsvp";
import RsvpForm from "@/components/RsvpForm";

export default async function RsvpCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();

  const household = await prisma.household.findUnique({
    where: { inviteCode: code },
    include: { guests: true },
  });

  if (!household) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-4xl text-neutral-900">RSVP</h1>
        <p className="mt-4 text-neutral-700">
          We couldn&apos;t find an invite matching that code.
        </p>
        <Link href="/rsvp" className="mt-4 inline-block underline">
          Try again
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl text-neutral-900">
        {household.name}
      </h1>
      <p className="mt-2 text-neutral-600">
        Please respond for everyone in your household below.
      </p>
      <RsvpForm
        inviteCode={household.inviteCode}
        householdName={household.name}
        guests={household.guests}
        maxGuests={household.maxGuests}
        initialNotes={household.songRequest ?? ""}
        isOpen={isRsvpOpen()}
      />
    </div>
  );
}

import CodeEntryForm from "@/components/CodeEntryForm";

export default function RsvpEntryPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl text-neutral-900">RSVP</h1>
      <p className="mt-4 text-neutral-700">
        Enter the invite code from your invitation to RSVP for your household.
      </p>
      <CodeEntryForm />
    </div>
  );
}

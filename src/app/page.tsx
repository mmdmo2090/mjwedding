export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm tracking-widest text-neutral-500 uppercase">
        We&apos;re getting married
      </p>
      <h1 className="mt-6 font-serif text-5xl tracking-tight text-neutral-900 sm:text-6xl">
        [Partner 1] &amp; [Partner 2]
      </h1>
      <p className="mt-6 text-lg text-neutral-600">[Wedding Date] &middot; [City, State]</p>
      <p className="mt-10 max-w-xl text-neutral-600">
        We can&apos;t wait to celebrate with you. Check out our story, the details for the
        big day, and how to RSVP using the links above.
      </p>
    </div>
  );
}

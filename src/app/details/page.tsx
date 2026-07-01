const schedule = [
  { time: "[Time]", event: "Ceremony" },
  { time: "[Time]", event: "Cocktail Hour" },
  { time: "[Time]", event: "Reception" },
];

export default function DetailsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-4xl text-neutral-900">Details</h1>

      <section className="mt-10">
        <h2 className="text-sm tracking-widest text-neutral-500 uppercase">Venue</h2>
        <p className="mt-2 text-neutral-700">[Venue Name]</p>
        <p className="text-neutral-700">[Venue Address, City, State]</p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm tracking-widest text-neutral-500 uppercase">Schedule</h2>
        <ul className="mt-2 space-y-1 text-neutral-700">
          {schedule.map((item) => (
            <li key={item.event}>
              <span className="text-neutral-500">{item.time}</span> — {item.event}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm tracking-widest text-neutral-500 uppercase">Dress Code</h2>
        <p className="mt-2 text-neutral-700">[Dress Code]</p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm tracking-widest text-neutral-500 uppercase">
          Travel &amp; Lodging
        </h2>
        <p className="mt-2 text-neutral-700">
          [Recommended hotels, room blocks, and travel notes go here.]
        </p>
      </section>
    </div>
  );
}

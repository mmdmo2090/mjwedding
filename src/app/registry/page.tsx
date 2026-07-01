export default function RegistryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-4xl text-neutral-900">Registry</h1>
      <p className="mt-4 text-neutral-700">
        Your presence is the best present, but if you&apos;d like to give a gift, here are
        a few options.
      </p>

      <section className="mt-10">
        <h2 className="text-sm tracking-widest text-neutral-500 uppercase">
          Honeymoon Fund
        </h2>
        <p className="mt-2 text-neutral-700">
          We&apos;re saving up for our honeymoon — feel free to send a contribution our
          way.
        </p>
        <ul className="mt-4 space-y-2 text-neutral-700">
          <li>
            Venmo:{" "}
            <a href="https://venmo.com/[handle]" className="underline">
              @[handle]
            </a>
          </li>
          <li>
            PayPal:{" "}
            <a href="https://paypal.me/[handle]" className="underline">
              paypal.me/[handle]
            </a>
          </li>
          <li>
            Cash App:{" "}
            <a href="https://cash.app/$[handle]" className="underline">
              $[handle]
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm tracking-widest text-neutral-500 uppercase">Registries</h2>
        <ul className="mt-4 space-y-2 text-neutral-700">
          <li>
            <a href="#" className="underline">
              [Registry 1 — e.g. Amazon]
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              [Registry 2 — e.g. Target]
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

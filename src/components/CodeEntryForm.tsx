"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CodeEntryForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = code.trim();
        if (!trimmed) return;
        router.push(`/rsvp/${encodeURIComponent(trimmed)}`);
      }}
      className="mt-8 flex flex-col gap-4"
    >
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g. SMITH-7K2"
        autoCapitalize="characters"
        className="rounded-md border border-neutral-300 px-4 py-3 text-lg uppercase tracking-wide focus:border-neutral-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-3 text-white transition-colors hover:bg-neutral-700"
      >
        Continue
      </button>
    </form>
  );
}

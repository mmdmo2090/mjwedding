import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/details", label: "Details" },
  { href: "/gallery", label: "Gallery" },
  { href: "/registry", label: "Registry" },
  { href: "/rsvp", label: "RSVP" },
];

export default function Nav() {
  return (
    <header className="border-b border-neutral-200">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 text-sm tracking-wide uppercase">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-neutral-600 transition-colors hover:text-neutral-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

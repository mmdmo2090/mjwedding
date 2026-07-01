import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

function getGalleryImages() {
  const dir = path.join(process.cwd(), "public", "images", "gallery");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort();
}

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-serif text-4xl text-neutral-900">Gallery</h1>

      {images.length === 0 ? (
        <p className="mt-8 text-neutral-600">
          No photos yet — drop image files into{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5">
            public/images/gallery
          </code>{" "}
          and they&apos;ll show up here automatically.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((file) => (
            <div key={file} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={`/images/gallery/${file}`}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

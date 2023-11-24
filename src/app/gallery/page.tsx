import Container from "@/components/container";
import GALLERY from "@/data/gallery";
import Image from "next/image";
import React from "react";

export default function GalleryPage() {
  return (
    <Container as="section" className="pt-14">
      <h1 className="text-2xl font-semibold">
        A growing rolodex of personal sketches, explorations, and snapshots of
        people and images that make me happy. I wouldnt call myself an artist or
        photographer by any means, but documenting my life through pencil, pen,
        paint, film, etc. is something that grounds me.
      </h1>
      <div className="mt-6 columns-1 gap-5 sm:columns-2 sm:gap-4 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-4">
        {GALLERY.map((item, index) => (
          <Image
            key={index}
            src={`/gallery/${item.img}`}
            alt={item.alt}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full object-cover"
          />
        ))}
      </div>
    </Container>
  );
}

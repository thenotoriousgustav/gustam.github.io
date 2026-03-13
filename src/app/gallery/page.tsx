import Container from "@/components/container";
import GALLERY from "@/data/gallery";
import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GalleryPage() {
  return (
    <Container as="section" className="pt-14">
      <h1 className="text-2xl font-semibold">
        A growing rolodex of personal sketches, explorations, and snapshots of
        people and images that make me happy. I wouldnt call myself an artist or
        photographer by any means, but documenting my life through pencil, pen,
        paint, film, etc. is something that grounds me.
      </h1>
      <div className="mt-6 columns-1 gap-5 sm:columns-2 sm:gap-4 md:columns-3 lg:columns-4 [&>*:not(:first-child)]:mt-4">
        {GALLERY.map((item, index) => {
          const isVideo =
            item.img.endsWith(".mp4") || item.img.endsWith(".mov");
          return (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <button className="group relative block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {isVideo ? (
                    <video
                      src={`/gallery/${item.img}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={`/gallery/${item.img}`}
                      alt={item.alt}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </button>
              </DialogTrigger>
              <DialogContent
                className="border-none bg-transparent p-0 shadow-none"
                hideCloseButton
              >
                <DialogTitle className="sr-only">{item.alt}</DialogTitle>
                {isVideo ? (
                  <video
                    src={`/gallery/${item.img}`}
                    autoPlay
                    loop
                    playsInline
                    controls
                    className="h-auto max-h-[85vh] w-full rounded-md object-contain"
                  />
                ) : (
                  <div className="relative flex h-[85vh] w-full items-center justify-center">
                    <Image
                      src={`/gallery/${item.img}`}
                      alt={item.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </Container>
  );
}

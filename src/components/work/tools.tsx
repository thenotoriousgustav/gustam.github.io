"use client";

import Image from "next/image";
import { useState, type FocusEvent, type MouseEvent } from "react";
import { TOOLS } from "@/data/profile";
import { cn } from "@/lib/utils";
import { sectionTitle } from "@/lib/styles";

// Preview card size (px): 16:10 screenshot inside a 6px frame.
const CARD_W = 360;
const CARD_H = (CARD_W - 12) * (10 / 16) + 12;
const OFFSET = 20;

/** Place the card above-right of a point, flipping to stay inside the window. */
function place(x: number, y: number) {
  let left = x + OFFSET;
  if (left + CARD_W > window.innerWidth - 16) left = x - CARD_W - OFFSET;
  let top = y - CARD_H - OFFSET;
  if (top < 16) top = y + OFFSET;
  return { left, top };
}

export default function Tools() {
  const [active, setActive] = useState<string | null>(null);
  // The card (and its screenshots) mounts on first hover, so it costs nothing until used.
  const [armed, setArmed] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const follow = (event: MouseEvent) => setPos(place(event.clientX, event.clientY));
  const show = (name: string) => (event: MouseEvent) => {
    setArmed(true);
    setActive(name);
    follow(event);
  };
  const focus = (name: string) => (event: FocusEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setArmed(true);
    setActive(name);
    setPos(place(rect.left + rect.width / 2, rect.top));
  };
  const hide = () => setActive(null);

  return (
    <section className="mt-20 sm:mt-[140px]" aria-labelledby="tools-title">
      <h2 id="tools-title" className={cn(sectionTitle, "mb-6 sm:mb-9")}>
        Tools I use
      </h2>
      <ul className="flex flex-wrap items-center gap-x-[0.4em] gap-y-[0.35em] text-[clamp(22px,1.95vw,32px)] leading-[1.2] tracking-[-0.02em]">
        {TOOLS.map((tool, index) => (
          <li key={tool.name} className="flex items-center gap-[0.4em]">
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={show(tool.name)}
              onMouseMove={follow}
              onMouseLeave={hide}
              onFocus={focus(tool.name)}
              onBlur={hide}
              className={cn(
                "inline-flex items-center gap-[0.35em] rounded-lg transition-colors hover:text-ink focus-visible:text-ink",
                active === tool.name ? "text-ink" : "text-soft",
              )}
            >
              <span className="grid size-[1.2em] shrink-0 place-items-center overflow-hidden rounded-[0.3em] bg-surface">
                <Image src={tool.icon} alt="" width={64} height={64} unoptimized className="size-[0.85em] object-contain" />
              </span>
              {tool.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {index < TOOLS.length - 1 && (
              <span aria-hidden="true" className="text-soft">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>

      {armed && (
        // Floating preview: mouse and keyboard only; on touch screens the names are plain links.
        <div
          aria-hidden="true"
          style={{ width: CARD_W, transform: `translate3d(${pos.left}px, ${pos.top}px, 0)` }}
          className="pointer-events-none fixed top-0 left-0 z-40 hidden pointer-fine:block"
        >
          <div
            className={cn(
              "relative aspect-[16/10] origin-bottom-left overflow-hidden rounded-[20px] bg-surface p-1.5 shadow-[0_24px_60px_-12px_rgb(24_32_43/0.35)] transition-[opacity,scale] duration-200 ease-soft",
              active ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
          >
            {TOOLS.map((tool) => (
              <Image
                key={tool.name}
                src={tool.preview}
                alt=""
                width={800}
                height={500}
                // Already 800px JPEGs; next.config only allows optimising CMS media paths.
                unoptimized
                className={cn(
                  "absolute inset-1.5 h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-[14px] object-cover object-top",
                  active === tool.name ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

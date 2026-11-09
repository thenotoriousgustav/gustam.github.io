"use client";

import { Children, type ReactNode } from "react";
import { Masonry, MasonryItem } from "@/components/ui/masonry";

/**
 * Work wall: 4 columns on desktop, 2 on tablet, 1 on phone. Each item goes to
 * the shortest column so the wall ends evenly (DOM order stays the source
 * order). The server-rendered fallback is a plain
 * grid, so every project is visible before JavaScript measures the page.
 */
export default function ProjectMasonry({ children }: { children: ReactNode }) {
  return (
    <Masonry
      columnWidth={300}
      maxColumnCount={4}
      gap={{ column: 24, row: 40 }}
      defaultWidth={1392}
      defaultHeight={900}
      // Keep this small collection mounted for keyboard navigation.
      overscan={100}
      fallback={
        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 min-[648px]:grid-cols-2 min-[1320px]:grid-cols-4">
          {children}
        </div>
      }
    >
      {Children.map(children, (child) => (
        <MasonryItem>{child}</MasonryItem>
      ))}
    </Masonry>
  );
}

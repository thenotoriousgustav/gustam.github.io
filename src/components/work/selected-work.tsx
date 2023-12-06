"use client";

import WORK from "@/data/work";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";

export default function SelectedWork() {
  const [work, setWork] = useState(WORK[0]);

  return (
    <ScrollArea className={cn("h-full w-full pt-4", "lg:h-screen lg:px-6")}>
      <h1 className="text-xl font-semibold tracking-tight">SELECTED WORK</h1>{" "}
      <Separator className="border-b border-primary" />
      <div
        className="my-3 grid justify-items-start"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr)" }}
      >
        {WORK.map((w) => (
          <Button
            onClick={() => setWork(w)}
            className={cn(
              "h-5 p-0 text-sm ",
              work.name === w.name ? "font-semibold text-blue-600" : "",
            )}
            variant="link"
            key={w.name}
          >
            {w.name}
          </Button>
        ))}
      </div>
      <Separator className="border-b border-primary" />
      <div className="mb-10 mt-4 lg:mb-36">
        <a
          href={work.link}
          target="_blank"
          rel="noreferrer"
          className="flex justify-between gap-x-4"
        >
          {work.images.map((img, index) => (
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src={`/work/${img}`}
              className="max-h-[800px] w-full bg-cover"
              alt={`${work.name} number ${index}`}
              key={`${work.name} number ${index}`}
            />
          ))}
        </a>
        <p
          className="mt-4 text-4xl font-bold uppercase tracking-tight"
          id={work.name.replace(" ", "_")}
        >
          {work.name}
        </p>

        <div
          dangerouslySetInnerHTML={{ __html: work.description }}
          className="mt-4 tracking-tight"
        ></div>
      </div>
    </ScrollArea>
  );
}

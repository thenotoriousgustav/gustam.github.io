"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { mediaFallback } from "@/lib/styles";

export default function ProjectScreenshot({
  src,
  alt,
  priority = false,
  sizes,
  width,
  height,
  className,
}: {
  src: string | StaticImageData;
  alt: string;
  priority?: boolean;
  sizes: string;
  width?: number | null;
  height?: number | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <p className={mediaFallback}>This screenshot is unavailable.</p>
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width || 1600}
      height={height || 1000}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

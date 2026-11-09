"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";

const viewerMedia = 'h-auto max-h-[calc(90dvh-150px)] w-auto max-w-full rounded-2xl object-contain';
const thumbSizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw';

type Media = { url?: string; mimeType?: string; width?: number; height?: number; alt?: string };
type Item = { id: string; alt: string; caption: string; kind: 'image' | 'video'; media?: Media; poster?: Media };

/**
 * Muted looping preview over the poster. It loads and plays only while on
 * screen, pauses off screen, and stays hidden (poster visible) if the browser
 * cannot play the file or the visitor prefers reduced motion.
 */
function AutoplayPreview({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;
    // React does not always reflect `muted` before autoplay; set it directly.
    video.muted = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion.matches) {
        // AbortError (paused while starting) and NotAllowedError (autoplay
        // blocked, e.g. iOS Low Power Mode) keep the poster; retry next time.
        video.play().catch((error: DOMException) => {
          if (error.name === 'NotSupportedError') setFailed(true);
        });
      } else {
        video.pause();
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, [failed]);

  if (failed) return null;
  return <video
    ref={ref}
    src={src}
    muted
    loop
    playsInline
    preload="none"
    aria-hidden="true"
    tabIndex={-1}
    onPlaying={() => setPlaying(true)}
    onError={() => setFailed(true)}
    className={cn('absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300', playing && 'opacity-100')}
  />;
}

/** `eager`: the tile is in the first row, above the fold (the page's LCP image). */
export default function GalleryMedia({ item, eager = false }: { item: Item; eager?: boolean }) {
  const loading = eager ? 'eager' : 'lazy';
  const video = item.kind === 'video';
  const src = item.media?.url || '';
  const poster = item.poster?.url;
  const [videoFailed, setVideoFailed] = useState(false);
  return <Dialog>
    <DialogTrigger asChild><button className="relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-inset text-left hover:opacity-85 active:scale-96 motion-reduce:active:scale-100 sm:mb-6" aria-label={`Open ${video ? 'video' : 'photo'}: ${item.alt}`}>
      {video ? <>
        <Image className="block h-auto w-full" loading={loading} src={poster || src} alt="" width={item.poster?.width || 749} height={item.poster?.height || 1000} sizes={thumbSizes} />
        <AutoplayPreview src={src} />
      </> : <Image className="block h-auto w-full" loading={loading} src={src} alt={item.alt} width={item.media?.width || 1200} height={item.media?.height || 900} sizes={thumbSizes} />}
    </button></DialogTrigger>
    <DialogContent className="max-w-5xl" aria-describedby={undefined}><DialogTitle className="pr-12 leading-normal">{item.caption}</DialogTitle>
      {/* Opening the dialog is a click, so the browser allows playback with sound. */}
      <div className="flex min-h-0 items-center justify-center">{video ? videoFailed ? <p>This video cannot be played in your browser. Open the original video below.</p> : <video className={viewerMedia} src={src} poster={poster} controls autoPlay playsInline preload="metadata" onError={() => setVideoFailed(true)} aria-label={item.alt}>Your browser cannot play this video.</video> : <Image className={viewerMedia} src={src} alt={item.alt} width={item.media?.width || 1200} height={item.media?.height || 900} sizes="(min-width: 1024px) 1000px, 95vw" />}</div>
      <div className="flex justify-between gap-4 text-sm text-soft"><span>{video ? 'Video' : 'Photo'}</span><a className="text-primary underline underline-offset-4" href={src} target="_blank" rel="noreferrer">Open original<span className="sr-only"> (opens in a new tab)</span></a></div>
    </DialogContent>
  </Dialog>
}

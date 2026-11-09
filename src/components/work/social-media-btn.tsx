import { cn } from "@/lib/utils";

type SocialLink = { label: string; url: string };
export default function SocialMediaBtn({ className, links }: { className?: string; links: SocialLink[] }) {
  return (
    <div className={cn("flex flex-wrap gap-x-5 gap-y-1", className)} aria-label="Contact links">
      {links.map(({ label, url }) => (
        <a
          key={label}
          href={url}
          className="inline-flex min-h-11 items-center text-primary underline underline-offset-[5px] hover:text-ink"
        >
          {label}
        </a>
      ))}
    </div>
  );
}

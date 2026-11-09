"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { shell } from "@/lib/styles";
import { SocialIcon } from "@/components/social-icons";

const NAV_LINKS = [
  ["/", "Work"],
  ["/gallery", "Gallery"],
  ["/blog", "Blog"],
] as const;

export default function Navigation({
  wordmark = "Gustam Rheza.",
  socialLinks = [],
}: {
  wordmark?: string;
  /** Site settings social links, shown as icon buttons on the right. */
  socialLinks?: { label: string; url: string }[];
}) {
  const pathname = usePathname();
  return (
    <>
      <header
        className={cn(
          shell,
          "flex items-center justify-between gap-6 pt-5 pb-4 sm:pt-7 sm:pb-5",
        )}
        aria-label="Site header"
      >
        <Link
          href="/"
          className="text-[22px] font-[750] tracking-[-0.05em] whitespace-nowrap text-ink hover:opacity-80"
        >
          {wordmark}
        </Link>
        {socialLinks.length > 0 && (
          <ul className="-mr-2.5 flex items-center" aria-label="Contact links">
            {socialLinks.map(({ label, url }) => {
              const external = !url.startsWith("mailto:");
              return (
                <li key={label}>
                  <a
                    href={url}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    title={label}
                    className="grid size-11 place-items-center rounded-full text-soft transition-colors hover:bg-inset hover:text-ink active:scale-95 motion-reduce:active:scale-100"
                  >
                    <SocialIcon label={label} url={url} />
                    <span className="sr-only">
                      {label}
                      {external && " (opens in a new tab)"}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </header>

      {/* Bottom dock: one flat ink field, no blur, no shadow. */}
      <nav
        className="pointer-events-none fixed bottom-[max(16px,env(safe-area-inset-bottom,16px))] left-1/2 z-50 max-w-[calc(100vw-32px)] -translate-x-1/2 sm:bottom-6"
        aria-label="Main navigation"
      >
        <div className="pointer-events-auto inline-flex items-center gap-px rounded-full bg-ink p-[3px] sm:gap-0.5 sm:p-1">
          {NAV_LINKS.map(([href, label]) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/work")
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center justify-center rounded-full px-[13px] py-[7px] text-[13px] font-[550] whitespace-nowrap select-none sm:px-[18px] sm:py-2 sm:text-sm",
                  "transition-[color,background-color,transform] duration-160 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-canvas focus-visible:outline-offset-2 active:scale-96 motion-reduce:active:scale-100",
                  isActive
                    ? "bg-canvas text-ink"
                    : "text-white/72 hover:bg-white/12 hover:text-white",
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

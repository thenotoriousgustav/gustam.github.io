import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PAPERS } from "@/data/profile";
import { cn } from "@/lib/utils";
import { sectionTitle, textLink } from "@/lib/styles";

/** Research & papers: one ruled row per paper, its kind on the left, title and context on the right. */
export default function Research() {
  return (
    <section className="mt-20 sm:mt-[140px]" aria-labelledby="research-title">
      <h2 id="research-title" className={cn(sectionTitle, "mb-6 sm:mb-9")}>
        Research &amp; papers
      </h2>
      <ol className="border-b border-inset">
        {PAPERS.map((paper) => (
          <li
            key={paper.title}
            className="grid grid-cols-1 gap-2 border-t border-inset py-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6 sm:py-8 lg:grid-cols-12"
          >
            <p className="text-[17px] leading-[1.5] font-[550] lg:col-span-3">
              {paper.type}
              <span className="block font-normal text-soft tabular-nums">{paper.year}</span>
            </p>
            <div className="lg:col-span-9">
              <h3 lang="id" className="max-w-[46ch] font-serif text-[clamp(22px,2vw,28px)] leading-[1.25] font-normal tracking-[-0.01em] text-balance">
                {paper.title}
              </h3>
              <p className="mt-2 max-w-[64ch] text-[17px] leading-[1.55] text-soft">{paper.english}</p>
              <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6]">{paper.summary}</p>
              <p className="mt-4 flex flex-col items-start gap-0.5 text-[15px] leading-[1.5] text-soft">
                <span>{paper.institution}</span>
                <span>Supervised by {paper.supervisor}</span>
                <Link className={cn(textLink, "-my-1.5 min-h-0 gap-1.5 py-2.5")} href={`/work/${paper.project.slug}`}>
                  Project: {paper.project.title} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

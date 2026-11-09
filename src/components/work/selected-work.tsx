import Link from "next/link";
import ProjectScreenshot from "./project-screenshot";
import ProjectMasonry from "./project-masonry";
import { cn } from "@/lib/utils";
import { mediaFallback, sectionTitle } from "@/lib/styles";

type Media = { url?: string; width?: number; height?: number; alt?: string };
type Project = {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  displayDate?: string;
  screenshots?: { id?: string; media?: Media }[];
};

// Fields for projects that have no screenshot yet, used in turn.
const POSTER_FIELDS = [
  "bg-primary text-primary-foreground",
  "bg-ink text-canvas",
];

const SIZES =
  "(min-width: 1320px) 24vw, (min-width: 648px) 48vw, calc(100vw - 32px)";

function Cover({
  project,
  posterIndex,
  priority,
}: {
  project: Project;
  posterIndex: number;
  priority: boolean;
}) {
  const image = (project.screenshots || []).find(({ media }) => media?.url)
    ?.media;

  if (!image) {
    return (
      <div
        className={cn(
          "flex aspect-[4/5] flex-col justify-between gap-6 p-6 sm:p-7",
          POSTER_FIELDS[posterIndex % POSTER_FIELDS.length],
        )}
      >
        <p
          aria-hidden="true"
          className={cn(
            "max-w-none font-[650] tracking-[-0.05em] text-balance",
            // Long names step down so whole words fit the column.
            project.title.length > 16
              ? "text-[clamp(32px,2.6vw,40px)]"
              : "text-[clamp(40px,3.6vw,56px)]",
            // After the size: tailwind-merge drops leading set before a font size.
            "leading-[0.95]",
          )}
        >
          {project.title}
        </p>
        <p className="max-w-[30ch] text-[15px] leading-[1.45] opacity-85">
          {project.summary}
        </p>
      </div>
    );
  }

  // Phone screens are about 1:2.2; crop them to a 3:4 portrait from the top.
  const tall = (image.height || 0) / (image.width || 1) > 1.4;
  return (
    <div className={cn(tall && "aspect-[3/4]")}>
      <ProjectScreenshot
        src={image.url!}
        alt={image.alt || `${project.title} screenshot`}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes={SIZES}
        className={cn(
          "block w-full transition-transform duration-500 ease-soft group-hover:scale-[1.03] motion-reduce:group-hover:scale-100",
          tall ? "h-full object-cover object-top" : "h-auto",
        )}
      />
    </div>
  );
}

export default function SelectedWork({
  projects,
  title = "Selected work",
}: {
  projects: Project[];
  title?: string;
}) {
  let posterCount = 0;
  return (
    <section id="selected-work" aria-labelledby="selected-work-title">
      <div className="mb-6 flex items-baseline justify-between gap-6 sm:mb-8">
        <h2 id="selected-work-title" className={sectionTitle}>
          {title}
        </h2>
        {projects.length > 0 && (
          <p className="shrink-0 text-soft tabular-nums">
            {projects.length} projects
          </p>
        )}
      </div>
      {projects.length === 0 ? (
        <p className={mediaFallback}>Projects will appear here soon.</p>
      ) : (
        <ProjectMasonry>
          {projects.map((project, projectIndex) => {
            const hasImage = (project.screenshots || []).some(
              ({ media }) => media?.url,
            );
            const posterIndex = hasImage ? 0 : posterCount++;
            return (
              <article key={project.id} className="min-w-0">
                <Link href={`/work/${project.slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl bg-inset transition-transform group-active:scale-99 motion-reduce:group-active:scale-100">
                    <Cover
                      project={project}
                      posterIndex={posterIndex}
                      priority={projectIndex < 4}
                    />
                  </div>
                  <h3 className="mt-3 text-[18px] leading-[1.25] tracking-[-0.02em] transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  {project.displayDate && (
                    <p className="mt-0.5 text-[15px] text-soft tabular-nums">
                      {project.displayDate}
                    </p>
                  )}
                </Link>
              </article>
            );
          })}
        </ProjectMasonry>
      )}
    </section>
  );
}

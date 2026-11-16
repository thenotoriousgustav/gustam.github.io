import Image from 'next/image'
import {
  siAngular, siChakraui, siCloudflare, siCoolify, siCss, siDatagrip, siDigitalocean, siDotnet, siDrizzle, siExpress,
  siFirebase, siGit, siGo, siHomebrew, siHtml5, siIntellijidea, siJavascript, siJest, siJira, siMongodb, siMysql,
  siNestjs, siNetlify, siNextdotjs, siNpm, siOpenjdk, siPnpm, siPostgresql, siPrisma, siReact, siRedux, siRust, siShadcnui,
  siSpringboot, siSupabase, siSwift, siTailwindcss, siTypescript, siVercel, siVuedotjs, siXcode, siYarn,
  type SimpleIcon,
} from 'simple-icons'
import { TOOLS } from '@/data/profile'
import { cn } from '@/lib/utils'
import { sectionTitle } from '@/lib/styles'

// Skill names as written in the CMS (lower case) → brand mark. Names not listed get a monogram.
const ICONS: Record<string, SimpleIcon> = {
  typescript: siTypescript, javascript: siJavascript, swift: siSwift, rust: siRust, go: siGo, java: siOpenjdk, html: siHtml5, css: siCss,
  'next.js': siNextdotjs, react: siReact, angular: siAngular, vue: siVuedotjs, 'react native': siReact, swiftui: siSwift,
  'tailwind css': siTailwindcss, 'chakra ui': siChakraui, 'shadcn/ui': siShadcnui,
  'express.js': siExpress, nestjs: siNestjs, 'spring boot': siSpringboot, '.net': siDotnet, mongodb: siMongodb, mysql: siMysql,
  postgresql: siPostgresql, supabase: siSupabase, firebase: siFirebase, prisma: siPrisma, 'drizzle orm': siDrizzle,
  redux: siRedux, jest: siJest,
  coolify: siCoolify, vercel: siVercel, netlify: siNetlify, 'cloudflare r2': siCloudflare, digitalocean: siDigitalocean,
  git: siGit, jira: siJira, xcode: siXcode, 'intellij idea': siIntellijidea, datagrip: siDatagrip, npm: siNpm, pnpm: siPnpm,
  yarn: siYarn, homebrew: siHomebrew,
}
// Tools also shown in "Tools I use" keep the same app icon in both places.
const TOOL_ICONS = Object.fromEntries(TOOLS.map((tool) => [tool.name.toLowerCase(), tool.icon]))

// Brand colours too pale to read on a white pill (Drizzle, Homebrew, MySQL, …) fall back to the ink colour.
const readable = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.62 ? `#${hex}` : 'currentColor'
}

function Mark({ name }: { name: string }) {
  const key = name.toLowerCase()
  const tool = TOOL_ICONS[key]
  const icon = ICONS[key]
  if (tool) return <Image src={tool} alt="" aria-hidden="true" width={32} height={32} unoptimized className="size-[18px] shrink-0 object-contain" />
  if (icon) return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill={readable(icon.hex)}><path d={icon.path} /></svg>
  // No brand mark available: a small neutral dot keeps every pill the same shape.
  return <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-soft/50" />
}

/** A comma-separated CMS list ("TypeScript, Go, …") as pills with logos. */
function SkillList({ items }: { items: string }) {
  const skills = items.split(',').map((item) => item.trim()).filter(Boolean)
  return <ul className="flex flex-wrap gap-2">
    {skills.map((skill) => <li key={skill} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-surface py-1.5 pr-3.5 pl-3 text-[15px] leading-none text-ink">
      <Mark name={skill} />{skill}
    </li>)}
  </ul>
}

/** Technical skills (About global "favorites"): one ruled row per category, its skills as pills. */
export default function Skills({ title, groups }: { title: string; groups: { id?: string | null; category: string; items: string }[] }) {
  return <section className="mt-20 sm:mt-[140px]" aria-labelledby="skills-title">
    <h2 id="skills-title" className={cn(sectionTitle, 'mb-6 sm:mb-9')}>{title}</h2>
    <dl className="border-b border-inset">
      {groups.map((group) => <div key={group.id || group.category} className="grid grid-cols-1 gap-3 border-t border-inset py-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6 sm:py-6 lg:grid-cols-12">
        <dt className="text-[17px] leading-9 font-[550] text-ink lg:col-span-3">{group.category}</dt>
        <dd className="lg:col-span-9"><SkillList items={group.items} /></dd>
      </div>)}
    </dl>
  </section>
}

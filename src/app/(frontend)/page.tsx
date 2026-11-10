import SelectedWork from '@/components/work/selected-work'
import Tools from '@/components/work/tools'
import GithubActivity from '@/components/work/github-activity'
import AboutSection from '@/components/about-section'
import { findDocs, findGlobal } from '@/lib/payload/server'
import ContentUnavailable from '@/components/content-unavailable'
import Link from 'next/link'
import { ArrowDown, ArrowUp, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { shell, textLink } from '@/lib/styles'


export default async function Home() {
  const [home, settings, projects, experiences, about] = await Promise.all([
    findGlobal('home'), findGlobal('site-settings'), findDocs('projects'), findDocs('experiences'), findGlobal('about'),
  ])
  if (!home || !settings || !projects || !experiences) return <ContentUnavailable />
  // "Currently": the role still running; "Previously": the next three roles.
  const role = (item: { position: string }) => item.position.split(' · ')[0]
  const company = (item: { company: string }) => item.company.replace(/^PT\.\s*/, '').replace(/ Tbk\b/, '').replace(' Republik Indonesia', '')
  const current = experiences.find((item) => !item.endDate) // no end date = still working there
  const previous = experiences.filter((item) => item !== current).slice(0, 3)
  const label = 'mb-2 text-soft'
  // The footer's call to action is the email link from Site Settings.
  const email = (settings.socialLinks || []).find((link) => link.url.startsWith('mailto:'))
  const github = (settings.socialLinks || []).find((link) => /^https:\/\/github\.com\//.test(link.url))
  return <div className={shell}>
    <section className="pt-10 pb-20 sm:pt-20 sm:pb-28" aria-labelledby="intro-title">
      <h1 id="intro-title" className="max-w-none font-serif text-[clamp(40px,6vw,92px)] leading-[1.05] font-normal tracking-[-0.02em]">{home.introTitle}</h1>
      <div className="mt-12 grid grid-cols-1 gap-8 text-[17px] leading-[1.55] sm:mt-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {current && <div className="lg:col-span-5">
          <p className={label}>Currently</p>
          <p className="max-w-[40ch]">{role(current)} @ {company(current)}, in Jakarta</p>
        </div>}
        {previous.length > 0 && <div className="lg:col-span-7">
          <p className={label}>Previously</p>
          <p className="max-w-[64ch]">{previous.map((item) => `${role(item)} @ ${company(item)}`).join(', ')}, and more.</p>
          <Link className={cn(textLink, 'mt-1 gap-1.5')} href="#about">More about me <ArrowDown size={18} aria-hidden="true" /></Link>
        </div>}
      </div>
    </section>
    <SelectedWork projects={projects as unknown as Parameters<typeof SelectedWork>[0]['projects']} title={home.selectedWorkTitle} />
    {about && <AboutSection about={about} />}
    <Tools />
    {github && <GithubActivity profileURL={github.url} />}
    <footer className="mt-20 pt-4 pb-8 sm:mt-[140px] sm:pb-12" aria-labelledby="contact-title">
      <h2 id="contact-title" className="font-serif text-[clamp(44px,7vw,112px)] leading-[1] font-normal tracking-[-0.02em]">{home.contactText}</h2>
      {email && <a href={email.url} className="mt-6 inline-flex min-h-11 items-center gap-2 text-[clamp(20px,2vw,28px)] text-primary underline underline-offset-[6px] hover:text-ink">
        {email.url.replace(/^mailto:/, '')} <ArrowUpRight size={24} aria-hidden="true" />
      </a>}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[15px] text-soft sm:mt-24">
        <p>© {new Date().getFullYear()} Gustam Rheza</p>
        <a href="#main-content" className="inline-flex min-h-11 items-center gap-1.5 hover:text-ink">Back to top <ArrowUp size={16} aria-hidden="true" /></a>
      </div>
    </footer>
  </div>
}

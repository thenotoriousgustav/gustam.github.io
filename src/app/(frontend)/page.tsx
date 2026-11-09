import SelectedWork from '@/components/work/selected-work'
import Tools from '@/components/work/tools'
import AboutSection from '@/components/about-section'
import SocialMediaBtn from '@/components/work/social-media-btn'
import { findDocs, findGlobal } from '@/lib/payload/server'
import ContentUnavailable from '@/components/content-unavailable'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { shell, textLink } from '@/lib/styles'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [home, settings, projects, experiences, about] = await Promise.all([
    findGlobal('home'), findGlobal('site-settings'), findDocs('projects'), findDocs('experiences'), findGlobal('about'),
  ])
  if (!home || !settings || !projects || !experiences) return <ContentUnavailable />
  // "Currently": the role still running; "Previously": the next three roles.
  const role = (item: { position: string }) => item.position.split(' · ')[0]
  const company = (item: { company: string }) => item.company.replace(/^PT\.\s*/, '').replace(/ Tbk\b/, '').replace(' Republik Indonesia', '')
  const current = experiences.find((item) => /present/i.test(item.endDate))
  const previous = experiences.filter((item) => item !== current).slice(0, 3)
  const label = 'mb-2 text-soft'
  return <div className={shell}>
    <section className="pt-10 pb-20 sm:pt-20 sm:pb-28" aria-labelledby="intro-title">
      <h1 id="intro-title" className="max-w-none font-serif text-[clamp(40px,6vw,92px)] leading-[1.05] font-normal tracking-[-0.02em]">{home.introTitle}</h1>
      <div className="mt-12 grid grid-cols-1 gap-8 text-[17px] leading-[1.55] sm:mt-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {current && <div className="lg:col-span-4">
          <p className={label}>Currently</p>
          <p className="max-w-[30ch]">{role(current)} @ {company(current)}, in Jakarta</p>
        </div>}
        {previous.length > 0 && <div className="lg:col-span-5">
          <p className={label}>Previously</p>
          <p className="max-w-[48ch]">{previous.map((item) => `${role(item)} @ ${company(item)}`).join(', ')}, and more.</p>
          <Link className={cn(textLink, 'mt-1 gap-1.5')} href="#about">More about me <ArrowDown size={18} aria-hidden="true" /></Link>
        </div>}
      </div>
    </section>
    <SelectedWork projects={projects as unknown as Parameters<typeof SelectedWork>[0]['projects']} title={home.selectedWorkTitle} />
    {about && <AboutSection about={about} />}
    <Tools />
    <footer className="flex flex-col items-start gap-6 pt-16 pb-8 sm:flex-row sm:items-end sm:justify-between sm:pt-[120px] sm:pb-12" aria-labelledby="contact-title">
      <h2 id="contact-title" className="text-[clamp(36px,5vw,64px)]">{home.contactText}</h2>
      <SocialMediaBtn links={settings.socialLinks || []} />
    </footer>
  </div>
}

import { permanentRedirect } from 'next/navigation'

// About now lives on the home page; keep old /about links working (308).
export default function AboutPage() {
  permanentRedirect('/#about')
}

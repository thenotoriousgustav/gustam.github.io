import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./styles/globals.css";
import Navigation from "@/components/navigation";
import { findGlobal } from "@/lib/payload/server";
import ContentUnavailable from "@/components/content-unavailable";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
// Serif for the home introduction sentence only.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const settings = await findGlobal("site-settings");
  return settings
    ? { title: settings.seoTitle, description: settings.seoDescription }
    : { title: "Portfolio temporarily unavailable" };
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await findGlobal("site-settings");
  return (
    <html lang="en">
      <body>
        <div className={`${manrope.variable} ${newsreader.variable} font-sans`}>
          <a href="#main-content" className="fixed -top-[100px] left-4 z-[100] rounded-full bg-primary px-5 py-3 text-primary-foreground focus:top-4">
            Skip to content
          </a>
          {settings && <Navigation wordmark={settings.wordmark} socialLinks={settings.socialLinks || []} />}
          <main id="main-content" tabIndex={-1}>
            {settings ? children : <ContentUnavailable />}
          </main>
        </div>
      </body>
    </html>
  );
}

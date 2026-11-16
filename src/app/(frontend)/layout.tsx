import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./styles/globals.css";
import Navigation from "@/components/navigation";
import { findGlobal, findPosts } from "@/lib/payload/server";
import ContentUnavailable from "@/components/content-unavailable";
import LivePreviewRefresh from "@/components/live-preview-refresh";

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
// Cached pages, refreshed by the Payload change hooks (payload.config.ts); 5 min is the fallback.
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  const settings = await findGlobal("site-settings");
  return {
    // Absolute URLs for link previews (og:image etc.) need a base.
    metadataBase: new URL(process.env.APP_ORIGIN || "http://localhost:3000"),
    ...(settings
      ? { title: settings.seoTitle, description: settings.seoDescription }
      : { title: "Portfolio temporarily unavailable" }),
    openGraph: { type: "website", siteName: "Gustam Rheza" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, posts] = await Promise.all([findGlobal("site-settings"), findPosts(1)]);
  return (
    <html lang="en">
      <body>
        <div className={`${manrope.variable} ${newsreader.variable} font-sans`}>
          <a href="#main-content" className="fixed -top-[100px] left-4 z-[100] rounded-full bg-primary px-5 py-3 text-primary-foreground focus:top-4">
            Skip to content
          </a>
          {settings && <Navigation wordmark={settings.wordmark} socialLinks={settings.socialLinks || []} showBlog={Boolean(posts?.totalDocs)} />}
          <main id="main-content" tabIndex={-1}>
            {settings ? children : <ContentUnavailable />}
          </main>
          <LivePreviewRefresh />
        </div>
      </body>
    </html>
  );
}

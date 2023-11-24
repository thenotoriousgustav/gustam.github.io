import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Navigation from "@/components/navigation";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gustam Rheza | Portfolio",
  description: "This is my personal website portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

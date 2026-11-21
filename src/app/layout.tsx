import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Toaster } from "@/components/ui/sonner";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "WedPlan — Wedding Planning Platform", template: "%s | WedPlan" },
  description: "Discover and book trusted wedding photographers, venues, florists, caterers, stylists and fashion designers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
        <Toaster />
      </body>
    </html>
  );
}

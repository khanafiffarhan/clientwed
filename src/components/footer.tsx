import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/logo";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm text-primary-foreground/75">WedPlan connects couples with trusted wedding vendors, from the first photographer enquiry to the final flower arch.</p>
          <div className="flex gap-3">
            {[{ i: Facebook, l: "Facebook" }, { i: Instagram, l: "Instagram" }, { i: Twitter, l: "Twitter" }, { i: Youtube, l: "YouTube" }].map(({ i: Icon, l }) => (
              <a key={l} href="#" aria-label={l} className="rounded-full border border-white/25 p-2 transition-colors hover:bg-white/10"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-display text-lg font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Browse Services</Link></li>
            <li><Link href="/sign-in" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-lg font-semibold">Categories</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {CATEGORIES.map((c) => <li key={c.name}><Link href={`/services?category=${encodeURIComponent(c.name)}`} className="hover:text-white">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-lg font-semibold">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />House 12, Road 5, Khulna, Bangladesh</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" />+880 1700 000 000</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" />hello@wedplan.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-primary-foreground/70">© {new Date().getFullYear()} WedPlan. All rights reserved.</div>
    </footer>
  );
}

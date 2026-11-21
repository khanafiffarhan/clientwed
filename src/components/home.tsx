"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarCheck, CreditCard, Search, Send, ShieldCheck, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard, ServiceCardSkeleton } from "@/components/service-card";
import { EmptyState, ErrorState } from "@/components/states";
import { HeroArt } from "@/components/hero-art";
import { Item, Stagger } from "@/components/motion";
import { CATEGORIES, type Service } from "@/lib/constants";
import { useApi } from "@/lib/hooks";

export function Hero() {
  const reduce = useReducedMotion();
  const up = (d: number) => ({ initial: reduce ? false : { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: "easeOut" as const } });
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-petal/50 via-background to-background">
      <div className="container grid items-center gap-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:py-24">
        <div>
          <motion.h1 {...up(0)} className="text-balance text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
            Find the people who will make your wedding day yours
          </motion.h1>
          <motion.p {...up(0.15)} className="mt-6 max-w-xl text-lg text-muted-foreground">
            Compare photographers, venues, florists, caterers and stylists in one place. Send a booking request in minutes and track every reply.
          </motion.p>
          <motion.div {...up(0.3)} className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg"><Link href="/services">Explore Wedding Services <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/sign-up">Join as a vendor</Link></Button>
          </motion.div>
        </div>
        <div className="mx-auto aspect-[480/440] w-full max-w-md md:max-w-none"><HeroArt /></div>
      </div>
    </section>
  );
}

const SectionHead = ({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) => (
  <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
    <div className="max-w-xl"><h2 className="text-4xl font-semibold sm:text-5xl">{title}</h2>{text && <p className="mt-3 text-muted-foreground">{text}</p>}</div>{action}
  </div>
);

export function FeaturedServices() {
  const { data, loading, error, refetch } = useApi<Service[]>("/services/featured?limit=6", { auth: false });
  return (
    <section className="container py-16">
      <SectionHead title="Featured wedding services" text="Approved, available and ready to book. Premium vendors appear first."
        action={<Button asChild variant="outline"><Link href="/services">View all services</Link></Button>} />
      {error ? <ErrorState message={error.message} onRetry={refetch} /> : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}</div>
      ) : !data?.length ? (
        <EmptyState title="No services published yet" text="Approved services will appear here as soon as vendors publish them." />
      ) : (
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((s) => <Item key={s._id}><ServiceCard s={s} /></Item>)}</Stagger>
      )}
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section className="bg-secondary/60 py-16">
      <div className="container">
        <SectionHead title="Start with what you need first" text="Pick a category to see every approved service in it." />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ name, icon: Icon, blurb }) => (
            <Item key={name}>
              <Link href={`/services?category=${encodeURIComponent(name)}`} className="group flex items-center gap-4 rounded-lg border bg-card p-5 transition-colors hover:border-brass">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-6 w-6" /></span>
                <span className="min-w-0"><span className="block font-display text-xl font-semibold leading-tight">{name}</span><span className="text-sm text-muted-foreground">{blurb}</span></span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function WhyChoose() {
  const items = [
    { icon: BadgeCheck, t: "Every listing is reviewed", d: "Admins approve each service before it appears, so you only see vendors that passed a check." },
    { icon: Handshake, t: "One request, one clear answer", d: "Send your date, location and notes. Vendors accept or reject, and you see the status instantly." },
    { icon: ShieldCheck, t: "Your account stays yours", d: "Role-based access and verified payments keep customers, vendors and admins separate." },
    { icon: CreditCard, t: "Vendors grow on their terms", d: "Start free with three active services, then go Premium for unlimited listings and a badge." },
  ];
  return (
    <section className="container grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-4xl font-semibold sm:text-5xl">Why choose WedPlan?</h2>
        <p className="mt-4 max-w-md text-muted-foreground">Wedding planning has enough moving parts. We keep discovery, booking and vendor management in one tidy place.</p>
      </div>
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, t, d }) => (
          <Item key={t}><div className="h-full rounded-lg border bg-card p-6"><Icon className="mb-4 h-7 w-7 text-brass" /><h3 className="text-xl font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div></Item>
        ))}
      </Stagger>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: Search, t: "Browse and compare", d: "Search by name, filter by category and location, and sort by price." },
    { icon: Send, t: "Send a booking request", d: "Share your event date, location and any details the vendor should know." },
    { icon: CalendarCheck, t: "Get a confirmed reply", d: "The vendor accepts or rejects. Track it from your dashboard, or cancel while it’s pending." },
  ];
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container">
        <h2 className="mb-10 text-4xl font-semibold sm:text-5xl">How WedPlan works</h2>
        <Stagger className="grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, t, d }, i) => (
            <Item key={t}>
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-brass font-display text-xl font-semibold text-white">{i + 1}</span><Icon className="h-6 w-6 text-brass" /></div>
              <h3 className="mt-4 text-2xl font-semibold">{t}</h3><p className="mt-2 text-sm text-primary-foreground/75">{d}</p>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="container py-20">
      <div className="rounded-2xl bg-secondary px-6 py-14 text-center sm:px-12">
        <h2 className="text-4xl font-semibold sm:text-5xl">Run a wedding business?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Create a vendor profile, publish up to three services for free, and manage every booking request from one dashboard.</p>
        <Button asChild size="lg" className="mt-7"><Link href="/sign-up">Create a vendor account</Link></Button>
      </div>
    </section>
  );
}

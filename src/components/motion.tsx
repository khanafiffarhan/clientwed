"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Staggered group: children animate once when scrolled into view. */
export function Stagger({ children, className, delay = 0.08 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: delay } } }}>{children}</motion.div>
  );
}
export function Item({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}>{children}</motion.div>;
}

"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Wedding illustration: two interlocking rings, a small gem and olive sprigs. Rings draw in once on load. */
export function HeroArt() {
  const reduce = useReducedMotion();
  const draw = (delay: number) => ({
    initial: reduce ? { pathLength: 1 } : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1.6, delay, ease: "easeInOut" as const },
  });
  const leaf = (x: number, y: number, r: number, k: number) => (
    <motion.ellipse
      key={k}
      cx={x}
      cy={y}
      rx="7"
      ry="16"
      transform={`rotate(${r} ${x} ${y})`}
      fill="hsl(158 27% 30%)"
      opacity="0.85"
      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
      animate={{ opacity: 0.85, scale: 1 }}
      transition={{ delay: 1.2 + k * 0.07, duration: 0.5 }}
    />
  );
  return (
    <svg
      viewBox="0 0 480 440"
      className="h-full w-full"
      role="img"
      aria-label="Two interlocking wedding rings with olive branches"
    >
      <circle cx="240" cy="220" r="200" fill="hsl(12 55% 91%)" opacity="0.7" />
      <circle
        cx="240"
        cy="220"
        r="150"
        fill="none"
        stroke="hsl(38 48% 46%)"
        strokeWidth="1"
        strokeDasharray="2 7"
        opacity="0.7"
      />
      {/* <g fill="none" strokeLinecap="round">
        <motion.circle
          cx="205"
          cy="225"
          r="78"
          stroke="hsl(38 48% 46%)"
          strokeWidth="14"
          {...draw(0.1)}
        />
        <motion.circle
          cx="275"
          cy="225"
          r="78"
          stroke="hsl(158 27% 22%)"
          strokeWidth="14"
          {...draw(0.5)}
        />
        <motion.path
          d="M240 150 A78 78 0 0 1 240 300"
          stroke="hsl(38 48% 46%)"
          strokeWidth="14"
          {...draw(1.1)}
        />
      </g> */}
      <motion.path
        d="M240 112 l14 -22 l14 22 l-14 12 z"
        fill="hsl(40 40% 97%)"
        stroke="hsl(38 48% 46%)"
        strokeWidth="3"
        strokeLinejoin="round"
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      />
      <g>
        <path
          d="M70 380 C100 320 130 290 170 270"
          fill="none"
          stroke="hsl(158 27% 22%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {[
          [95, 350, -40],
          [118, 322, -55],
          [143, 298, -65],
          [112, 352, 30],
          [138, 324, 20],
          [165, 300, 10],
        ].map(([x, y, r], i) => leaf(x, y, r, i))}
        <path
          d="M410 70 C380 120 350 150 310 170"
          fill="none"
          stroke="hsl(158 27% 22%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {[
          [385, 100, 40],
          [362, 128, 55],
          [337, 152, 65],
          [368, 96, -30],
          [346, 124, -20],
          [320, 150, -10],
        ].map(([x, y, r], i) => leaf(x, y, r, i + 6))}
      </g>
    </svg>
  );
}

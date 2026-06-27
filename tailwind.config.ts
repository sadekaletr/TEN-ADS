import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        void: "var(--void)",
        surface: {
          DEFAULT: "var(--surface)",
          0: "var(--surface-0, var(--bg-base))",
          1: "var(--surface-1, var(--bg-surface))",
          2: "var(--surface-2, var(--bg-elevated))",
        },
        gold: {
          accent: "var(--gold-accent)",
          rich: "var(--gold-rich)",
          deep: "var(--gold-deep)",
          1: "var(--gold-1)",
          2: "var(--gold-2)",
          3: "var(--gold-3)",
          4: "var(--gold-4)",
        },
        "warm-white": "var(--warm-white)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-muted)",
        dim: "var(--dim)",
        dimmer: "var(--dimmer)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: "var(--muted)",
        destructive: "#993556",
        success: {
          DEFAULT: "#5dca6e",
          muted: "rgba(93, 202, 110, 0.15)",
        },
        warning: {
          DEFAULT: "#e8b84a",
          muted: "rgba(232, 184, 74, 0.12)",
        },
        danger: {
          DEFAULT: "#e24b4a",
          muted: "rgba(226, 75, 74, 0.12)",
        },
        info: {
          DEFAULT: "#6eb5e8",
          muted: "rgba(110, 181, 232, 0.12)",
        },
      },
      borderColor: {
        subtle: "var(--border-subtle)",
        default: "var(--border-default)",
        strong: "var(--border-strong)",
        spotlight: "var(--border-spotlight)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        brand: ["var(--font-brand)", "sans-serif"],
      },
      spacing: {
        "spark-4": "var(--spark-4)",
        "spark-8": "var(--spark-8)",
        "spark-12": "var(--spark-12)",
        "spark-16": "var(--spark-16)",
        "spark-24": "var(--spark-24)",
        "spark-32": "var(--spark-32)",
        "spark-48": "var(--spark-48)",
        "spark-64": "var(--spark-64)",
        "spark-96": "var(--spark-96)",
      },
      boxShadow: {
        elevated: "var(--shadow-elevated)",
        surface: "var(--shadow-surface)",
        "pricing-featured": "var(--shadow-pricing-featured)",
        "cta-glow": "var(--shadow-cta-glow)",
        card: "var(--card-shadow)",
      },
      backgroundImage: {
        "gradient-void": "var(--gradient-void)",
        "surface-stack": "var(--surface-gradient)",
        "spotlight-hero": "var(--spotlight-hero)",
        "final-cta": "var(--final-cta-bg)",
        "circuit-grid": `
          repeating-linear-gradient(
            0deg,
            var(--grid-line) 0px,
            var(--grid-line) 0.5px,
            transparent 0.5px,
            transparent 48px
          ),
          repeating-linear-gradient(
            90deg,
            var(--grid-line) 0px,
            var(--grid-line) 0.5px,
            transparent 0.5px,
            transparent 48px
          )
        `,
      },
    },
  },
  plugins: [],
};

export default config;

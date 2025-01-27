import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Enhanced dark mode colors
        dark: {
          background: "hsl(222.2 84% 4.9%)",
          foreground: "hsl(210 40% 98%)",
          card: "hsl(222.2 84% 6.9%)",
          "card-foreground": "hsl(210 40% 98%)",
          popover: "hsl(222.2 84% 6.9%)",
          "popover-foreground": "hsl(210 40% 98%)",
          primary: "hsl(217.2 91.2% 59.8%)",
          "primary-foreground": "hsl(222.2 47.4% 11.2%)",
          secondary: "hsl(217.2 32.6% 17.5%)",
          "secondary-foreground": "hsl(210 40% 98%)",
          muted: "hsl(217.2 32.6% 17.5%)",
          "muted-foreground": "hsl(215 20.2% 65.1%)",
          accent: "hsl(217.2 32.6% 17.5%)",
          "accent-foreground": "hsl(210 40% 98%)",
          border: "hsl(217.2 32.6% 17.5%)",
          input: "hsl(217.2 32.6% 17.5%)",
          ring: "hsl(224.3 76.3% 48%)",
          // Progress bar specific colors for dark mode
          progress: {
            background: "hsl(217.2 32.6% 17.5%)",
            foreground: "hsl(213, 94%, 68%)", // Bright blue color for better visibility
          },
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
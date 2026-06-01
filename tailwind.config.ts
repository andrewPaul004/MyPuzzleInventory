import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',   // Required by next-themes
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Brand semantic tokens
        'brand-owned': 'hsl(var(--brand-owned))',
        'brand-wanted': 'hsl(var(--brand-wanted))',
        'brand-neutral': 'hsl(var(--brand-neutral))',
        'brand-destructive': 'hsl(var(--brand-destructive))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // Owned state glow — AC #3
        'brand-owned-glow': 'var(--glow-owned)',
        // shadcn-generated components (e.g. button.tsx) use the Tailwind v4 `shadow-xs`
        // utility, which has no entry in the Tailwind v3 default scale. Register it at
        // config level so the generated baseline resolves without hand-editing it (AC #1).
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        ui: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid modular scale — minimum floor 0.75rem enforced
        'fluid-xs':      'var(--text-xs)',
        'fluid-sm':      'var(--text-sm)',
        'fluid-base':    'var(--text-base)',
        'fluid-lg':      'var(--text-lg)',
        'fluid-xl':      'var(--text-xl)',
        'fluid-2xl':     'var(--text-2xl)',
        'fluid-3xl':     'var(--text-3xl)',
        'fluid-display': 'var(--text-display)',
      },
    },
  },
  plugins: [],
}

export default config

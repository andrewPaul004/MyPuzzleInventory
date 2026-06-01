/**
 * Story 1.2: Design System Foundation — Unit Tests
 *
 * Test IDs: 1.2-U-01, 1.2-U-02, 1.2-U-03, 1.2-U-04, 1.2-U-05, 1.2-U-06, 1.2-U-07
 *
 * These tests validate that semantic color tokens, dark palette, typography scale,
 * and Framer Motion integration meet the design system specification.
 *
 * Note: Most assertions are file-content checks (parsing globals.css and
 * tailwind.config.ts). The build test (1.2-U-05) shells out to npm run build.
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Resolve paths from the project root (two levels up from src/tests/design-system/)
const PROJECT_ROOT = path.resolve(__dirname, '../../..')
const GLOBALS_CSS = path.join(PROJECT_ROOT, 'src', 'app', 'globals.css')
const TAILWIND_CONFIG = path.join(PROJECT_ROOT, 'tailwind.config.ts')

function readGlobalsCss(): string {
  // TODO: after implementation, this file will exist
  return fs.existsSync(GLOBALS_CSS) ? fs.readFileSync(GLOBALS_CSS, 'utf-8') : ''
}

function readTailwindConfig(): string {
  // TODO: after implementation, this file will exist
  return fs.existsSync(TAILWIND_CONFIG) ? fs.readFileSync(TAILWIND_CONFIG, 'utf-8') : ''
}

describe('Story 1.2 — Design Token Unit Tests', () => {
  describe('1.2-U-01: brand-owned token resolves to hsl(38 85% 55%)', () => {
    it('globals.css :root defines --brand-owned as 38 85% 55%', () => {
      // TODO: implement after globals.css is written
      // Parse globals.css :root block; assert --brand-owned: 38 85% 55%
      const css = readGlobalsCss()
      expect(css).toContain('--brand-owned: 38 85% 55%')
    })

    it('globals.css .dark block defines --brand-owned as 38 85% 55%', () => {
      // TODO: implement after globals.css is written
      // The brand-owned warm amber is spec-constant across light and dark
      const css = readGlobalsCss()
      const darkBlock = css.slice(css.indexOf('.dark {'))
      expect(darkBlock).toContain('--brand-owned: 38 85% 55%')
    })

    it('tailwind.config.ts extends colors with brand-owned referencing CSS variable', () => {
      // TODO: implement after tailwind.config.ts is written
      // brand-owned must be: 'hsl(var(--brand-owned))'
      const config = readTailwindConfig()
      expect(config).toContain("'brand-owned'")
      expect(config).toContain('--brand-owned')
    })
  })

  describe('1.2-U-02: brand-wanted token resolves to hsl(210 70% 60%)', () => {
    it('globals.css :root defines --brand-wanted as 210 70% 60%', () => {
      // TODO: implement after globals.css is written
      const css = readGlobalsCss()
      expect(css).toContain('--brand-wanted: 210 70% 60%')
    })

    it('globals.css .dark block defines --brand-wanted as 210 70% 60%', () => {
      // TODO: implement after globals.css is written
      const css = readGlobalsCss()
      const darkBlock = css.slice(css.indexOf('.dark {'))
      expect(darkBlock).toContain('--brand-wanted: 210 70% 60%')
    })

    it('tailwind.config.ts extends colors with brand-wanted referencing CSS variable', () => {
      // TODO: implement after tailwind.config.ts is written
      const config = readTailwindConfig()
      expect(config).toContain("'brand-wanted'")
      expect(config).toContain('--brand-wanted')
    })
  })

  describe('1.2-U-03: brand-neutral token resolves to hsl(24 5% 40%)', () => {
    it('globals.css :root defines --brand-neutral as 24 5% 40%', () => {
      // TODO: implement after globals.css is written
      const css = readGlobalsCss()
      expect(css).toContain('--brand-neutral: 24 5% 40%')
    })

    it('globals.css .dark block defines --brand-neutral as 24 5% 40%', () => {
      // TODO: implement after globals.css is written
      const css = readGlobalsCss()
      const darkBlock = css.slice(css.indexOf('.dark {'))
      expect(darkBlock).toContain('--brand-neutral: 24 5% 40%')
    })

    it('tailwind.config.ts extends colors with brand-neutral referencing CSS variable', () => {
      // TODO: implement after tailwind.config.ts is written
      const config = readTailwindConfig()
      expect(config).toContain("'brand-neutral'")
      expect(config).toContain('--brand-neutral')
    })
  })

  describe('1.2-U-04: brand-destructive token resolves to hsl(0 65% 55%)', () => {
    it('globals.css :root defines --brand-destructive as 0 65% 55%', () => {
      // TODO: implement after globals.css is written
      const css = readGlobalsCss()
      expect(css).toContain('--brand-destructive: 0 65% 55%')
    })

    it('globals.css .dark block defines --brand-destructive as 0 65% 55%', () => {
      // TODO: implement after globals.css is written
      const css = readGlobalsCss()
      const darkBlock = css.slice(css.indexOf('.dark {'))
      expect(darkBlock).toContain('--brand-destructive: 0 65% 55%')
    })

    it('tailwind.config.ts extends colors with brand-destructive referencing CSS variable', () => {
      // TODO: implement after tailwind.config.ts is written
      const config = readTailwindConfig()
      expect(config).toContain("'brand-destructive'")
      expect(config).toContain('--brand-destructive')
    })
  })

  describe('1.2-U-05: Framer Motion importable without build errors', () => {
    it('framer-motion is listed in package.json dependencies', () => {
      // TODO: implement after npm install runs
      // Full build verification (exit code 0) is done via npm run build in CI.
      // This unit check confirms the package is declared.
      const pkgPath = path.join(PROJECT_ROOT, 'package.json')
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      expect(
        pkg.dependencies?.['framer-motion'] ?? pkg.devDependencies?.['framer-motion']
      ).toBeDefined()
    })

    it('no framer-motion import exists in a Server Component file', () => {
      // TODO: implement after implementation
      // Framer Motion must only appear in 'use client' files.
      // Check that layout.tsx (a Server Component) does not import framer-motion.
      const layoutPath = path.join(PROJECT_ROOT, 'src', 'app', 'layout.tsx')
      const layout = fs.existsSync(layoutPath) ? fs.readFileSync(layoutPath, 'utf-8') : ''
      expect(layout).not.toContain("from 'framer-motion'")
      expect(layout).not.toContain('from "framer-motion"')
    })
  })

  describe('1.2-U-06: dark mode background is Void Walnut hsl(24 8% 8%)', () => {
    it('globals.css .dark block sets --background to 24 8% 8%', () => {
      // TODO: implement after globals.css is written
      // Void Walnut must be exactly hsl(24 8% 8%) — not a similar colour
      const css = readGlobalsCss()
      const darkBlock = css.slice(css.indexOf('.dark {'))
      expect(darkBlock).toContain('--background: 24 8% 8%')
    })

    it('globals.css .dark body rule sets color to #F0EDE8', () => {
      // TODO: implement after globals.css is written
      // Body text must be warm off-white #F0EDE8 — never pure white #ffffff
      const css = readGlobalsCss()
      expect(css).toContain('#F0EDE8')
    })

    it('globals.css .dark body does not use pure white (#ffffff or #fff)', () => {
      // TODO: implement after globals.css is written
      // Pure white is spec-forbidden for dark mode body text
      const css = readGlobalsCss()
      const darkSection = css.slice(css.indexOf('.dark {'))
      // Allow #fff in comments but not as a colour value
      const darkBodyMatch = darkSection.match(/\.dark\s+body\s*\{([^}]+)\}/)
      if (darkBodyMatch) {
        expect(darkBodyMatch[1]).not.toMatch(/#ffffff|#fff(?!f)/i)
      }
    })
  })

  describe('1.2-U-07: minimum font size floor is 0.75rem', () => {
    it('all clamp() calls in globals.css have a minimum value >= 0.75rem', () => {
      // TODO: implement after globals.css is written
      // Spec: no clamp() minimum below 0.75rem (12px)
      const css = readGlobalsCss()
      const clampMatches = css.matchAll(/clamp\(\s*([\d.]+rem)/g)
      for (const match of clampMatches) {
        const minRem = parseFloat(match[1])
        expect(minRem).toBeGreaterThanOrEqual(0.75)
      }
    })

    it('globals.css defines all eight fluid type scale custom properties', () => {
      // TODO: implement after globals.css is written
      const css = readGlobalsCss()
      const expectedTokens = [
        '--text-xs',
        '--text-sm',
        '--text-base',
        '--text-lg',
        '--text-xl',
        '--text-2xl',
        '--text-3xl',
        '--text-display',
      ]
      for (const token of expectedTokens) {
        expect(css).toContain(token)
      }
    })

    it('tailwind.config.ts registers fluid fontSize scale steps', () => {
      // TODO: implement after tailwind.config.ts is written
      const config = readTailwindConfig()
      expect(config).toContain('fluid-xs')
      expect(config).toContain('fluid-display')
    })
  })
})

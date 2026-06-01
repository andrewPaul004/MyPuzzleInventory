/**
 * Story 1.2: Design System Foundation — Component Tests
 *
 * Test IDs: 1.2-C-01, 1.2-C-02, 1.2-C-03
 *
 * These tests validate the layout structure, font wiring, and the shadcn/ui
 * baseline integrity requirement (components/ui/ must not be hand-edited).
 *
 * Note: Component render tests (1.2-C-01, 1.2-C-02) are static/structural —
 * they inspect source files rather than mounting in jsdom because layout.tsx
 * is a Next.js Server Component and cannot be rendered in a unit test env.
 * Actual dark-mode FOUC prevention is verified manually in-browser.
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const PROJECT_ROOT = path.resolve(__dirname, '../../..')
const LAYOUT_PATH = path.join(PROJECT_ROOT, 'src', 'app', 'layout.tsx')
const COMPONENTS_UI_DIR = path.join(PROJECT_ROOT, 'src', 'components', 'ui')

function readLayout(): string {
  return fs.existsSync(LAYOUT_PATH) ? fs.readFileSync(LAYOUT_PATH, 'utf-8') : ''
}

describe('Story 1.2 — Design System Component Tests', () => {
  describe('1.2-C-01: dark mode does not FOUC', () => {
    it('<html> element has suppressHydrationWarning in layout.tsx', () => {
      // TODO: implement after layout.tsx is updated
      // next-themes injects class="dark" on <html> at runtime; suppressHydrationWarning
      // prevents React from logging a hydration mismatch warning for this attribute.
      const layout = readLayout()
      expect(layout).toContain('suppressHydrationWarning')
    })

    it('ThemeProvider is imported from next-themes in layout.tsx', () => {
      // TODO: implement after layout.tsx is updated
      // The ThemeProvider must come from 'next-themes', not a custom wrapper
      const layout = readLayout()
      expect(layout).toMatch(/from ['"]next-themes['"]/)
      expect(layout).toContain('ThemeProvider')
    })

    it('ThemeProvider has attribute="class" in layout.tsx', () => {
      // TODO: implement after layout.tsx is updated
      // next-themes class strategy is required for Tailwind dark: utilities to work
      const layout = readLayout()
      expect(layout).toContain('attribute="class"')
    })

    it('ThemeProvider has defaultTheme="dark" in layout.tsx', () => {
      // TODO: implement after layout.tsx is updated
      // Dark mode is the primary visual target per spec — not system default
      const layout = readLayout()
      expect(layout).toContain('defaultTheme="dark"')
    })

    it('tailwind.config.ts sets darkMode: class', () => {
      // TODO: implement after tailwind.config.ts is updated
      // Without darkMode: 'class', Tailwind dark: utilities do not respond to
      // the class next-themes toggles on <html>
      const configPath = path.join(PROJECT_ROOT, 'tailwind.config.ts')
      const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : ''
      expect(config).toMatch(/darkMode\s*:\s*['"]class['"]/)
    })
  })

  describe('1.2-C-02: Fraunces font applied to heading elements', () => {
    it('Fraunces is imported from next/font/google in layout.tsx', () => {
      // TODO: implement after layout.tsx is updated
      const layout = readLayout()
      expect(layout).toMatch(/import.*Fraunces.*from ['"]next\/font\/google['"]/)
    })

    it('Fraunces is configured with variable: --font-fraunces', () => {
      // TODO: implement after layout.tsx is updated
      const layout = readLayout()
      expect(layout).toContain('--font-fraunces')
    })

    it('Fraunces axes include opsz, WONK, SOFT in next/font/google config', () => {
      // next/font/google does not accept 'wght' as a named axis for variable fonts —
      // weight variation is handled via font-variation-settings in globals.css (.font-display).
      // The registered axes are: 'opsz' (optical size), 'WONK' (wonky), 'SOFT' (softness).
      const layout = readLayout()
      expect(layout).toContain('opsz')
      expect(layout).toContain('WONK')
      expect(layout).toContain('SOFT')
    })

    it('globals.css .font-display applies wght via font-variation-settings', () => {
      // wght is applied through CSS font-variation-settings, not the next/font/google axes array
      const cssPath = path.join(PROJECT_ROOT, 'src', 'app', 'globals.css')
      const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : ''
      expect(css).toContain("font-variation-settings")
      expect(css).toContain("'wght'")
    })

    it('Inter is imported from next/font/google in layout.tsx', () => {
      // TODO: implement after layout.tsx is updated
      const layout = readLayout()
      expect(layout).toMatch(/import.*Inter.*from ['"]next\/font\/google['"]/)
    })

    it('Inter is configured with variable: --font-inter', () => {
      // TODO: implement after layout.tsx is updated
      const layout = readLayout()
      expect(layout).toContain('--font-inter')
    })

    it('both font CSS variables are applied to <html> className', () => {
      // TODO: implement after layout.tsx is updated
      // Font variables must be on <html> to cascade to the full document
      const layout = readLayout()
      expect(layout).toContain('fraunces.variable')
      expect(layout).toContain('inter.variable')
    })

    it('tailwind.config.ts fontFamily.display references --font-fraunces', () => {
      // TODO: implement after tailwind.config.ts is updated
      const configPath = path.join(PROJECT_ROOT, 'tailwind.config.ts')
      const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : ''
      expect(config).toContain('--font-fraunces')
      expect(config).toContain('--font-inter')
    })

    it('NuqsAdapter is still present in layout.tsx (not removed by this story)', () => {
      // TODO: implement after layout.tsx is updated
      // NuqsAdapter was established in Story 1.1 and must coexist with ThemeProvider
      const layout = readLayout()
      expect(layout).toContain('NuqsAdapter')
    })
  })

  describe('1.2-C-03: components/ui/ files not hand-edited after init', () => {
    it('src/components/ui/ directory exists after shadcn init', () => {
      // TODO: implement after npx shadcn@latest init runs
      // If the directory is missing, shadcn was not initialized
      expect(fs.existsSync(COMPONENTS_UI_DIR)).toBe(true)
    })

    it('components.json exists at project root (shadcn config file)', () => {
      // TODO: implement after npx shadcn@latest init runs
      const componentsJson = path.join(PROJECT_ROOT, 'components.json')
      expect(fs.existsSync(componentsJson)).toBe(true)
    })

    it('git shows no unstaged modifications to src/components/ui/ files', () => {
      // The baseline commit must happen BEFORE any edits; this test asserts
      // that generated files remain unmodified after the baseline commit.
      const output = execSync(
        'git diff --name-only HEAD -- src/components/ui/',
        { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
      )
      // No modified files in components/ui/ means the output is empty
      expect(output.trim()).toBe('')
    })

    it('next-themes is listed in package.json dependencies', () => {
      // TODO: implement after npm install runs
      const pkgPath = path.join(PROJECT_ROOT, 'package.json')
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      expect(
        pkg.dependencies?.['next-themes'] ?? pkg.devDependencies?.['next-themes']
      ).toBeDefined()
    })
  })
})

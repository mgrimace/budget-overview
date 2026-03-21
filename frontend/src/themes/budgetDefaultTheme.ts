import type { ThemeDefinition } from './types'

export const budgetDefaultTheme: ThemeDefinition = {
  id: 'default',
  name: 'Default',
  palettes: {
    light: {
      canvas:       '#f8fafc',
      surface:      '#ffffff',
      textInverse:  '#ffffff',
      text:         '#1e293b',
      textMuted:    '#475569',
      border:       '#e2e8f0',
      accent:       '#1d4ed8',
      accentHover:  '#1e40af',
      accentSubtle: '#eff6ff',
      positive:     '#15803d',
      negative:     '#b91c1c',
    },
    dark: {
      canvas:       '#0f172a',
      surface:      '#1e293b',
      textInverse:  '#ffffff',
      text:         '#f1f5f9',
      textMuted:    '#94a3b8',
      border:       '#334155',
      accent:       '#60a5fa',
      accentHover:  '#3b82f6',
      accentSubtle: '#1e3a5f',
      positive:     '#4ade80',
      negative:     '#f87171',
    },
  },
}

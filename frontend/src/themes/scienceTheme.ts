import type { ThemeDefinition } from './types'

export const scienceTheme: ThemeDefinition = {
  id: 'science',
  name: 'Science',
  palettes: {
    light: {
      canvas:       '#f1f8fd',
      surface:      '#e6f1fc',
      textInverse:  '#ffffff',
      text:         '#2a3a46',
      textMuted:    '#5c6b76',
      border:       '#d6dde3',
      accent:       '#3a8ed0',
      accentHover:  '#1f5e91',
      accentSubtle: '#ddeef9',
      positive:     '#2f5a44',
      negative:     '#8c4b2a',
    },
    dark: {
      canvas:       '#0f1720',
      surface:      '#1b2a36',
      textInverse:  '#0f1720',
      text:         '#d4dde4',
      textMuted:    '#9fb0bd',
      border:       '#2b3944',
      accent:       '#4fa3e0',
      accentHover:  '#3a8ed0',
      accentSubtle: '#1c3347',
      positive:     '#a7d0bb',
      negative:     '#d07b57',
    },
  },
}

import type { ThemeDefinition } from './types'

export const scienceTheme: ThemeDefinition = {
  id: 'science',
  name: 'Science',
  palettes: {
    light: {
      canvas:       '#edf4f8',
      surface:      '#fbfdff',
      textInverse:  '#edf4f8',
      text:         '#2c3942',
      textMuted:    '#5d6b74',
      border:       '#d1dbe2',
      accent:       '#4b8fba',
      accentHover:  '#1f5e91',
      accentSubtle: '#ddeef9',
      positive:     '#3f8b73',
      negative:     '#b86a68',
    },
    dark: {
      canvas:       '#0f151b',
      surface:      '#18222b',
      textInverse:  '#0f151b',
      text:         '#d6dfe5',
      textMuted:    '#94a5b1',
      border:       '#2b3943',
      accent:       '#5a9dc6',
      accentHover:  '#78b5db',
      accentSubtle: '#1c3347',
      positive:     '#79c3ab',
      negative:     '#b66b69',
    },
  },
}

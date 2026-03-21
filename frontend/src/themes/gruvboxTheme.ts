import type { ThemeDefinition } from './types'

export const gruvboxTheme: ThemeDefinition = {
  id: 'gruvbox',
  name: 'Gruvbox',
  palettes: {
    light: {
      canvas:       '#fbf1c7',
      surface:      '#f2e5bc',
      textInverse:  '#fbf1c7',
      text:         '#3c3836',
      textMuted:    '#665c54',
      border:       '#bdae93',
      accent:       '#458588',
      accentHover:  '#367374',
      accentSubtle: '#d5e8e8',
      positive:     '#98971a',
      negative:     '#cc241d',
    },
    dark: {
      canvas:       '#282828',
      surface:      '#3c3836',
      textInverse:  '#282828',
      text:         '#ebdbb2',
      textMuted:    '#bdae93',
      border:       '#504945',
      accent:       '#83a598',
      accentHover:  '#6d9186',
      accentSubtle: '#2d3f3e',
      positive:     '#b8bb26',
      negative:     '#fb4934',
    },
  },
}

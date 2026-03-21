import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme()

  return (
    <button
      className="btn-icon theme-toggle"
      onClick={toggleMode}
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? <SunIcon size={22} /> : <MoonIcon size={22} />}
    </button>
  )
}

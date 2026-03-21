import React, { useEffect, useRef, useState } from 'react'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { useTheme } from '../context/ThemeContext'
import type { ThemeDefinition } from '../themes/types'

function ThemePreview({ theme, mode }: { theme: ThemeDefinition; mode: 'light' | 'dark' }) {
  const palette = theme.palettes[mode]

  return (
    <span
      className="theme-preview"
      aria-hidden="true"
      style={{
        '--preview-border': palette.border,
        '--preview-surface': palette.surface,
        '--preview-accent': palette.accent,
      } as React.CSSProperties}
    >
      <span className="theme-preview-box">
        <span className="theme-preview-dot" />
      </span>
    </span>
  )
}

export default function ThemeSelector() {
  const { themes, selectedTheme, setThemeId, mode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const idx = themes.findIndex(t => t.id === selectedTheme.id)
    setActiveIndex(idx === -1 ? 0 : idx)
  }, [themes, selectedTheme.id])

  useEffect(() => {
    if (!isOpen) return
    optionRefs.current[activeIndex]?.focus()
  }, [isOpen, activeIndex])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); triggerRef.current?.focus() }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        className="theme-selector-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(prev => {
            if (!prev) {
              const idx = themes.findIndex(t => t.id === selectedTheme.id)
              setActiveIndex(idx === -1 ? 0 : idx)
            }
            return !prev
          })
        }}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            const idx = themes.findIndex(t => t.id === selectedTheme.id)
            setActiveIndex(idx === -1 ? 0 : idx)
            setIsOpen(true)
          }
        }}
      >
        <ThemePreview theme={selectedTheme} mode={mode} />
        <span className="theme-selector-label">{selectedTheme.name}</span>
        <CaretDownIcon className="theme-selector-caret" weight="bold" aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="theme-selector-menu" role="listbox" aria-label="Choose theme">
          {themes.map((theme, index) => {
            const isSelected = theme.id === selectedTheme.id
            return (
              <li key={theme.id} role="option" aria-selected={isSelected}>
                <button
                  ref={el => { optionRefs.current[index] = el }}
                  type="button"
                  className={`theme-selector-option ${isSelected ? 'is-active' : ''}`}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => { setThemeId(theme.id); setIsOpen(false); triggerRef.current?.focus() }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(p => (p + 1) % themes.length) }
                    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(p => (p - 1 + themes.length) % themes.length) }
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setThemeId(theme.id); setIsOpen(false); triggerRef.current?.focus() }
                    if (e.key === 'Escape') { e.preventDefault(); setIsOpen(false); triggerRef.current?.focus() }
                  }}
                >
                  <span className="theme-selector-option-main">
                    <ThemePreview theme={theme} mode={mode} />
                    <span className="theme-selector-option-name">{theme.name}</span>
                  </span>
                  {isSelected && <CheckIcon className="theme-selector-option-check" weight="bold" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
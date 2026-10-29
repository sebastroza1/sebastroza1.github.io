import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App, { ProjectExplorer } from './App'

describe('portfolio interactions', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/'
  })

  afterEach(() => {
    window.location.hash = '#/'
  })

  it('switches the complete primary interface to Spanish and persists the preference', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar a español' }))
    expect(screen.getByRole('heading', { name: /Construyendo software confiable/i })).toBeInTheDocument()
    expect(screen.getByText('Experiencia profesional')).toBeInTheDocument()
    expect(localStorage.getItem('portfolio-language')).toBe('es')
  })

  it('toggles the accessible color theme', () => {
    render(<App />)
    const themeButton = screen.getByRole('button', { name: 'Use dark theme' })
    fireEvent.click(themeButton)
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('portfolio-theme')).toBe('dark')
  })

  it('combines search and language filters without duplicating projects', () => {
    render(<ProjectExplorer language="en" />)
    fireEvent.change(screen.getByLabelText('Search projects'), { target: { value: 'integrity' } })
    expect(screen.getByRole('heading', { name: 'C++ File Integrity Toolkit' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Scientific Anomaly Detection' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'C++20' } })
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(within(cards[0]).getByRole('heading', { name: 'C++ File Integrity Toolkit' })).toBeInTheDocument()
  })

  it('does not expose broken resume download links when PDFs are absent', () => {
    window.location.hash = '#/resume'
    render(<App />)
    expect(screen.getAllByText('File not yet provided')).toHaveLength(4)
    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument()
  })
})

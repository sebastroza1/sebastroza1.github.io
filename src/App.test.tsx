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
    expect(screen.getByRole('heading', { name: /Construyo sistemas confiables/i })).toBeInTheDocument()
    expect(screen.getByText('Experiencia profesional')).toBeInTheDocument()
    expect(screen.getByText('Septiembre 2026 — actualidad')).toBeInTheDocument()
    expect(localStorage.getItem('portfolio-language')).toBe('es')
  })

  it('uses the corrected Spanish UCEN augmented-reality project name', () => {
    render(<ProjectExplorer language="es" />)
    fireEvent.change(screen.getByLabelText('Buscar proyectos'), { target: { value: 'realidad aumentada' } })
    expect(screen.getByRole('heading', { name: 'Realidad Aumentada UCEN' })).toBeInTheDocument()
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

  it('publishes only validated English and Spanish PDF resumes', () => {
    window.location.hash = '#/resume'
    render(<App />)
    const pdfLinks = screen.getAllByRole('link', { name: 'Download PDF' })
    expect(pdfLinks).toHaveLength(2)
    expect(pdfLinks[0]).toHaveAttribute('href', '/cv/Sebastian_Astroza_Software_Engineer_General_2026.pdf')
    expect(screen.queryByRole('link', { name: 'Editable DOCX' })).not.toBeInTheDocument()
  })

  it('shows the professional portrait and exact contact destinations', () => {
    render(<App />)
    expect(screen.getByRole('img', { name: 'Portrait of Sebastián Astroza wearing a blue shirt' })).toHaveAttribute('src', '/assets/sebastian-astroza-portrait-v2.webp')
    expect(screen.getByRole('link', { name: /sebastroza10@gmail.com/i })).toHaveAttribute('href', 'mailto:sebastroza10@gmail.com')
    expect(screen.getByRole('link', { name: /LinkedIn — Sebastián Astroza/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/sebastian-a-677745276/')
  })

  it('presents the bounded AutismoConecta performance case study', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Before / after performance evidence' })).toBeInTheDocument()
    expect(screen.getByText('Regression, although 0.062 remains below 0.1.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Inspect performance lab/i })).toHaveAttribute('href', '#/projects/web-performance-evidence')
  })

  it('includes both new engineering labs without duplicating them', () => {
    render(<ProjectExplorer language="en" />)
    fireEvent.change(screen.getByLabelText('Search projects'), { target: { value: 'collaboration ops' } })
    expect(screen.getAllByRole('heading', { name: 'Collaboration Ops Lab' })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    fireEvent.change(screen.getByLabelText('Search projects'), { target: { value: 'performance evidence' } })
    expect(screen.getAllByRole('heading', { name: 'Web Performance Evidence Lab' })).toHaveLength(1)
  })

  it('presents the portfolio delivery workflow as a documented project', () => {
    render(<ProjectExplorer language="en" />)
    fireEvent.change(screen.getByLabelText('Search projects'), { target: { value: 'portfolio delivery' } })
    expect(screen.getByRole('heading', { name: 'Engineering Portfolio Delivery' })).toBeInTheDocument()
    expect(screen.getByText(/branch, pull-request, CI and GitHub Pages workflow/i)).toBeInTheDocument()
  })
})

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  AlertTriangle, ArrowLeft, ArrowRight, ArrowUp, Bot, Braces, Check, CheckCircle2, ChevronRight, CircleDot, Copy,
  Database, Download, ExternalLink, Github, Globe2, Languages,
  Gauge, Linkedin, Mail, Menu, Moon, Network, Search, Server, ShieldCheck, Sun, TestTube2, X,
} from 'lucide-react'
import { allLanguages, allTechnologies, categoryLabels, projects, type Category, type Language, type Project } from './data/projects'

type Theme = 'light' | 'dark'
type TransitionDocument = Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } }

const copy = {
  en: {
    nav: { home: 'Home', projects: 'Projects', experience: 'Experience', skills: 'Skills', resume: 'Resume', contact: 'Contact' },
    heroKicker: 'Sebastián Andrés Astroza Aguayo', heroRole: 'Software Engineer · Santiago, Chile',
    heroTitleA: 'I build reliable systems—', heroTitleB: 'then prove they work.',
    heroBody: 'Full-stack, Linux, data and applied-AI engineering backed by inspectable code, tests and explicit evidence boundaries.',
    viewProjects: 'View projects', resume: 'Resume', availability: 'Santiago, Chile · Open to international opportunities and relocation',
    proofTitle: 'Engineering evidence, not decorative claims.',
    proofBody: 'Every public project is tied to source code, tests, documented results and explicit limitations. Synthetic data and unverified runtime paths remain labelled as such.',
    aboutTitle: 'A software engineer shaped by systems thinking.',
    aboutBody: 'I completed the academic requirements for Civil Engineering in Computing and Informatics at Universidad Central de Chile in 2026. Formal degree conferral is pending institutional confirmation. My work spans production software, Linux infrastructure, backend and frontend development, databases, automation, machine learning and computer vision.',
    featured: 'Selected engineering work', featuredBody: 'Projects chosen for technical depth, reproducibility and honest evidence boundaries.',
    experience: 'Professional experience', education: 'Education & research', skills: 'Engineering skills',
    caseStudy: 'AutismoConecta · publishable case study',
    caseStudyBody: 'A deliberately bounded account of owner-provided professional work and reproducible local performance evidence. Private code, infrastructure and user data remain excluded.',
    allProjects: 'Explore all projects', filters: 'Filter the evidence', search: 'Search projects', category: 'Area', language: 'Language', tech: 'Technology', kind: 'Type', status: 'Status', all: 'All', clear: 'Clear filters', noResults: 'No projects match these filters.',
    results: 'Verified result', limitations: 'Limitations', evidence: 'Evidence', details: 'View case study', repository: 'GitHub repository', docs: 'Evidence document',
    overview: 'Overview', problem: 'Problem', contribution: 'My contribution', architecture: 'Architecture', implementation: 'Implementation', challenges: 'Engineering challenges', testing: 'Testing', learned: 'What I learned', back: 'Back to projects',
    resumeTitle: 'General software engineering resume', resumeBody: 'Recruiter-ready, ATS-oriented PDF resumes with selectable text, visible links and professional metadata. Choose the English or Spanish edition.',
    contactTitle: 'Let’s build useful, reliable systems.', contactBody: 'Open to software engineering, full-stack, infrastructure, data, automation, applied AI and research-engineering opportunities in Chile or internationally.',
    academicPending: 'Academic requirements completed in 2026 · degree conferral pending',
  },
  es: {
    nav: { home: 'Inicio', projects: 'Proyectos', experience: 'Experiencia', skills: 'Competencias', resume: 'CV', contact: 'Contacto' },
    heroKicker: 'Sebastián Andrés Astroza Aguayo', heroRole: 'Ingeniero de Software · Santiago, Chile',
    heroTitleA: 'Construyo sistemas confiables', heroTitleB: 'y demuestro que funcionan.',
    heroBody: 'Ingeniería full-stack, Linux, datos e IA aplicada respaldada por código inspeccionable, pruebas y límites explícitos de evidencia.',
    viewProjects: 'Ver proyectos', resume: 'Currículum', availability: 'Santiago, Chile · Disponible para oportunidades internacionales y reubicación',
    proofTitle: 'Evidencia de ingeniería, no afirmaciones decorativas.',
    proofBody: 'Cada proyecto público se vincula con código, pruebas, resultados documentados y limitaciones explícitas. Los datos sintéticos y rutas no verificadas permanecen identificados.',
    aboutTitle: 'Un ingeniero de software formado por pensamiento de sistemas.',
    aboutBody: 'Completé los requisitos académicos de Ingeniería Civil en Computación e Informática en la Universidad Central de Chile durante 2026. El otorgamiento formal del grado está pendiente de confirmación institucional. Mi trabajo abarca software de producción, infraestructura Linux, backend y frontend, bases de datos, automatización, machine learning y visión computacional.',
    featured: 'Trabajo de ingeniería seleccionado', featuredBody: 'Proyectos elegidos por profundidad técnica, reproducibilidad y límites honestos de evidencia.',
    experience: 'Experiencia profesional', education: 'Educación e investigación', skills: 'Competencias de ingeniería',
    caseStudy: 'AutismoConecta · caso de estudio publicable',
    caseStudyBody: 'Presentación deliberadamente acotada de trabajo profesional informado por el propietario y evidencia local reproducible de rendimiento. Código privado, infraestructura y datos de usuarios permanecen excluidos.',
    allProjects: 'Explorar todos los proyectos', filters: 'Filtrar la evidencia', search: 'Buscar proyectos', category: 'Área', language: 'Lenguaje', tech: 'Tecnología', kind: 'Tipo', status: 'Estado', all: 'Todos', clear: 'Limpiar filtros', noResults: 'Ningún proyecto coincide con estos filtros.',
    results: 'Resultado verificado', limitations: 'Limitaciones', evidence: 'Evidencia', details: 'Ver caso de estudio', repository: 'Repositorio GitHub', docs: 'Documento de evidencia',
    overview: 'Resumen', problem: 'Problema', contribution: 'Mi contribución', architecture: 'Arquitectura', implementation: 'Implementación', challenges: 'Desafíos de ingeniería', testing: 'Pruebas', learned: 'Qué aprendí', back: 'Volver a proyectos',
    resumeTitle: 'Currículum general de ingeniería de software', resumeBody: 'CV en PDF listos para reclutamiento y orientados a ATS, con texto seleccionable, enlaces visibles y metadatos profesionales. Elige la edición en español o inglés.',
    contactTitle: 'Construyamos sistemas útiles y confiables.', contactBody: 'Disponible para oportunidades en ingeniería de software, full-stack, infraestructura, datos, automatización, IA aplicada e ingeniería de investigación en Chile o el extranjero.',
    academicPending: 'Requisitos académicos completados en 2026 · otorgamiento de grado pendiente',
  },
} as const

const experience = [
  {
    company: 'AutismoConecta', period: { en: 'September 2026 — present', es: 'Septiembre 2026 — actualidad' },
    role: 'Software Engineer / Cross-functional IT',
    description: {
      en: 'Early-stage Chilean social-impact technology startup connecting neurodivergent people and families with professionals, services and support resources.',
      es: 'Startup tecnológica chilena de impacto social que conecta personas neurodivergentes y familias con profesionales, servicios y recursos de apoyo.',
    },
    details: {
      en: 'Owner-reported scope spans full-stack development, Linux infrastructure, databases, automation, security, external integrations, administrative systems, QA, deployment validation and incident diagnosis.',
      es: 'El alcance informado por el propietario abarca desarrollo full-stack, infraestructura Linux, bases de datos, automatización, seguridad, integraciones externas, sistemas administrativos, QA, validación de despliegues y diagnóstico de incidencias.',
    },
    result: { en: 'Public evidence is intentionally limited to high-level context and an owner-provided local p75 performance case study; commit-level authorship remains pending verification.', es: 'La evidencia pública se limita intencionalmente al contexto de alto nivel y un caso p75 local proporcionado por el propietario; la autoría por commit sigue pendiente de verificación.' },
  },
  {
    company: 'TRC Recruitme', period: { en: 'August 2025 — March 2026', es: 'Agosto 2025 — marzo 2026' },
    role: 'QA, Automation & Data Integrations',
    description: {
      en: 'Technical, professional and university placement periods followed by continuity under contract in technology-enabled recruitment workflows; individual placement dates are not claimed.',
      es: 'Prácticas técnica, profesional y universitaria seguidas por continuidad bajo contrato en flujos tecnológicos de reclutamiento; no se afirman fechas individuales de cada práctica.',
    },
    details: {
      en: 'Data extraction and transformation, Dropbox CV migration, import templates, n8n, webhooks, chatbots, Selenium, Postman, Scrum and documentation.',
      es: 'Extracción y transformación, migración de CV desde Dropbox, templates, n8n, webhooks, chatbots, Selenium, Postman, Scrum y documentación.',
    },
    result: { en: 'Owner-reported outcome: a task estimated at one month was completed in approximately one week.', es: 'Resultado informado por el propietario: una tarea estimada en un mes fue completada en aproximadamente una semana.' },
  },
]

const performanceMetrics = [
  { key: 'DOMContentLoaded', before: 3.77, after: 2.16, unit: 's', change: 42.7 },
  { key: 'Load', before: 4.27, after: 3.38, unit: 's', change: 20.8 },
  { key: 'FCP', before: 4.04, after: 2.41, unit: 's', change: 40.3 },
  { key: 'LCP', before: 4.04, after: 3.46, unit: 's', change: 14.4, warning: true },
  { key: 'CLS', before: 0.002, after: 0.062, unit: '', change: -3000, regression: true },
  { key: 'Initial bundle', before: 773.83, after: 507.85, unit: 'kB', change: 34.4 },
]

const skills = [
  { icon: Braces, title: { en: 'Full-Stack Engineering', es: 'Ingeniería full-stack' }, scope: { en: 'Professional + independent evidence', es: 'Evidencia profesional + independiente' }, items: ['TypeScript', 'Angular', 'React', 'Next.js', 'Vue 3', 'PHP', 'Laravel', 'Flutter'], links: ['engineering-portfolio-delivery', 'landfinder-chile'] },
  { icon: Network, title: { en: 'Backend & APIs', es: 'Backend y APIs' }, scope: { en: 'Professional + project evidence', es: 'Evidencia profesional + proyectos' }, items: ['Laravel', 'FastAPI', 'REST APIs', 'Webhooks', 'Pydantic', 'SQLAlchemy', 'Authentication', 'Integrations'], links: ['ml-model-serving-ops', 'landfinder-chile'] },
  { icon: Server, title: { en: 'Infrastructure & DevOps', es: 'Infraestructura y DevOps' }, scope: { en: 'Professional practice + labs', es: 'Práctica profesional + laboratorios' }, items: ['Linux', 'Nginx', 'PHP-FPM', 'Docker', 'GitHub Actions', 'CI/CD', 'Bash', 'Networking', 'Observability'], links: ['rhel-network-operations-lab', 'storage-performance-observability'] },
  { icon: Database, title: { en: 'Databases & Data Engineering', es: 'Bases de datos e ingeniería de datos' }, scope: { en: 'Professional + project evidence', es: 'Evidencia profesional + proyectos' }, items: ['PostgreSQL/PostGIS', 'MySQL', 'SQL', 'Firebase/Firestore', 'ETL', 'Geospatial data', 'Pandas', 'NumPy'], links: ['dataset-quality-calibration-lab', 'landfinder-chile'] },
  { icon: ShieldCheck, title: { en: 'Security, QA & Automation', es: 'Seguridad, QA y automatización' }, scope: { en: 'Professional + reproducible labs', es: 'Profesional + laboratorios reproducibles' }, items: ['Playwright', 'pytest', 'Selenium', 'Postman', 'n8n', 'Dry-run safety', 'Least privilege', 'Audit trails'], links: ['web-performance-evidence', 'collaboration-ops-lab'] },
  { icon: CircleDot, title: { en: 'Machine Learning & Computer Vision', es: 'Machine learning y visión computacional' }, scope: { en: 'Independent + academic evidence', es: 'Evidencia independiente + académica' }, items: ['Python', 'PyTorch', 'TensorFlow/Keras', 'scikit-learn', 'MLflow', 'OpenCV', 'Model evaluation', 'Synthetic data'], links: ['mlops-gpu-benchmark-lab', 'scientific-anomaly-detection'] },
  { icon: TestTube2, title: { en: 'Systems Engineering', es: 'Ingeniería de sistemas' }, scope: { en: 'Academic + independent evidence', es: 'Evidencia académica + independiente' }, items: ['C++17/20', 'CMake', 'Distributed storage', 'Networking', 'Unity', 'AR Foundation', 'Arduino', 'Scientific evaluation'], links: ['cpp-file-integrity-toolkit', 'storage-performance-observability'] },
]

const resumes = {
  en: {
    label: 'English edition', description: 'General Software Engineer · 1 page',
    pdf: 'Sebastian_Astroza_Software_Engineer_General_2026.pdf',
  },
  es: {
    label: 'Edición en español', description: 'Ingeniería de Software General · 2 páginas',
    pdf: 'Sebastian_Astroza_CV_General_2026_ES.pdf',
  },
} as const

function useRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  useEffect(() => {
    const listener = () => {
      const update = () => setHash(window.location.hash || '#/')
      const transitionDocument = document as TransitionDocument
      const isSectionNavigation = window.location.hash.startsWith('#/#')
      if (!isSectionNavigation && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && transitionDocument.startViewTransition) {
        transitionDocument.startViewTransition(update)
      } else update()
    }
    window.addEventListener('hashchange', listener)
    return () => window.removeEventListener('hashchange', listener)
  }, [])
  return hash.replace(/^#/, '')
}

function usePreferences() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('portfolio-language') === 'es' ? 'es' : 'en')
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('portfolio-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => { localStorage.setItem('portfolio-language', language); document.documentElement.lang = language }, [language])
  useEffect(() => { localStorage.setItem('portfolio-theme', theme); document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])
  return { language, setLanguage, theme, setTheme }
}

function useScrollReveal(route: string) {
  useLayoutEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>('.section-title, .proof-band, .about-grid, .filter-panel, .project-card, .timeline article, .case-study-grid article, .performance-panel, .education-grid article, .skills-grid article, .contact-section > *, .resume-grid article, .resume-note, .detail-content section, .detail-aside')]
    elements.forEach((element, index) => {
      element.classList.add('reveal-target')
      element.style.setProperty('--reveal-order', String(index % 6))
    })

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    document.documentElement.classList.add('motion-ready')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [route])
}

function Header({ language, setLanguage, theme, setTheme, route }: { language: Language; setLanguage: (value: Language) => void; theme: Theme; setTheme: (value: Theme) => void; route: string }) {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const t = copy[language]
  const items = [
    ['#/', t.nav.home], ['#/projects', t.nav.projects], ['#/#experience', t.nav.experience], ['#/#skills', t.nav.skills], ['#/resume', t.nav.resume], ['#/#contact', t.nav.contact],
  ]
  function navigate(href: string) {
    setOpen(false)
    if (href.includes('/#')) {
      const id = href.split('#')[2]
      setActiveSection(id)
      window.location.hash = href.slice(1)
    } else window.location.hash = href.slice(1)
  }
  useEffect(() => setOpen(false), [route])
  useEffect(() => {
    if (!(route === '/' || route.startsWith('/#')) || typeof IntersectionObserver === 'undefined') return
    const sections = ['experience', 'skills', 'contact'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
      else if (window.scrollY < 240) setActiveSection('')
    }, { rootMargin: '-20% 0px -62% 0px', threshold: [0, .15, .5] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [route])
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement as HTMLElement | null
    document.body.classList.add('nav-open')
    window.requestAnimationFrame(() => navRef.current?.querySelector<HTMLButtonElement>('button')?.focus())
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); return }
      if (event.key !== 'Tab' || !headerRef.current) return
      const focusable = [...headerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')].filter((element) => element.offsetParent !== null)
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('nav-open')
      previousFocus?.focus()
    }
  }, [open])
  const isHomeRoute = route === '/' || route.startsWith('/#')
  const isActive = (href: string) => href === '#/' ? route === '/' && !activeSection : href.includes('/#') ? isHomeRoute && activeSection === href.split('#')[2] : href === '#/projects' ? route.startsWith('/projects') : href === '#/resume' ? route === '/resume' : false
  return <header className="site-header" ref={headerRef}>
    <a href="#/" className="brand" aria-label="SA — Sebastián Astroza home"><span>SA</span><b>Sebastián Astroza</b></a>
    <nav id="primary-navigation" ref={navRef} className={open ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
      {items.map(([href, label]) => <button className={isActive(href) ? 'active' : ''} aria-current={isActive(href) ? 'page' : undefined} key={label} onClick={() => navigate(href)}>{label}</button>)}
    </nav>
    <div className="header-actions">
      <button className="icon-button language-button" onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}><Languages size={17}/><span>{language.toUpperCase()}</span></button>
      <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>
      <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? (language === 'en' ? 'Close navigation' : 'Cerrar navegación') : (language === 'en' ? 'Open navigation' : 'Abrir navegación')}>{open ? <X/> : <Menu/>}</button>
    </div>
    <button className={open ? 'nav-scrim open' : 'nav-scrim'} aria-label={language === 'en' ? 'Close navigation' : 'Cerrar navegación'} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}/>
  </header>
}

function HeroPortrait({ language }: { language: Language }) {
  const [loaded, setLoaded] = useState(false)
  return <figure className="hero-portrait" aria-labelledby="portrait-caption">
    <div className={`portrait-frame ${loaded ? 'image-loaded' : ''}`}>
      <div className="portrait-status"><span>PROFILE / 2026</span><span className="trace-state">AVAILABLE</span></div>
      <div className="portrait-grid" aria-hidden="true"/>
      <span className="portrait-loader" aria-hidden="true"/>
      <picture>
        <source media="(max-width: 760px)" srcSet="/assets/sebastian-astroza-portrait-mobile.webp"/>
        <img
          src="/assets/sebastian-astroza-portrait-v2.webp"
          alt={language === 'en' ? 'Portrait of Sebastián Astroza wearing a blue shirt' : 'Retrato de Sebastián Astroza con camisa azul'}
          width="1102"
          height="1427"
          sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1080px) 42vw, 540px"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </picture>
      <div className="portrait-proof" aria-label={language === 'en' ? 'Professional focus' : 'Enfoque profesional'}>
        <span>FULL-STACK</span><span>LINUX</span><span>DATA</span><span>APPLIED AI</span>
      </div>
    </div>
    <figcaption id="portrait-caption">{language === 'en' ? 'Software engineer in Santiago, Chile · evidence-led portfolio.' : 'Ingeniero de software en Santiago, Chile · portafolio basado en evidencia.'}</figcaption>
  </figure>
}

function AutismoConectaCaseStudy({ language }: { language: Language }) {
  const t = copy[language]
  return <Section id="autismoconecta-case-study" eyebrow="04 / Professional evidence" title={t.caseStudy} className="case-study-section">
    <p className="section-intro">{t.caseStudyBody}</p>
    <div className="case-study-grid">
      <article><ShieldCheck/><p className="mono-label">{language === 'en' ? 'Responsibility boundary' : 'Límite de responsabilidad'}</p><h3>{language === 'en' ? 'Cross-functional engineering' : 'Ingeniería transversal'}</h3><p>{language === 'en' ? 'Owner-reported work includes full-stack delivery, Linux operations, databases, automation, security, integrations, administrative tooling, QA and incident resolution.' : 'El trabajo informado incluye desarrollo full-stack, operaciones Linux, bases de datos, automatización, seguridad, integraciones, herramientas administrativas, QA y resolución de incidencias.'}</p></article>
      <article><Bot/><p className="mono-label">{language === 'en' ? 'AI-assisted development' : 'Desarrollo asistido por IA'}</p><h3>{language === 'en' ? 'Human-reviewed and accountable' : 'Revisado por personas y responsable'}</h3><p>{language === 'en' ? 'AI tools support analysis, implementation and documentation. Public claims remain subject to human review, tests, debugging and evidence boundaries; AI assistance does not establish individual authorship.' : 'Herramientas de IA apoyan análisis, implementación y documentación. Las afirmaciones públicas dependen de revisión humana, pruebas, depuración y límites de evidencia; la asistencia no establece autoría individual.'}</p></article>
      <article><Gauge/><p className="mono-label">{language === 'en' ? 'Strongest public artifact' : 'Artefacto público más sólido'}</p><h3>{language === 'en' ? 'Reproducible performance analysis' : 'Análisis de rendimiento reproducible'}</h3><p>{language === 'en' ? 'The linked lab preserves supplied measurements, calculation rules, accessible visualization and limitations without contacting production.' : 'El laboratorio vinculado conserva mediciones proporcionadas, reglas de cálculo, visualización accesible y limitaciones sin contactar producción.'}</p></article>
    </div>
    <div className="performance-panel" aria-labelledby="performance-title">
      <div className="performance-heading"><div><p className="mono-label">LOCAL P75 · OWNER-PROVIDED</p><h3 id="performance-title">{language === 'en' ? 'Before / after performance evidence' : 'Evidencia de rendimiento antes / después'}</h3></div><div className="performance-legend"><span className="before-dot">{language === 'en' ? 'Before' : 'Antes'}</span><span className="after-dot">{language === 'en' ? 'After' : 'Después'}</span></div></div>
      <div className="metric-list">{performanceMetrics.map((metric) => {
        const maximum = Math.max(metric.before, metric.after)
        return <div className={`metric-row ${metric.regression ? 'metric-regression' : ''}`} key={metric.key}>
          <div className="metric-label"><b>{metric.key}</b><span>{metric.change > 0 ? '+' : ''}{metric.change.toLocaleString(language)}%</span></div>
          <div className="metric-bars" aria-label={`${metric.key}: ${metric.before} ${metric.unit} before, ${metric.after} ${metric.unit} after`}>
            <span className="metric-before" style={{ width: `${Math.max(3, metric.before / maximum * 100)}%` }}><i>{metric.before} {metric.unit}</i></span>
            <span className="metric-after" style={{ width: `${Math.max(3, metric.after / maximum * 100)}%` }}><i>{metric.after} {metric.unit}</i></span>
          </div>
          {(metric.warning || metric.regression) && <span className="metric-warning"><AlertTriangle size={14}/>{metric.regression ? (language === 'en' ? 'Regression, although 0.062 remains below 0.1.' : 'Regresión, aunque 0,062 permanece bajo 0,1.') : (language === 'en' ? 'Improved, but 3.46 s remains above the 2.5 s target.' : 'Mejoró, pero 3,46 s sigue sobre el objetivo de 2,5 s.')}</span>}
        </div>
      })}</div>
      <p className="performance-note">{language === 'en' ? 'Local p75 values supplied by the owner. Not real-user field data, not independently reproduced and not proof of causality. Browser, device, route, cache, throttling, run count and variance were not documented.' : 'Valores p75 locales proporcionados por el propietario. No son datos de usuarios reales, no fueron reproducidos independientemente ni prueban causalidad. No se documentaron navegador, dispositivo, ruta, caché, throttling, número de corridas ni varianza.'}</p>
      <div className="case-study-actions"><a className="button primary" href="#/projects/web-performance-evidence">{language === 'en' ? 'Inspect performance lab' : 'Inspeccionar laboratorio'}<ArrowRight size={16}/></a><a className="button secondary" href="https://github.com/sebastroza1/sebastroza1.github.io/blob/main/PROFESSIONAL_EVIDENCE_PUBLIC.md" target="_blank" rel="noreferrer">{language === 'en' ? 'Evidence boundary' : 'Límite de evidencia'}<ExternalLink size={14}/></a></div>
    </div>
  </Section>
}

function Status({ value }: { value: Project['status'] }) {
  return <span className={`status-badge status-${value.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`}><CheckCircle2 size={13}/>{value}</span>
}

function ProjectCard({ project, language, featured = false }: { project: Project; language: Language; featured?: boolean }) {
  return <article className={`project-card ${featured ? 'project-card-featured' : ''}`}>
    <div className="project-card-top"><span className="project-index">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><Status value={project.status}/></div>
    <div className="project-classification"><p className="mono-label">{project.kind}</p><span>{project.categories.filter((category) => category !== 'featured').slice(0, 2).map((category) => categoryLabels[category][language]).join(' · ')}</span></div>
    <h3>{project.name}</h3>
    <p className="project-summary">{project.overview[language]}</p>
    <div className="tag-list">{project.technologies.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
    <div className="project-result"><b>{copy[language].results}</b><span>{project.results[language]}</span></div>
    <a className="card-link" href={`#/projects/${project.slug}`}>{copy[language].details}<ArrowRight size={16}/></a>
  </article>
}

export function ProjectExplorer({ language }: { language: Language }) {
  const t = copy[language]
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [projectLanguage, setProjectLanguage] = useState('')
  const [technology, setTechnology] = useState('')
  const [kind, setKind] = useState('')
  const [status, setStatus] = useState('')
  const filtered = useMemo(() => projects.filter((project) => {
    const haystack = `${project.name} ${project.overview.en} ${project.overview.es} ${project.technologies.join(' ')}`.toLowerCase()
    return (!search || haystack.includes(search.toLowerCase())) && (!category || project.categories.includes(category)) && (!projectLanguage || project.languages.includes(projectLanguage)) && (!technology || project.technologies.includes(technology)) && (!kind || project.kind === kind) && (!status || project.status === status)
  }), [search, category, projectLanguage, technology, kind, status])
  const reset = () => { setSearch(''); setCategory(''); setProjectLanguage(''); setTechnology(''); setKind(''); setStatus('') }
  return <>
    <section className="filter-panel" aria-labelledby="filters-title">
      <div className="filter-heading"><div><p className="eyebrow">{t.allProjects}</p><h2 id="filters-title">{t.filters}</h2></div><button className="text-button" onClick={reset}>{t.clear}</button></div>
      <label className="search-field"><Search size={18}/><span className="sr-only">{t.search}</span><input aria-label={t.search} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`${t.search}…`}/></label>
      <div className="category-filters" aria-label={t.category}>
        <button className={!category ? 'active' : ''} onClick={() => setCategory('')}>{t.all}</button>
        {(Object.keys(categoryLabels) as Category[]).map((value) => <button className={category === value ? 'active' : ''} key={value} onClick={() => setCategory(value)}>{categoryLabels[value][language]}</button>)}
      </div>
      <div className="select-filters">
        <FilterSelect label={t.language} value={projectLanguage} onChange={setProjectLanguage} options={allLanguages}/>
        <FilterSelect label={t.tech} value={technology} onChange={setTechnology} options={allTechnologies}/>
        <FilterSelect label={t.kind} value={kind} onChange={setKind} options={['Independent project', 'Academic experience', 'Learning in progress']}/>
        <FilterSelect label={t.status} value={status} onChange={setStatus} options={['CI validated', 'Locally tested', 'Implemented · runtime blocked', 'Academic prototype', 'In development']}/>
      </div>
    </section>
    <div className="results-summary" aria-live="polite"><b>{filtered.length}</b> {language === 'en' ? 'projects shown' : 'proyectos mostrados'}</div>
    {filtered.length ? <div className="project-grid">{filtered.map((project) => <ProjectCard key={project.slug} project={project} language={language}/>)}</div> : <div className="empty-state"><Search/><h3>{t.noResults}</h3><button className="button secondary" onClick={reset}>{t.clear}</button></div>}
  </>
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">All</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

function Section({ id, eyebrow, title, children, className = '' }: { id?: string; eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`content-section ${className}`}><div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{children}</section>
}

function HomePage({ language }: { language: Language }) {
  const t = copy[language]
  const featured = projects.filter((project) => project.featured).slice(0, 4)
  return <main id="main-content">
    <section className="hero section-frame">
      <div className="hero-copy"><p className="eyebrow">{t.heroKicker}</p><p className="hero-role">{t.heroRole}</p><h1>{t.heroTitleA}<br/><em>{t.heroTitleB}</em></h1><p className="hero-lead">{t.heroBody}</p>
        <div className="hero-domain-row" aria-label={language === 'en' ? 'Engineering focus areas' : 'Áreas de enfoque de ingeniería'}>{['ML systems', 'Infrastructure', 'Data integration', 'Full-stack'].map((area) => <span key={area}>{area}</span>)}</div>
        <div className="hero-actions"><a className="button primary" href="#/projects">{t.viewProjects}<ArrowRight size={17}/></a><a className="button secondary" href="#/resume">{t.resume}</a></div>
        <p className="availability"><Globe2 size={16}/>{t.availability}</p></div>
      <HeroPortrait language={language}/>
    </section>
    <section className="proof-band"><div><span className="proof-number">{projects.length}</span><span>{language === 'en' ? 'documented projects' : 'proyectos documentados'}</span></div><div><span className="proof-number">13</span><span>{language === 'en' ? 'public engineering labs' : 'laboratorios públicos'}</span></div><div><span className="proof-number">2</span><span>{language === 'en' ? 'professional contexts' : 'contextos profesionales'}</span></div><div className="proof-copy"><h2>{t.proofTitle}</h2><p>{t.proofBody}</p></div></section>
    <Section eyebrow="01 / About" title={t.aboutTitle}><div className="about-grid"><p className="large-copy">{t.aboutBody}</p><div className="about-facts"><div><b>{language === 'en' ? 'Location' : 'Ubicación'}</b><span>Santiago, Chile</span></div><div><b>{language === 'en' ? 'Languages' : 'Idiomas'}</b><span>{language === 'en' ? 'Spanish native · English C1 · French beginner · Portuguese basic' : 'Español nativo · Inglés C1 · Francés principiante · Portugués básico'}</span></div><div><b>{language === 'en' ? 'Education' : 'Educación'}</b><span>{t.academicPending}</span></div></div></div></Section>
    <Section eyebrow="02 / Work" title={t.featured} className="featured-section"><p className="section-intro">{t.featuredBody}</p><div className="project-grid featured-grid">{featured.map((project, index) => <ProjectCard key={project.slug} project={project} language={language} featured={index === 0}/>)}</div><a className="button secondary section-cta" href="#/projects">{t.allProjects}<ArrowRight size={17}/></a></Section>
    <Section id="experience" eyebrow="03 / Timeline" title={t.experience}><div className="timeline">{experience.map((item, index) => <article key={item.company}><div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div><div className="timeline-content"><div className="timeline-heading"><div><h3>{item.company}</h3><p>{item.role}</p></div><time>{item.period[language]}</time></div><p>{item.description[language]}</p><p>{item.details[language]}</p><div className="evidence-callout"><CheckCircle2 size={18}/><span>{item.result[language]}</span></div></div></article>)}</div></Section>
    <AutismoConectaCaseStudy language={language}/>
    <Section eyebrow="05 / Education" title={t.education}><div className="education-grid"><article><p className="mono-label">Universidad Central de Chile</p><h3>Civil Engineering in Computing and Informatics</h3><p>{t.academicPending}</p><div className="tag-list">{['Algorithms', 'Java & OOP', 'Databases', 'Linux & Red Hat', 'Networking', 'Machine Learning', 'Arduino'].map((item) => <span key={item}>{item}</span>)}</div><p>{language === 'en' ? 'Teaching-assistant experience in Physics and Probability.' : 'Experiencia como ayudante en Física y Probabilidad.'}</p></article><article className="recognition-card"><p className="mono-label">Recognition · 2026</p><h3>NeuroFAST</h3><p>{language === 'en' ? 'Selected in the first national stage of the UDD Impacto Emprendedor 2026 competition and participated in formative activities. This does not mean the project won or has clinical validation.' : 'Seleccionado en la primera etapa nacional de Impacto Emprendedor UDD 2026 y participante en actividades formativas. Esto no significa que ganó ni que tenga validación clínica.'}</p><a className="text-link" href="#/projects/neurofast">{t.details}<ChevronRight size={15}/></a></article></div></Section>
    <Section id="skills" eyebrow="06 / Evidence map" title={t.skills}><div className="skills-grid">{skills.map(({ icon: Icon, ...skill }) => <article key={skill.title.en}><Icon/><p className="mono-label">{skill.scope[language]}</p><h3>{skill.title[language]}</h3><ul>{skill.items.map((item) => <li key={item}>{item}</li>)}</ul><div className="skill-links">{skill.links.map((slug) => <a key={slug} href={`#/projects/${slug}`}>{projects.find((project) => project.slug === slug)?.name}<ChevronRight size={13}/></a>)}</div></article>)}</div></Section>
    <Contact language={language}/>
  </main>
}

function ProjectsPage({ language }: { language: Language }) {
  return <main id="main-content" className="page-main"><header className="page-hero"><p className="eyebrow">Evidence library</p><h1>{language === 'en' ? 'Projects built to be inspected.' : 'Proyectos construidos para ser inspeccionados.'}</h1><p>{language === 'en' ? 'Filter by discipline, implementation technology and verification status. Every card resolves to one project—categories are tags, never duplicates.' : 'Filtra por disciplina, tecnología y estado de verificación. Cada tarjeta representa un único proyecto; las categorías son etiquetas, no duplicados.'}</p></header><ProjectExplorer language={language}/></main>
}

function ProjectDetail({ project, language }: { project: Project; language: Language }) {
  const t = copy[language]
  useEffect(() => { document.title = `${project.name} — Sebastián Astroza` }, [project])
  const sections = [
    [t.overview, project.overview[language]], [t.problem, project.problem[language]], [t.contribution, project.contribution[language]], [t.architecture, project.architecture[language]], [t.implementation, project.solution[language]], [t.testing, project.testing[language]], [t.results, project.results[language]], [t.limitations, project.limitations[language]], [t.learned, project.learning[language]],
  ]
  return <main id="main-content" className="page-main detail-page"><a href="#/projects" className="back-link"><ArrowLeft size={16}/>{t.back}</a><header className="detail-hero"><div><p className="eyebrow">{project.kind}</p><h1>{project.name}</h1><p>{project.overview[language]}</p><div className="tag-list">{[...project.languages, ...project.technologies].map((item) => <span key={item}>{item}</span>)}</div></div><div className="detail-status"><Status value={project.status}/><dl><dt>{language === 'en' ? 'Primary areas' : 'Áreas principales'}</dt><dd>{project.categories.filter((value) => value !== 'featured').map((value) => categoryLabels[value][language]).join(' · ')}</dd><dt>{t.evidence}</dt><dd>{project.evidence.join(' · ')}</dd></dl></div></header><div className="detail-layout"><article className="detail-content">{sections.map(([title, body], index) => <section key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}</article><aside className="detail-aside"><h2>{t.evidence}</h2><ul>{project.evidence.map((item) => <li key={item}><CheckCircle2 size={15}/>{item}</li>)}</ul>{project.repo && <a className="button primary" href={project.repo} target="_blank" rel="noreferrer"><Github size={17}/>{t.repository}<ExternalLink size={14}/></a>}{project.documentation && <a className="button secondary" href={project.documentation} target="_blank" rel="noreferrer">{t.docs}<ExternalLink size={14}/></a>}</aside></div></main>
}

function ResumePage({ language }: { language: Language }) {
  const t = copy[language]
  const editions: Language[] = [language, language === 'en' ? 'es' : 'en']
  return <main id="main-content" className="page-main"><header className="page-hero"><p className="eyebrow">Resume / CV</p><h1>{t.resumeTitle}</h1><p>{t.resumeBody}</p></header><div className="resume-grid">{editions.map((edition, index) => {
    const resume = resumes[edition]
    return <article className={index === 0 ? 'resume-primary' : ''} key={edition}><Download/><p className="mono-label">{index === 0 ? (language === 'en' ? 'Primary download' : 'Descarga principal') : (language === 'en' ? 'Alternate language' : 'Idioma alternativo')}</p><h2>{resume.label}</h2><p>{resume.description}</p><div className="resume-actions"><a className="button primary" href={`/cv/${resume.pdf}`} download><Download size={16}/>{language === 'en' ? 'Download PDF' : 'Descargar PDF'}</a></div><code>{resume.pdf}</code></article>
  })}</div><div className="resume-note"><ShieldCheck/><div><h2>{language === 'en' ? 'Validated publication files' : 'Archivos de publicación validados'}</h2><p>{language === 'en' ? 'Both PDF editions use selectable text, a linear ATS-friendly reading order, visible clickable links and professional metadata. The resumes intentionally contain no photograph and no editable public source file.' : 'Ambas ediciones PDF usan texto seleccionable, lectura lineal orientada a ATS, enlaces visibles y clicables, y metadatos profesionales. Los CV no incluyen fotografía ni un archivo fuente editable público.'}</p></div></div></main>
}

function Contact({ language }: { language: Language }) {
  const t = copy[language]
  const [copied, setCopied] = useState(false)
  async function copyEmail() {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText('sebastroza10@gmail.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { setCopied(false) }
  }
  return <section id="contact" className="contact-section"><div className="contact-copy"><p className="eyebrow">07 / Contact</p><h2>{t.contactTitle}</h2><p>{t.contactBody}</p><button className="copy-email" onClick={copyEmail} type="button">{copied ? <Check size={16}/> : <Copy size={16}/>}<span aria-live="polite">{copied ? (language === 'en' ? 'Email copied' : 'Correo copiado') : (language === 'en' ? 'Copy email' : 'Copiar correo')}</span></button></div><div className="contact-links"><a href="mailto:sebastroza10@gmail.com"><Mail/><span><small>{language === 'en' ? 'Email' : 'Correo'}</small>sebastroza10@gmail.com</span><ArrowRight size={17}/></a><a href="https://www.linkedin.com/in/sebastian-a-677745276/" target="_blank" rel="noreferrer"><Linkedin/><span><small>LinkedIn</small>LinkedIn — Sebastián Astroza</span><ExternalLink size={15}/></a><a href="https://github.com/sebastroza1" target="_blank" rel="noreferrer"><Github/><span><small>GitHub</small>github.com/sebastroza1</span><ExternalLink size={15}/></a><a href="https://sebastroza1.github.io/" target="_blank" rel="noreferrer"><Globe2/><span><small>{language === 'en' ? 'Portfolio' : 'Portafolio'}</small>sebastroza1.github.io</span><ExternalLink size={15}/></a><a href="https://cert.efset.org/m27XNx" target="_blank" rel="noreferrer"><Languages/><span><small>{language === 'en' ? 'English credential' : 'Certificación de inglés'}</small>EF SET · Global C1</span><ExternalLink size={15}/></a></div></section>
}

function BackToTop({ language }: { language: Language }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 900)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <button className={visible ? 'back-to-top visible' : 'back-to-top'} type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })} aria-label={language === 'en' ? 'Back to top' : 'Volver arriba'}><ArrowUp size={18}/></button>
}

function Footer({ language }: { language: Language }) {
  return <footer><div><b>Sebastián Andrés Astroza Aguayo</b><span>Software Engineer · Santiago, Chile</span></div><p>{language === 'en' ? 'Independent portfolio. No affiliation with CERN is implied.' : 'Portafolio independiente. No implica afiliación con CERN.'}</p><span>© 2026</span></footer>
}

export default function App() {
  const route = useRoute()
  const { language, setLanguage, theme, setTheme } = usePreferences()
  useScrollReveal(route)
  useEffect(() => {
    if (!route.startsWith('/projects/')) document.title = 'Sebastián Astroza — Software Engineering Portfolio'
    if (route.startsWith('/#')) {
      const id = route.slice(2)
      let cancelled = false
      const timer = window.setTimeout(() => {
        const target = document.getElementById(id)
        if (!target) return
        // `content-visibility: auto` keeps the long home page fast, but some
        // mobile browsers initially lay out skipped sections with placeholders.
        // Resolve the real home-page geometry once before jumping to a deep link.
        const sections = [...document.querySelectorAll<HTMLElement>('main#main-content > .content-section')]
        const previousVisibility = sections.map((section) => section.style.contentVisibility)
        const previousBehavior = document.documentElement.style.scrollBehavior
        sections.forEach((section) => { section.style.contentVisibility = 'visible' })
        document.documentElement.style.scrollBehavior = 'auto'
        const jumpToTarget = () => {
          const headerOffset = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 72
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12
          window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
        }
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          if (cancelled) return
          jumpToTarget()
          window.setTimeout(() => {
            if (cancelled) return
            sections.forEach((section, index) => { section.style.contentVisibility = previousVisibility[index] })
            window.requestAnimationFrame(() => {
              if (cancelled) return
              jumpToTarget()
              document.documentElement.style.scrollBehavior = previousBehavior
            })
          }, 80)
        }))
      }, 40)
      return () => { cancelled = true; window.clearTimeout(timer) }
    } else window.scrollTo({ top: 0 })
  }, [route])
  const detail = route.startsWith('/projects/') ? projects.find((project) => project.slug === route.split('/')[2]) : undefined
  const routeKey = route.startsWith('/#') ? '/' : route
  return <><Header language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} route={route}/><div className="route-shell" key={routeKey}>{detail ? <ProjectDetail project={detail} language={language}/> : route === '/projects' ? <ProjectsPage language={language}/> : route === '/resume' ? <ResumePage language={language}/> : <HomePage language={language}/>}</div><Footer language={language}/><BackToTop language={language}/></>
}

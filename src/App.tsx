import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowLeft, ArrowRight, Braces, CheckCircle2, ChevronRight, CircleDot,
  Database, Download, ExternalLink, FileWarning, Github, Globe2, Languages,
  Linkedin, Mail, Menu, Moon, Network, Search, Server, Sun, TestTube2, X,
} from 'lucide-react'
import { allLanguages, allTechnologies, categoryLabels, projects, type Category, type Language, type Project } from './data/projects'

type Theme = 'light' | 'dark'

const copy = {
  en: {
    nav: { home: 'Home', projects: 'Projects', experience: 'Experience', skills: 'Skills', resume: 'Resume', contact: 'Contact' },
    heroKicker: 'Software · Systems · Applied AI',
    heroTitleA: 'Building reliable software', heroTitleB: 'and applied AI.',
    heroBody: 'Early-career software engineer working across machine learning, infrastructure, data integration and full-stack development.',
    viewProjects: 'View projects', resume: 'Resume', availability: 'Santiago, Chile · Open to international opportunities and relocation',
    proofTitle: 'Engineering evidence, not decorative claims.',
    proofBody: 'Every public project is tied to source code, tests, documented results and explicit limitations. Synthetic data and unverified runtime paths remain labelled as such.',
    aboutTitle: 'A software engineer shaped by systems thinking.',
    aboutBody: 'I completed the academic requirements for Civil Engineering in Computing and Informatics at Universidad Central de Chile in 2026. Formal degree conferral is pending institutional confirmation. My work spans production software, Linux infrastructure, backend and frontend development, databases, automation, machine learning and computer vision.',
    featured: 'Selected engineering work', featuredBody: 'Projects chosen for technical depth, reproducibility and honest evidence boundaries.',
    experience: 'Professional experience', education: 'Education & research', skills: 'Engineering skills',
    allProjects: 'Explore all projects', filters: 'Filter the evidence', search: 'Search projects', category: 'Area', language: 'Language', tech: 'Technology', kind: 'Type', status: 'Status', all: 'All', clear: 'Clear filters', noResults: 'No projects match these filters.',
    results: 'Verified result', limitations: 'Limitations', evidence: 'Evidence', details: 'View case study', repository: 'GitHub repository', docs: 'Evidence document',
    overview: 'Overview', problem: 'Problem', contribution: 'My contribution', architecture: 'Architecture', implementation: 'Implementation', challenges: 'Engineering challenges', testing: 'Testing', learned: 'What I learned', back: 'Back to projects',
    resumeTitle: 'Role-focused resumes', resumeBody: 'The four PDF files were not present during this build, so the site intentionally exposes no broken download links. Add the reviewed files under public/cv/ using the exact names below.', unavailable: 'File not yet provided',
    contactTitle: 'Let’s discuss useful engineering work.', contactBody: 'Available for early-career software, applied AI, infrastructure and research-engineering opportunities.',
    academicPending: 'Academic requirements completed in 2026 · degree conferral pending',
  },
  es: {
    nav: { home: 'Inicio', projects: 'Proyectos', experience: 'Experiencia', skills: 'Competencias', resume: 'CV', contact: 'Contacto' },
    heroKicker: 'Software · Sistemas · IA aplicada',
    heroTitleA: 'Construyendo software confiable', heroTitleB: 'e IA aplicada.',
    heroBody: 'Ingeniero de software en etapa inicial trabajando en machine learning, infraestructura, integración de datos y desarrollo full-stack.',
    viewProjects: 'Ver proyectos', resume: 'Currículum', availability: 'Santiago, Chile · Disponible para oportunidades internacionales y reubicación',
    proofTitle: 'Evidencia de ingeniería, no afirmaciones decorativas.',
    proofBody: 'Cada proyecto público se vincula con código, pruebas, resultados documentados y limitaciones explícitas. Los datos sintéticos y rutas no verificadas permanecen identificados.',
    aboutTitle: 'Un ingeniero de software formado por pensamiento de sistemas.',
    aboutBody: 'Completé los requisitos académicos de Ingeniería Civil en Computación e Informática en la Universidad Central de Chile durante 2026. El otorgamiento formal del grado está pendiente de confirmación institucional. Mi trabajo abarca software de producción, infraestructura Linux, backend y frontend, bases de datos, automatización, machine learning y visión computacional.',
    featured: 'Trabajo de ingeniería seleccionado', featuredBody: 'Proyectos elegidos por profundidad técnica, reproducibilidad y límites honestos de evidencia.',
    experience: 'Experiencia profesional', education: 'Educación e investigación', skills: 'Competencias de ingeniería',
    allProjects: 'Explorar todos los proyectos', filters: 'Filtrar la evidencia', search: 'Buscar proyectos', category: 'Área', language: 'Lenguaje', tech: 'Tecnología', kind: 'Tipo', status: 'Estado', all: 'Todos', clear: 'Limpiar filtros', noResults: 'Ningún proyecto coincide con estos filtros.',
    results: 'Resultado verificado', limitations: 'Limitaciones', evidence: 'Evidencia', details: 'Ver caso de estudio', repository: 'Repositorio GitHub', docs: 'Documento de evidencia',
    overview: 'Resumen', problem: 'Problema', contribution: 'Mi contribución', architecture: 'Arquitectura', implementation: 'Implementación', challenges: 'Desafíos de ingeniería', testing: 'Pruebas', learned: 'Qué aprendí', back: 'Volver a proyectos',
    resumeTitle: 'CV orientados por rol', resumeBody: 'Los cuatro PDF no estaban disponibles durante esta construcción, por lo que el sitio no expone enlaces rotos. Agrega los archivos revisados bajo public/cv/ con los nombres exactos indicados.', unavailable: 'Archivo aún no proporcionado',
    contactTitle: 'Conversemos sobre ingeniería útil.', contactBody: 'Disponible para oportunidades iniciales en software, IA aplicada, infraestructura e ingeniería de investigación.',
    academicPending: 'Requisitos académicos completados en 2026 · otorgamiento de grado pendiente',
  },
} as const

const experience = [
  {
    company: 'AutismoConecta', period: { en: 'January 2026 — present', es: 'Enero 2026 — actualidad' },
    role: 'Software Engineer — Backend, QA & Infrastructure',
    description: {
      en: 'Early-stage Chilean social-impact technology startup connecting neurodivergent people and families with professionals, services and support resources.',
      es: 'Startup tecnológica chilena de impacto social que conecta personas neurodivergentes y familias con profesionales, servicios y recursos de apoyo.',
    },
    details: {
      en: 'Laravel/PHP, Angular, Next.js, Linux VPS, Nginx, Docker, PHP-FPM, databases, TEST/PROD environments, APIs, security, integrations and deployments.',
      es: 'Laravel/PHP, Angular, Next.js, VPS Linux, Nginx, Docker, PHP-FPM, bases de datos, ambientes TEST/PROD, APIs, seguridad, integraciones y despliegues.',
    },
    result: { en: 'One documented quality cycle included 469 backend and 191 frontend tests.', es: 'Un ciclo de calidad documentado incluyó 469 pruebas backend y 191 frontend.' },
  },
  {
    company: 'TRC Recruitment', period: { en: 'August 2025 — March 2026', es: 'Agosto 2025 — marzo 2026' },
    role: 'QA, Automation & Data Integrations',
    description: {
      en: 'Recruitment and personnel-selection company using technology-enabled human-resources workflows.',
      es: 'Empresa de reclutamiento y selección de personal con flujos tecnológicos de recursos humanos.',
    },
    details: {
      en: 'Data extraction and transformation, Dropbox CV migration, import templates, n8n, webhooks, chatbots, Selenium, Postman, Scrum and documentation.',
      es: 'Extracción y transformación, migración de CV desde Dropbox, templates, n8n, webhooks, chatbots, Selenium, Postman, Scrum y documentación.',
    },
    result: { en: 'A task estimated at one month was completed in approximately one week.', es: 'Una tarea estimada en un mes fue completada en aproximadamente una semana.' },
  },
]

const skills = [
  { icon: CircleDot, title: 'Machine Learning', scope: 'Independent + academic', items: ['Python', 'PyTorch', 'TensorFlow/Keras', 'scikit-learn', 'MLflow', 'Model evaluation'], links: ['mlops-gpu-benchmark-lab', 'scientific-anomaly-detection'] },
  { icon: Braces, title: 'Software Development', scope: 'Professional + independent', items: ['PHP', 'Laravel', 'TypeScript', 'Angular', 'Next.js', 'FastAPI', 'Flutter'], links: ['ml-model-serving-ops', 'web-scraper-firstjob'] },
  { icon: Server, title: 'Systems Engineering', scope: 'Professional + independent', items: ['Linux', 'Red Hat labs', 'Docker', 'Networking', 'C++20', 'Bash'], links: ['cpp-file-integrity-toolkit', 'rhel-network-operations-lab'] },
  { icon: Database, title: 'Data Engineering', scope: 'Professional + independent', items: ['SQL', 'PostgreSQL/PostGIS', 'MySQL', 'Firebase/Firestore', 'ETL', 'REST APIs'], links: ['dataset-quality-calibration-lab', 'landfinder-chile'] },
  { icon: TestTube2, title: 'Quality & Automation', scope: 'Professional + independent', items: ['Git', 'GitHub Actions', 'Selenium', 'Postman', 'pytest', 'Scrum', 'n8n'], links: ['rhel-network-operations-lab', 'storage-performance-observability'] },
  { icon: Network, title: 'Research & Prototyping', scope: 'Academic', items: ['OpenCV', 'Unity', 'C#', 'AR Foundation', 'Arduino', 'Scientific evaluation'], links: ['neurofast', 'bateria-peroles'] },
]

const resumes = [
  'Sebastian_Astroza_CERN_Machine_Learning_Engineer_2026.pdf',
  'Sebastian_Astroza_CERN_Distributed_Storage_Engineer_2026.pdf',
  'Sebastian_Astroza_CERN_Full_Stack_Software_Developer_2026.pdf',
  'Sebastian_Astroza_CERN_Junior_Automation_Controls_Engineer_2026.pdf',
]

function useRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  useEffect(() => {
    const listener = () => setHash(window.location.hash || '#/')
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

function Header({ language, setLanguage, theme, setTheme }: { language: Language; setLanguage: (value: Language) => void; theme: Theme; setTheme: (value: Theme) => void }) {
  const [open, setOpen] = useState(false)
  const t = copy[language]
  const items = [
    ['#/', t.nav.home], ['#/projects', t.nav.projects], ['#/#experience', t.nav.experience], ['#/#skills', t.nav.skills], ['#/resume', t.nav.resume], ['#/#contact', t.nav.contact],
  ]
  function navigate(href: string) {
    setOpen(false)
    if (href.includes('/#')) {
      const id = href.split('#')[2]
      window.location.hash = '#/'
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 30)
    } else window.location.hash = href.slice(1)
  }
  return <header className="site-header">
    <a href="#/" className="brand" aria-label="SA — Sebastián Astroza home"><span>SA</span><b>Sebastián Astroza</b></a>
    <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
      {items.map(([href, label]) => <button key={label} onClick={() => navigate(href)}>{label}</button>)}
    </nav>
    <div className="header-actions">
      <button className="icon-button language-button" onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}><Languages size={17}/><span>{language.toUpperCase()}</span></button>
      <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>
      <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </div>
  </header>
}

function EvidenceVisual({ language }: { language: Language }) {
  return <figure className="evidence-visual" aria-labelledby="system-caption">
    <div className="visual-grid" aria-hidden="true">
      <div className="node node-a"><span>01</span><b>DATA</b><small>provenance</small></div>
      <div className="node node-b"><span>02</span><b>CODE</b><small>versioned</small></div>
      <div className="node node-c"><span>03</span><b>TEST</b><small>repeatable</small></div>
      <div className="node node-d"><span>04</span><b>RESULT</b><small>bounded</small></div>
      <svg viewBox="0 0 600 390" preserveAspectRatio="none"><path d="M105 90 C220 20 260 180 355 110 S485 160 510 85"/><path d="M110 300 C210 235 280 355 365 280 S470 230 515 300"/><path d="M110 92 L110 300 M510 85 L515 300"/></svg>
    </div>
    <figcaption id="system-caption">{language === 'en' ? 'A simple evidence chain: provenance, implementation, tests and bounded results.' : 'Cadena simple de evidencia: procedencia, implementación, pruebas y resultados acotados.'}</figcaption>
  </figure>
}

function Status({ value }: { value: Project['status'] }) {
  return <span className={`status-badge status-${value.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`}><CheckCircle2 size={13}/>{value}</span>
}

function ProjectCard({ project, language }: { project: Project; language: Language }) {
  return <article className="project-card">
    <div className="project-card-top"><span className="project-index">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><Status value={project.status}/></div>
    <p className="mono-label">{project.kind}</p>
    <h3>{project.name}</h3>
    <p>{project.overview[language]}</p>
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
  const featured = projects.filter((project) => project.featured)
  return <main id="main-content">
    <section className="hero section-frame">
      <div className="hero-copy"><p className="eyebrow">{t.heroKicker}</p><h1>{t.heroTitleA}<br/><em>{t.heroTitleB}</em></h1><p className="hero-lead">{t.heroBody}</p>
        <div className="hero-actions"><a className="button primary" href="#/projects">{t.viewProjects}<ArrowRight size={17}/></a><a className="button secondary" href="#/resume">{t.resume}</a></div>
        <p className="availability"><Globe2 size={16}/>{t.availability}</p></div>
      <EvidenceVisual language={language}/>
    </section>
    <section className="proof-band"><div><span className="proof-number">16</span><span>{language === 'en' ? 'documented projects' : 'proyectos documentados'}</span></div><div><span className="proof-number">11</span><span>{language === 'en' ? 'public engineering labs' : 'laboratorios públicos'}</span></div><div><span className="proof-number">2</span><span>{language === 'en' ? 'professional contexts' : 'contextos profesionales'}</span></div><div className="proof-copy"><h2>{t.proofTitle}</h2><p>{t.proofBody}</p></div></section>
    <Section eyebrow="01 / About" title={t.aboutTitle}><div className="about-grid"><p className="large-copy">{t.aboutBody}</p><div className="about-facts"><div><b>{language === 'en' ? 'Location' : 'Ubicación'}</b><span>Santiago, Chile</span></div><div><b>{language === 'en' ? 'Languages' : 'Idiomas'}</b><span>{language === 'en' ? 'Spanish native · English C1 · French beginner · Portuguese basic' : 'Español nativo · Inglés C1 · Francés principiante · Portugués básico'}</span></div><div><b>{language === 'en' ? 'Education' : 'Educación'}</b><span>{t.academicPending}</span></div></div></div></Section>
    <Section eyebrow="02 / Work" title={t.featured} className="featured-section"><p className="section-intro">{t.featuredBody}</p><div className="project-grid featured-grid">{featured.map((project) => <ProjectCard key={project.slug} project={project} language={language}/>)}</div><a className="button secondary section-cta" href="#/projects">{t.allProjects}<ArrowRight size={17}/></a></Section>
    <Section id="experience" eyebrow="03 / Timeline" title={t.experience}><div className="timeline">{experience.map((item, index) => <article key={item.company}><div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div><div className="timeline-content"><div className="timeline-heading"><div><h3>{item.company}</h3><p>{item.role}</p></div><time>{item.period[language]}</time></div><p>{item.description[language]}</p><p>{item.details[language]}</p><div className="evidence-callout"><CheckCircle2 size={18}/><span>{item.result[language]}</span></div></div></article>)}</div></Section>
    <Section eyebrow="04 / Education" title={t.education}><div className="education-grid"><article><p className="mono-label">Universidad Central de Chile</p><h3>Civil Engineering in Computing and Informatics</h3><p>{t.academicPending}</p><div className="tag-list">{['Algorithms', 'Java & OOP', 'Databases', 'Linux & Red Hat', 'Networking', 'Machine Learning', 'Arduino'].map((item) => <span key={item}>{item}</span>)}</div><p>{language === 'en' ? 'Teaching-assistant experience in Physics and Probability.' : 'Experiencia como ayudante en Física y Probabilidad.'}</p></article><article className="recognition-card"><p className="mono-label">Recognition · 2026</p><h3>NeuroFAST</h3><p>{language === 'en' ? 'Selected in the first national stage of the UDD Impacto Emprendedor 2026 competition and participated in formative activities. This does not mean the project won or has clinical validation.' : 'Seleccionado en la primera etapa nacional de Impacto Emprendedor UDD 2026 y participante en actividades formativas. Esto no significa que ganó ni que tenga validación clínica.'}</p><a className="text-link" href="#/projects/neurofast">{t.details}<ChevronRight size={15}/></a></article></div></Section>
    <Section id="skills" eyebrow="05 / Evidence map" title={t.skills}><div className="skills-grid">{skills.map(({ icon: Icon, ...skill }) => <article key={skill.title}><Icon/><p className="mono-label">{skill.scope}</p><h3>{skill.title}</h3><ul>{skill.items.map((item) => <li key={item}>{item}</li>)}</ul><div className="skill-links">{skill.links.map((slug) => <a key={slug} href={`#/projects/${slug}`}>{projects.find((project) => project.slug === slug)?.name}<ChevronRight size={13}/></a>)}</div></article>)}</div></Section>
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
  return <main id="main-content" className="page-main"><header className="page-hero"><p className="eyebrow">Resume library</p><h1>{t.resumeTitle}</h1><p>{t.resumeBody}</p></header><div className="resume-grid">{resumes.map((filename, index) => <article key={filename}><FileWarning/><p className="mono-label">{String(index + 1).padStart(2, '0')} · PDF</p><h2>{filename.replace('Sebastian_Astroza_CERN_', '').replace('_2026.pdf', '').replaceAll('_', ' ')}</h2><code>public/cv/{filename}</code><span className="unavailable"><FileWarning size={15}/>{t.unavailable}</span></article>)}</div><div className="resume-note"><Download/><div><h2>{language === 'en' ? 'Publication gate' : 'Gate de publicación'}</h2><p>{language === 'en' ? 'Before enabling a download, each PDF must exist, open successfully and be confirmed as the latest distributable version. Academic documents and references are available on request and are not published here.' : 'Antes de habilitar descargas, cada PDF debe existir, abrir correctamente y confirmarse como la versión distribuible más reciente. Documentos académicos y referencias están disponibles a solicitud y no se publican aquí.'}</p></div></div></main>
}

function Contact({ language }: { language: Language }) {
  const t = copy[language]
  return <section id="contact" className="contact-section"><div><p className="eyebrow">06 / Contact</p><h2>{t.contactTitle}</h2><p>{t.contactBody}</p></div><div className="contact-links"><a href="mailto:sebastroza10@gmail.com"><Mail/>Email</a><a href="https://github.com/sebastroza1" target="_blank" rel="noreferrer"><Github/>GitHub</a><a href="https://www.linkedin.com/in/sebastian-a-677745276/" target="_blank" rel="noreferrer"><Linkedin/>LinkedIn</a><a href="https://cert.efset.org/m27XNx" target="_blank" rel="noreferrer"><Languages/>EF SET C1</a></div></section>
}

function Footer({ language }: { language: Language }) {
  return <footer><div><b>Sebastián Andrés Astroza Aguayo</b><span>Early-Career Software Engineer · Santiago, Chile</span></div><p>{language === 'en' ? 'Independent portfolio. No affiliation with CERN is implied.' : 'Portafolio independiente. No implica afiliación con CERN.'}</p><span>© 2026</span></footer>
}

export default function App() {
  const route = useRoute()
  const { language, setLanguage, theme, setTheme } = usePreferences()
  useEffect(() => { if (!route.startsWith('/projects/')) document.title = 'Sebastián Astroza — Software Engineering Portfolio'; window.scrollTo({ top: 0 }) }, [route])
  const detail = route.startsWith('/projects/') ? projects.find((project) => project.slug === route.split('/')[2]) : undefined
  return <><Header language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme}/>{detail ? <ProjectDetail project={detail} language={language}/> : route === '/projects' ? <ProjectsPage language={language}/> : route === '/resume' ? <ResumePage language={language}/> : <HomePage language={language}/>}<Footer language={language}/></>
}

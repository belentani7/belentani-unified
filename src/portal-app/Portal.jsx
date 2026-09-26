import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Viewer from './Viewer.jsx'

const CosmicScene = lazy(() => import('./CosmicScene.jsx'))

const PAGE_SIZE = 8
const JUDAS_EXPERIENCE_URL = 'https://judas-experience-13898.buildaispace.app/Portal'
const EASTER_EGG_STORAGE_KEY = 'belentani-judas-frequency-easter-egg'
const STORY = [
  {
    id: 'betrayal', number: '01', name: 'Traición', signal: 'EL ALGORITMO DEL DOLOR', relic: 'key',
    description: 'Judas toma la Llave Dorada para forzar la evolución del Humano. El objeto cambia de manos; la voz, no.',
    trace: 'El núcleo pierde su forma estable. La fractura deja de ser ruido cuando alguien la registra.',
  },
  {
    id: 'frequency', number: '02', name: 'Frecuencia', signal: '432 Hz · SEÑAL, NO PROMESA MÉDICA', relic: 'planet',
    description: 'El dolor se muestrea, no se borra. La frecuencia raíz convierte una memoria aislada en una señal que puede compartirse.',
    trace: 'El Planeta Vivo respira con el núcleo: cada pulso deja una marca visible en sus venas.',
  },
  {
    id: 'hack', number: '03', name: 'Hackeo', signal: 'SANACIÓN CONCEPTUAL', relic: 'diamond',
    description: 'El acceso ocurre con permiso propio. La herida se parchea en producción y el sistema aprende a nombrar sus límites.',
    trace: 'El Diamante separa capas: refracción 2.417 como metáfora óptica, no como afirmación física del cristal CSS.',
  },
  {
    id: 'redemption', number: '04', name: 'Redención', signal: 'OMEGA · INTEGRACIÓN', relic: 'mirror',
    description: 'La redención no deshace la traición: la compila con lo aprendido. La cerradura se rediseña; ninguna página es terminal.',
    trace: 'Nexus conecta. Void conserva. Mirror devuelve la mirada al primer nodo: JUDAS-CORE-07.',
  },
]

const SIGNATURES = [
  { id: 'pedro', name: 'Pedro', role: 'La Roca', operation: 'Ancla', color: 'gold' },
  { id: 'marcos', name: 'Marcos', role: 'El Cronista', operation: 'Registra', color: 'cyan' },
  { id: 'santos', name: 'Santos', role: 'La Antena', operation: 'Recibe', color: 'red' },
  { id: 'belentani', name: 'Belentani', role: 'El Artefacto', operation: 'Transmuta', color: 'gold' },
  { id: 'human', name: 'The Human', role: 'La Interfaz', operation: 'Decide', color: 'cyan' },
]

const RELICS = [
  { id: 'key', name: 'Llave dorada', annotation: 'POSESIÓN ≠ ACCESO', code: 'R-01' },
  { id: 'planet', name: 'Planeta vivo', annotation: 'SEÑAL / 432', code: 'R-02' },
  { id: 'diamond', name: 'Diamante', annotation: 'CAPAS / IOR 2.417', code: 'R-03' },
  { id: 'mirror', name: 'Espejo Omega', annotation: 'NEXUS · VOID · MIRROR', code: 'R-04' },
]

// These documents exist in the curated source corpus; availability is still
// checked against the generated, privacy-filtered build index before opening.
const HIGHLIGHTS = [
  { path: '01-BELENTANI-Completo-v1-69KB.html', label: 'BELENTANI · La experiencia', tag: 'MANIFIESTO' },
  { path: '063_Ecosistema-Belentani-Omega.html', label: 'OMEGA · Ecosistema', tag: 'NODO 05' },
  { path: '02_mascara.html', label: 'La máscara · Identidad', tag: 'ARTEFACTO' },
  { path: '06-zion.html', label: 'Zion · Órbita', tag: 'DIMENSIÓN' },
]

function normalize(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function readDocumentHash() {
  const match = window.location.hash.match(/^#doc=(.+)$/)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

function safeDocumentPath(path) {
  if (typeof path !== 'string' || !path.endsWith('.html')) return false
  return path.split('/').every((part) => part && part !== '.' && part !== '..' && /^[\p{L}\p{N}_ .()-]+$/u.test(part))
}

export default function Portal() {
  const [pages, setPages] = useState([])
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [doc, setDoc] = useState(null)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const archiveOpenRef = useRef(false)
  const [phaseId, setPhaseId] = useState(STORY[0].id)
  const [relicId, setRelicId] = useState(STORY[0].relic)
  const [pulse, setPulse] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [easterEggVisible, setEasterEggVisible] = useState(false)
  const archiveCloseRef = useRef(null)
  const archiveTriggerRef = useRef(null)
  const archiveOpenerRef = useRef(null)
  const viewerReturnRef = useRef(null)
  const activePhase = STORY.find((item) => item.id === phaseId) || STORY[0]

  useEffect(() => {
    if (archiveOpen || doc) {
      setEasterEggVisible(false)
      return undefined
    }
    try {
      if (window.sessionStorage.getItem(EASTER_EGG_STORAGE_KEY) === 'shown') return undefined
    } catch {
      // Storage may be disabled; keep the experience functional for this visit.
    }

    let idleTimer = 0
    let dismissTimer = 0
    let shown = false
    const clearIdleTimer = () => window.clearTimeout(idleTimer)
    const armIdleTimer = () => {
      clearIdleTimer()
      if (shown || document.hidden) return
      idleTimer = window.setTimeout(() => {
        if (document.hidden) return
        shown = true
        try {
          window.sessionStorage.setItem(EASTER_EGG_STORAGE_KEY, 'shown')
        } catch {
          // The one-per-session guarantee degrades gracefully without storage.
        }
        setEasterEggVisible(true)
        dismissTimer = window.setTimeout(() => setEasterEggVisible(false), 2000)
      }, 30000)
    }
    const onActivity = () => armIdleTimer()
    const onVisibilityChange = () => document.hidden ? clearIdleTimer() : armIdleTimer()
    const activityEvents = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']
    activityEvents.forEach((eventName) => window.addEventListener(eventName, onActivity, { passive: true }))
    document.addEventListener('visibilitychange', onVisibilityChange)
    armIdleTimer()
    return () => {
      clearIdleTimer()
      window.clearTimeout(dismissTimer)
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, onActivity))
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [archiveOpen, doc])

  useEffect(() => {
    let alive = true
    fetch('search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error('Search index unavailable')
        return response.json()
      })
      .then((index) => {
        if (!alive) return
        const publicPages = Array.isArray(index.pages)
          ? index.pages.filter((entry) => entry && safeDocumentPath(entry.path) && typeof entry.title === 'string')
          : []
        setPages(publicPages)
        const requested = readDocumentHash()
        if (requested && publicPages.some((entry) => entry.path === requested)) {
          viewerReturnRef.current = archiveOpenRef.current ? archiveTriggerRef.current : document.activeElement
          setDoc(requested)
        } else if (requested) {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
          setAnnouncement('El enlace solicitado no pertenece al archivo público.')
        }
        setReady(true)
      })
      .catch(() => {
        if (!alive) return
        setLoadError(true)
        setDoc(null)
        const requested = readDocumentHash()
        if (requested) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
        setReady(true)
      })
    return () => { alive = false }
  }, [])

  const availablePaths = useMemo(() => new Set(pages.map((item) => item.path)), [pages])

  const openDocument = useCallback((path) => {
    if (!safeDocumentPath(path) || !availablePaths.has(path)) {
      setAnnouncement('Este documento no está publicado en el índice público. No se abrirá un archivo local.')
      return
    }
    viewerReturnRef.current = archiveOpenRef.current ? archiveTriggerRef.current : document.activeElement
    setArchiveOpen(false)
    window.location.hash = `doc=${encodeURIComponent(path)}`
    setDoc(path)
  }, [archiveOpen, availablePaths])

  const closeDocument = useCallback(() => {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    setDoc(null)
    viewerReturnRef.current = null
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const requested = readDocumentHash()
      if (!requested) {
        setDoc(null)
        return
      }
      if (ready && availablePaths.has(requested)) {
        if (!doc && !viewerReturnRef.current) viewerReturnRef.current = archiveOpenRef.current ? archiveTriggerRef.current : document.activeElement
        setDoc(requested)
        try {
          window.sessionStorage.setItem(EASTER_EGG_STORAGE_KEY, 'shown')
        } catch {
          // The session marker is optional; document navigation must still work.
        }
        setEasterEggVisible(false)
        setArchiveOpen(false)
      }
      else if (ready) {
        setDoc(null)
        viewerReturnRef.current = null
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
        setAnnouncement('El enlace solicitado no pertenece al archivo público.')
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [availablePaths, doc, ready])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = doc || archiveOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = previous }
  }, [archiveOpen, doc])

  useEffect(() => {
    if (!archiveOpen) return undefined
    archiveOpenRef.current = true
    archiveOpenerRef.current = document.activeElement
    archiveCloseRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setArchiveOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const dialog = document.querySelector('[data-archive-dialog]')
      const focusable = dialog ? [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]')] : []
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!dialog?.contains(document.activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      archiveOpenRef.current = false
      if (viewerReturnRef.current) return
      archiveOpenerRef.current?.focus?.()
      archiveOpenerRef.current = null
    }
  }, [archiveOpen])

  const filtered = useMemo(() => {
    const terms = normalize(query.trim()).split(/\s+/).filter(Boolean)
    if (!terms.length) return pages
    return pages.filter(({ title, path }) => {
      const searchable = normalize(`${title} ${path}`)
      return terms.every((term) => searchable.includes(term))
    })
  }, [pages, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visiblePages = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const selectPhase = (phase) => {
    setPhaseId(phase.id)
    setRelicId(phase.relic)
    setAnnouncement(`${phase.name}. ${phase.signal}. Enlace visual: ${phase.relic}.`)
  }

  const pulseCore = () => {
    setPulse((value) => value + 1)
    setAnnouncement('Pulso visual activado. 432 Hz es una convención narrativa, no una reproducción de audio.')
  }

  const curatedDocuments = HIGHLIGHTS.filter(({ path }) => availablePaths.has(path))

  return (
    <div className={`experience phase-${activePhase.id}`}>
      <div className="world-canvas" aria-hidden="true">
        <Suspense fallback={<div className="cosmic-fallback" />}>
          <CosmicScene phase={phaseId} relic={relicId} pulse={pulse} suspended={archiveOpen || Boolean(doc)} />
        </Suspense>
      </div>
      <div className="world-vignette" aria-hidden="true" />
      <div className="world-grain" aria-hidden="true" />
      {easterEggVisible && (
        <div className="easter-echo" aria-hidden="true">
          <span>THIS IS NOT A WEBSITE.</span>
          <span>THIS IS A FREQUENCY.</span>
        </div>
      )}

      <header className="topbar">
        <a className="brand" href="#top" aria-label="BELENTANI, volver al inicio">
          <span className="brand-sigil" aria-hidden="true">B</span>
          <span>BELENTANI<span className="brand-slash"> / </span>OMEGA</span>
        </a>
        <nav className="top-nav" aria-label="Navegación del archivo">
          <a href="#chronicle">CRÓNICA</a>
          <a href="#signatures">CINCO FIRMAS</a>
          <button ref={archiveTriggerRef} type="button" onClick={() => setArchiveOpen(true)}>
            ARCHIVO <span aria-hidden="true">↗</span>
          </button>
        </nav>
      </header>

      <main id="top" className="command-center">
        <section className="narrative" id="chronicle" aria-labelledby="hero-title">
          <p className="eyebrow"><span className="live-dot" /> JUDAS-CORE-07 <span className="eyebrow-divider">/</span> ZION ORBIT</p>
          <h1 id="hero-title">La herida<br />no fue el final<br /><em>del código.</em></h1>
          <p className="hero-copy">La Llave Dorada cambió de manos. La voz no. Cuatro señales convierten el archivo de una traición en una arquitectura para seguir creando.</p>

          <div className="phase-readout">
            <span className="readout-index">{activePhase.number} / 04</span>
            <div>
              <p className="readout-signal">{activePhase.signal}</p>
              <p className="readout-copy">{activePhase.description}</p>
            </div>
          </div>

          <div className="phase-rail" role="group" aria-label="Las cuatro gemas de la crónica">
            {STORY.map((phase) => (
              <button
                type="button"
                key={phase.id}
                className={`phase-stop${phase.id === phaseId ? ' is-active' : ''}`}
                aria-pressed={phase.id === phaseId}
                onClick={() => selectPhase(phase)}
              >
                <span className="phase-index">{phase.number}</span>
                <span>{phase.name}</span>
              </button>
            ))}
          </div>

          <div className="hero-actions">
            <a
              className="judas-feature"
              href={JUDAS_EXPERIENCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir JUDAS EXPERIENCE, experiencia artística en vivo, en una pestaña nueva"
            >
              <span className="feature-sigil" aria-hidden="true">◈</span>
              <span className="feature-copy"><small>MUSICAL OPERATING SYSTEM · INTERACTIVE ART</small><strong>JUDAS EXPERIENCE</strong></span>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </a>
            <button className="button-primary" type="button" onClick={pulseCore} aria-label="Activar un pulso visual; 432 Hz es una convención narrativa, no audio">
              <span className="pulse-icon" aria-hidden="true">◉</span> PULSAR EL NÚCLEO <span className="pulse-frequency" aria-hidden="true">432</span>
            </button>
            <button className="button-quiet" type="button" onClick={() => setArchiveOpen(true)}>
              ABRIR ARCHIVO <span aria-hidden="true">↗</span>
            </button>
          </div>
          <p className="phase-trace"><span>REGISTRO ACTIVO</span>{activePhase.trace}</p>
        </section>

        <section className="relic-field" aria-label="Mapa de reliquias: seleccionar cambia el foco de la escena 3D">
          <div className="relic-caption"><span>FIG. 01—04</span><span>MAPA DE MEMORIA / ZION</span></div>
          <div className={`orbital-map focus-${relicId}`}>
            <span className="orbit orbit-a" aria-hidden="true" />
            <span className="orbit orbit-b" aria-hidden="true" />
            <span className="orbit orbit-c" aria-hidden="true" />
            <span className="planet-aura" aria-hidden="true" />
            <span className="relic-core-label"><span className="core-indicator" /> NÚCLEO VIVO <small>432 · SEÑAL ESTABLE</small></span>
            {RELICS.map((relic, index) => (
              <button
                type="button"
                key={relic.id}
                className={`relic-point relic-point-${relic.id}${relicId === relic.id ? ' is-focused' : ''}`}
                aria-pressed={relicId === relic.id}
                aria-label={`Enfocar reliquia ${relic.name}: ${relic.annotation}`}
                onClick={() => {
                  setRelicId(relic.id)
                  const linkedPhase = STORY.find((item) => item.relic === relic.id)
                  if (linkedPhase) setPhaseId(linkedPhase.id)
                  setAnnouncement(`${relic.name} seleccionado. ${relic.annotation}.`)
                }}
              >
                <span className="point-index">{relic.code}</span>
                <span className="point-name">{relic.name}</span>
                <span className="point-note">{relic.annotation}</span>
                <span className="point-beacon" aria-hidden="true">{index === 0 ? '◈' : index === 1 ? '◉' : index === 2 ? '◇' : '◎'}</span>
              </button>
            ))}
            <span className="map-crosshair" aria-hidden="true">×</span>
          </div>
          <div className="relic-footnote"><span>INTERFAZ / 3D PROCEDURAL</span><span>HOVER · CLICK · TECLADO</span></div>
        </section>

        <section className="signature-band" id="signatures" aria-labelledby="signatures-title">
          <div className="signature-heading">
            <span className="signature-overline">PROTOCOLO DE IDENTIDAD</span>
            <h2 id="signatures-title">Cinco firmas. <span>Una memoria.</span></h2>
          </div>
          <div className="signature-list">
            {SIGNATURES.map((signature, index) => (
              <div className={`signature signature-${signature.color}`} key={signature.id}>
                <span className="signature-number">0{index + 1}</span>
                <span className="signature-name">{signature.name}</span>
                <span className="signature-role">{signature.role}</span>
                <span className="signature-operation">{signature.operation}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="statusbar">
        <span><i className="status-led" /> OMEGA_CLEAN <span className="status-muted">/ ESTADO NARRATIVO</span></span>
        <span className="status-equation">TRAICIÓN <b>→</b> DATO <b>→</b> VOZ <b>→</b> OBRA</span>
        <a href="https://github.com/belentani7" target="_blank" rel="noopener noreferrer">BELENTANI7 ↗</a>
      </footer>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>

      {archiveOpen && (
        <div
          className="archive-overlay"
          onPointerDown={(event) => { if (event.target === event.currentTarget) setArchiveOpen(false) }}
        >
          <section className="archive-dialog" data-archive-dialog role="dialog" aria-modal="true" aria-labelledby="archive-title" onPointerDown={(event) => event.stopPropagation()}>
            <div className="archive-head">
              <div>
                <p className="eyebrow">NEXUS / BIBLIOTECA DE FUENTES</p>
                <h2 id="archive-title">El archivo <em>respira.</em></h2>
              </div>
              <button ref={archiveCloseRef} className="archive-close" type="button" aria-label="Cerrar archivo" onClick={() => setArchiveOpen(false)}>×</button>
            </div>
            <p className="archive-intro">Documentos reales del corpus, servidos desde el índice público filtrado. Buscar por título o nombre de archivo; abrir conserva esta experiencia.</p>
            <label className="archive-search-label" htmlFor="archive-search">BUSCAR EL REGISTRO</label>
            <div className="archive-search-row">
              <input
                id="archive-search"
                className="archive-search"
                type="search"
                value={query}
                placeholder="Llave, Zion, frecuencia…"
                onChange={(event) => { setQuery(event.target.value); setPage(1) }}
              />
              <span className="archive-count" role="status">{ready ? `${filtered.length} registros` : 'cargando…'}</span>
            </div>
            {loadError && <p className="archive-message">El índice no está disponible todavía. Genera search-index.json con el script oficial del portal.</p>}
            {!loadError && curatedDocuments.length > 0 && query.length === 0 && (
              <div className="curated-records" aria-label="Registros esenciales">
                {curatedDocuments.map((item) => (
                  <button type="button" key={item.path} onClick={() => openDocument(item.path)}>
                    <span>{item.tag}</span><strong>{item.label}</strong><i aria-hidden="true">↗</i>
                  </button>
                ))}
              </div>
            )}
            <div className="archive-results" aria-label="Resultados de búsqueda">
              {visiblePages.map((entry) => (
                <button type="button" key={entry.path} onClick={() => openDocument(entry.path)}>
                  <span>{entry.title}</span><small>{entry.path}</small><i aria-hidden="true">↗</i>
                </button>
              ))}
              {ready && !loadError && visiblePages.length === 0 && <p className="archive-message">Sin coincidencias. Prueba otra coordenada.</p>}
            </div>
            {pageCount > 1 && (
              <nav className="archive-pager" aria-label="Páginas del archivo">
                <button type="button" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>← ANTERIOR</button>
                <span>{String(currentPage).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
                <button type="button" disabled={currentPage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>SIGUIENTE →</button>
              </nav>
            )}
            <p className="archive-privacy">Los archivos no se ejecutan en el portal. Se muestran en un visor aislado, con ruta validada contra el índice publicado.</p>
          </section>
        </div>
      )}

      <Viewer path={doc} onClose={closeDocument} returnFocusRef={viewerReturnRef} />
    </div>
  )
}

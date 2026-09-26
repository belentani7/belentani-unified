import { useState, useEffect, useMemo, useCallback } from 'react'
import CosmicScene from './CosmicScene.jsx'
import Viewer from './Viewer.jsx'

const PER_PAGE = 10

// Real documents from the public index — the substance, not decoration.
const HIGHLIGHTS = [
  { path: '01-BELENTANI-Completo-v1-69KB.html', label: 'La experiencia completa' },
  { path: '063_Ecosistema-Belentani-Omega.html', label: 'El núcleo Omega' },
  { path: '02_mascara.html', label: 'La máscara' },
]

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function readHash() {
  const m = window.location.hash.match(/^#doc=(.+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

export default function Portal() {
  const [pages, setPages] = useState([])
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [doc, setDoc] = useState(() => readHash())

  // Deep-link: opening a document sets the hash; closing clears it.
  useEffect(() => {
    const onHash = () => setDoc(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openDoc = useCallback((path) => {
    window.location.hash = `doc=${encodeURIComponent(path)}`
  }, [])

  const closeDoc = useCallback(() => {
    history.pushState(null, '', window.location.pathname)
    setDoc(null)
  }, [])

  useEffect(() => {
    let alive = true
    fetch('search-index.json')
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return
        setPages(d.pages || [])
        setReady(true)
      })
      .catch(() => setReady(false))
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return pages
    const terms = q.split(/\s+/)
    return pages.filter((p) => {
      const hay = normalize(`${p.title} ${p.path}`)
      return terms.every((t) => hay.includes(t))
    })
  }, [pages, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = page > pageCount ? 1 : page
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  // Freeze page scroll while the viewer is open
  useEffect(() => {
    document.body.style.overflow = doc ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [doc])

  return (
    <div className="portal">
      <div className="cosmos" aria-hidden="true">
        <CosmicScene />
      </div>

      {/* The window — the only loud element on the page */}
      <header className="window" id="top">
        <h1 className="word">JUDAS</h1>
        <p className="motto">La traición como arte supremo</p>
      </header>

      <main>
        {/* The library — documents open INSIDE the app */}
        <section className="library" aria-label="Biblioteca">
          <div className="searchline">
            <input
              className="search"
              type="search"
              value={query}
              placeholder="Buscar en la biblioteca…"
              aria-label="Buscar en la biblioteca"
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
            />
            <p className="count" role="status">
              {ready ? `${filtered.length} documentos` : '…'}
            </p>
          </div>

          {query === '' && (
            <div className="into">
              {HIGHLIGHTS.map((h) => (
                <button
                  key={h.path}
                  type="button"
                  className="door"
                  onClick={() => openDoc(h.path)}
                >
                  {h.label}
                </button>
              ))}
            </div>
          )}

          <div className="results">
            {slice.map((p) => (
              <button
                key={p.path}
                type="button"
                className="hit"
                onClick={() => openDoc(p.path)}
              >
                {p.title}
              </button>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="pager" role="navigation" aria-label="Paginación">
              {Array.from({ length: Math.min(7, pageCount) }, (_, i) => {
                const from = Math.max(1, Math.min(current - 3, pageCount - 6))
                return from + i
              })
                .filter((n) => n >= 1 && n <= pageCount)
                .map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-current={n === current}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>
          <a href="https://github.com/belentani7">github.com/belentani7</a>
          <span className="sep"> — </span>432 Hz
        </p>
      </footer>

      <Viewer path={doc} onClose={closeDoc} />
    </div>
  )
}

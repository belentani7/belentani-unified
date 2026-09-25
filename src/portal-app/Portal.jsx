import { useState, useEffect, useMemo } from 'react'
import CosmicScene from './CosmicScene.jsx'

const PER_PAGE = 10

// Real documents from the public index — the substance, not decoration.
const HIGHLIGHTS = [
  { path: '077_Proyecto-Belentani-Completo.html', label: 'La experiencia completa' },
  { path: '078_Proyecto-Belentani-Completo.html', label: 'El núcleo Omega' },
  { path: '079_Proyecto-Belentani-Completo.html', label: 'Eras y gemas' },
]

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Portal() {
  const [pages, setPages] = useState([])
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

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
        {/* The library — the actual substance of the universe */}
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
              <a className="door" href={`html-source/${encodeURIComponent(HIGHLIGHTS[0].path)}`}>
                {HIGHLIGHTS[0].label}
              </a>
              <a className="door" href={`html-source/${encodeURIComponent(HIGHLIGHTS[1].path)}`}>
                {HIGHLIGHTS[1].label}
              </a>
              <a className="door" href={`html-source/${encodeURIComponent(HIGHLIGHTS[2].path)}`}>
                {HIGHLIGHTS[2].label}
              </a>
            </div>
          )}

          <div className="results">
            {slice.map((p) => (
              <a key={p.path} className="hit" href={`html-source/${encodeURIComponent(p.path)}`}>
                {p.title}
              </a>
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
    </div>
  )
}

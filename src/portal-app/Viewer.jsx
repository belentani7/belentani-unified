import { useEffect, useState } from 'react'

/**
 * Viewer — opens a library document INSIDE the app.
 * Full-screen immersive layer: the cosmos frame stays around the document,
 * Escape closes it, and the URL deep-links (#doc=path) so any page is
 * addressable without leaving the universe.
 */
export default function Viewer({ path, onClose }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!path) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [path, onClose])

  if (!path) return null

  return (
    <div className="viewer" role="dialog" aria-label="Visor de documento">
      <div className="viewer-bar">
        <span className="v-title" title={decodeURIComponent(path)}>
          {decodeURIComponent(path).replace(/\.html$/, '').replace(/^.{15}(.*)/, '…$1')}
        </span>
        <button type="button" className="v-close" onClick={onClose} aria-label="Cerrar documento">
          ✕ cerrar
        </button>
      </div>
      {!loaded && <div className="v-loading">Compilando el documento…</div>}
      <iframe
        src={`html-source/${path}`}
        title={decodeURIComponent(path)}
        onLoad={() => setLoaded(true)}
        className="v-frame"
        sandbox="allow-same-origin allow-popups"
      />
    </div>
  )
}

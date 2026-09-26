import { useEffect, useMemo, useRef, useState } from 'react'

/** Opens a privacy-filtered archive document in the isolated in-app viewer. */
export default function Viewer({ path, onClose, returnFocusRef }) {
  const [loaded, setLoaded] = useState(false)
  const closeRef = useRef(null)
  const iframeRef = useRef(null)
  const previousFocusRef = useRef(null)

  const decodedPath = useMemo(() => {
    try {
      return decodeURIComponent(path || '')
    } catch {
      return path || ''
    }
  }, [path])

  const validPath = typeof path === 'string'
    && path.endsWith('.html')
    && path.split('/').every((part) => part && part !== '.' && part !== '..' && /^[\p{L}\p{N}_ .()-]+$/u.test(part))
  const safePath = validPath ? path.split('/').map(encodeURIComponent).join('/') : ''

  useEffect(() => {
    if (!path) return undefined
    const returnTarget = returnFocusRef?.current || previousFocusRef.current || document.activeElement
    previousFocusRef.current = returnTarget
    if (returnFocusRef) returnFocusRef.current = null
    closeRef.current?.focus()
    return () => {
      previousFocusRef.current = null
      if (returnTarget instanceof HTMLElement && returnTarget.isConnected) returnTarget.focus()
    }
  }, [path, returnFocusRef])

  useEffect(() => setLoaded(false), [path])

  useEffect(() => {
    if (!path) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'Tab' && event.shiftKey && document.activeElement === closeRef.current) {
        event.preventDefault()
        iframeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [path, onClose])

  useEffect(() => {
    if (!path || !loaded) return undefined
    const frameDocument = iframeRef.current?.contentDocument
    if (!frameDocument) return undefined
    const onFrameKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const focusable = [...frameDocument.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.offsetParent !== null)
      const first = focusable[0]
      const last = focusable.at(-1)
      const active = frameDocument.activeElement
      const atBoundary = event.shiftKey
        ? !focusable.length || active === first || active === frameDocument.body
        : !focusable.length || active === last
      if (atBoundary) {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    frameDocument.addEventListener('keydown', onFrameKeyDown)
    return () => frameDocument.removeEventListener('keydown', onFrameKeyDown)
  }, [path, loaded])

  if (!path) return null

  if (!validPath) {
    return (
      <div className="viewer" role="dialog" aria-modal="true" aria-labelledby="viewer-error-title">
        <div className="viewer-bar">
          <span id="viewer-error-title" className="v-title">ARCHIVO NO DISPONIBLE</span>
          <button ref={closeRef} type="button" className="v-close" onClick={onClose} aria-label="Cerrar documento">× cerrar</button>
        </div>
        <p className="archive-message">La ruta solicitada no es un documento HTML permitido.</p>
      </div>
    )
  }

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-labelledby="viewer-title">
      <div className="viewer-bar">
        <span id="viewer-title" className="v-title" title={decodedPath}>
          {decodedPath.replace(/\.html$/, '').replace(/^.{15}(.*)/, '…$1')}
        </span>
        <button ref={closeRef} type="button" className="v-close" onClick={onClose} aria-label="Cerrar documento">× cerrar</button>
      </div>
      {!loaded && <div className="v-loading" role="status">Compilando el documento…</div>}
      <iframe
        ref={iframeRef}
        src={`html-source/${safePath}`}
        title={decodedPath}
        onLoad={() => setLoaded(true)}
        className="v-frame"
        sandbox="allow-same-origin allow-popups"
      />
    </div>
  )
}

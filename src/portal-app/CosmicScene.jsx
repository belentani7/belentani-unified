import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * CosmicScene — full-viewport deep-space backdrop.
 * Layered nebula glow (canvas-generated sprites) + drifting star field,
 * with a subtle mouse parallax. Honors prefers-reduced-motion (static frame).
 */
export default function CosmicScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120)
    camera.position.z = 14

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // ── Canvas-generated nebula sprites (soft radial glow) ──
    const makeGlowTexture = (inner, outer) => {
      const c = document.createElement('canvas')
      c.width = 256
      c.height = 256
      const ctx = c.getContext('2d')
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      g.addColorStop(0, inner)
      g.addColorStop(0.45, outer)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
      return new THREE.CanvasTexture(c)
    }

    const nebulaDefs = [
      { x: -7, y: 3.5, z: -12, s: 26, tex: makeGlowTexture('rgba(255,45,85,0.55)', 'rgba(120,10,40,0.22)') },
      { x: 8, y: -2, z: -16, s: 30, tex: makeGlowTexture('rgba(157,0,255,0.34)', 'rgba(60,0,110,0.16)') },
      { x: 5, y: 5, z: -20, s: 24, tex: makeGlowTexture('rgba(0,229,255,0.30)', 'rgba(0,70,110,0.14)') },
      { x: -3, y: -5, z: -10, s: 20, tex: makeGlowTexture('rgba(255,140,60,0.20)', 'rgba(120,50,10,0.10)') },
    ]

    const nebulas = nebulaDefs.map((n) => {
      const spr = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: n.tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      spr.position.set(n.x, n.y, n.z)
      spr.scale.set(n.s, n.s, 1)
      scene.add(spr)
      return spr
    })

    // ── Star field ──
    const starCount = 1400
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 70
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xdfe8ff, size: 0.09, transparent: true, opacity: 0.85, sizeAttenuation: true }),
    )
    scene.add(stars)

    // ── Mouse parallax (gentle) ──
    const target = { x: 0, y: 0 }
    const onMouse = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 1.4
      target.y = -(e.clientY / window.innerHeight - 0.5) * 0.9
    }
    window.addEventListener('mousemove', onMouse)

    let raf = 0
    const clock = new THREE.Clock()

    const renderFrame = () => {
      const t = clock.getElapsedTime()
      stars.rotation.y = t * 0.008
      nebulas.forEach((s, i) => {
        s.position.x += Math.sin(t * 0.05 + i * 1.7) * 0.002
        s.material.rotation = t * 0.01 * (i % 2 ? 1 : -1)
      })
      camera.position.x += (target.x - camera.position.x) * 0.04
      camera.position.y += (target.y - camera.position.y) * 0.04
      camera.lookAt(0, 0, -6)
      renderer.render(scene, camera)
    }

    if (reduced) {
      renderFrame()
    } else {
      const loop = () => {
        renderFrame()
        raf = requestAnimationFrame(loop)
      }
      loop()
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      renderer.dispose()
      starGeo.dispose()
      nebulas.forEach((s) => {
        s.material.map.dispose()
        s.material.dispose()
      })
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="cosmic-scene" ref={mountRef} aria-hidden="true" />
}

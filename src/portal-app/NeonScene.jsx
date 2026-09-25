import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * NeonScene — animated Three.js backdrop for the hero.
 * A rotating wireframe icosahedron with neon red/cyan glow particles,
 * tuned for `prefers-reduced-motion` (renders a static frame instead).
 */
export default function NeonScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Core: wireframe icosahedron (the "caos compilado")
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.2, 1),
      new THREE.MeshBasicMaterial({
        color: 0xff2d55,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    )
    scene.add(core)

    // Inner cyan nucleus
    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 2),
      new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      }),
    )
    scene.add(nucleus)

    // Neon dust particles
    const count = 220
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 16
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0x00e5ff,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
      }),
    )
    scene.add(dust)

    let raf = 0
    const clock = new THREE.Clock()

    const renderFrame = () => {
      const t = clock.getElapsedTime()
      core.rotation.y = t * 0.12
      core.rotation.x = Math.sin(t * 0.2) * 0.25
      nucleus.rotation.y = -t * 0.2
      nucleus.rotation.z = t * 0.1
      dust.rotation.y = t * 0.03
      renderer.render(scene, camera)
    }

    if (reduced) {
      renderFrame() // single static frame, no loop
    } else {
      const loop = () => {
        renderFrame()
        raf = requestAnimationFrame(loop)
      }
      loop()
    }

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      core.geometry.dispose()
      nucleus.geometry.dispose()
      dustGeometry.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="neon-scene" ref={mountRef} />
}

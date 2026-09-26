import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PHASES = {
  betrayal: [1, 0, 0, 0],
  frequency: [0.48, 0.78, 0, 0],
  hack: [0.12, 0.38, 0, 0.9],
  redemption: [0.06, 0.44, 1, 0.12],
}
const RELICS = ['key', 'planet', 'diamond', 'mirror']

const FULLSCREEN_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Original accretion-field shader: memory is a turbulent stream, not a starfield.
// Four bounded noise octaves, deterministic flecks and lore-driven color states.
const FIELD_FRAGMENT = `
  precision highp float;
  uniform float uTime;
  uniform float uRed;
  uniform float uCyan;
  uniform float uGold;
  uniform float uViolet;
  uniform float uPulse;
  uniform float uPulseId;
  uniform float uFocus;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uCenter;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
               mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise2(p);
      p = turn * p * 2.03 + 17.4;
      amplitude *= 0.49;
    }
    return value;
  }
  void main() {
    vec2 p = vUv - uCenter;
    float aspect = uResolution.x / max(1.0, uResolution.y);
    p.x *= aspect;
    vec2 pointer = (uPointer - uCenter) * vec2(aspect, 1.0);
    float time = uTime * 0.035;
    float field = fbm(p * 2.5 + vec2(time * 0.55, -time * 0.2));
    field += 0.31 * fbm(p * 5.0 - vec2(time * 0.12, time * 0.3));
    float warped = fbm(p * 1.8 + vec2(field, -field) + pointer * 0.07);
    float radius = length(p);
    float cloud = smoothstep(0.27, 0.88, field + warped * 0.22 - radius * 0.1);
    float angle = atan(p.y, p.x);
    float disk = (1.0 - smoothstep(0.012, 0.2, abs(p.y + p.x * 0.22 + sin(angle * 3.0 + time) * 0.012)))
      * (1.0 - smoothstep(0.42, 0.86, radius));
    float ringRadius = 0.31 + 0.018 * sin(time * 0.6);
    float orbit = 1.0 - smoothstep(0.006, 0.023, abs(length(p * vec2(1.0, 1.27)) - ringRadius));
    float focusSignal = 0.45 + mod(uFocus, 4.0) * 0.1;
    float pulseAge = max(0.0, uTime - uPulse);
    float pulseEnvelope = (1.0 - smoothstep(1.55, 1.9, pulseAge)) * step(0.0, uPulseId);
    float pulseWave = exp(-abs(radius - pulseAge * 0.19) * 15.0);
    float pulse = (pulseWave + exp(-radius * 5.0) * exp(-pulseAge * 1.8)) * pulseEnvelope * step(0.0, uPulse);
    float breathing = 0.68 + 0.32 * sin(uTime * 0.52 + field * 7.0);
    vec3 red = vec3(1.0, 0.012, 0.09);
    vec3 cyan = vec3(0.10, 0.77, 0.88);
    vec3 gold = vec3(1.0, 0.66, 0.24);
    vec3 violet = vec3(0.58, 0.34, 1.0);
    vec3 phaseColor = red * uRed + cyan * uCyan + gold * uGold + violet * uViolet;
    vec3 color = vec3(0.0015, 0.0012, 0.004);
    color += phaseColor * cloud * (0.028 + 0.12 * breathing);
    color += red * disk * (0.018 + 0.05 * breathing);
    color += mix(cyan, gold, uGold) * orbit * (0.006 + 0.017 * focusSignal);
    color += phaseColor * pulse * 0.18;
    vec2 starCell = floor(vec2(vUv.x * aspect, vUv.y) * 180.0);
    float star = step(0.9975, hash21(starCell));
    color += vec3(0.58, 0.69, 0.78) * star * 0.36;
    float vignette = 0.42 + 0.58 * (1.0 - smoothstep(0.22, 1.08, dot(p, p) * 1.5));
    gl_FragColor = vec4(color * vignette, 1.0);
  }
`

const PLANET_VERTEX = `
  uniform float uTime;
  varying vec3 vObjectPosition;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying float vTerrain;
  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash31(i);
    float b = hash31(i + vec3(1.0, 0.0, 0.0));
    float c = hash31(i + vec3(0.0, 1.0, 0.0));
    float d = hash31(i + vec3(1.0, 1.0, 0.0));
    float e = hash31(i + vec3(0.0, 0.0, 1.0));
    float f1 = hash31(i + vec3(1.0, 0.0, 1.0));
    float g = hash31(i + vec3(0.0, 1.0, 1.0));
    float h = hash31(i + vec3(1.0, 1.0, 1.0));
    return mix(mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
               mix(mix(e, f1, f.x), mix(g, h, f.x), f.y), f.z);
  }
  float terrain(vec3 p) {
    float n = 0.56 * noise3(p * 3.1 + vec3(uTime * 0.018, -uTime * 0.011, 0.0));
    n += 0.29 * noise3(p * 7.3 - vec3(0.0, uTime * 0.024, uTime * 0.012));
    n += 0.15 * noise3(p * 15.5 + vec3(uTime * 0.01));
    return n;
  }
  void main() {
    vec3 direction = normalize(position);
    float height = terrain(direction);
    float breath = sin(uTime * 0.65 + height * 9.0) * 0.012;
    vec3 displaced = position + normal * ((height - 0.5) * 0.11 + breath);
    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vObjectPosition = direction;
    vTerrain = height;
    vWorldPosition = world.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

// Inspired by local source geometry and lore, but written as a new shader path.
const PLANET_FRAGMENT = `
  precision highp float;
  uniform float uTime;
  uniform float uRed;
  uniform float uCyan;
  uniform float uGold;
  uniform float uViolet;
  uniform float uFocus;
  uniform float uPulse;
  uniform float uPulseId;
  varying vec3 vObjectPosition;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying float vTerrain;
  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash31(i);
    float b = hash31(i + vec3(1.0, 0.0, 0.0));
    float c = hash31(i + vec3(0.0, 1.0, 0.0));
    float d = hash31(i + vec3(1.0, 1.0, 0.0));
    float e = hash31(i + vec3(0.0, 0.0, 1.0));
    float f1 = hash31(i + vec3(1.0, 0.0, 1.0));
    float g = hash31(i + vec3(0.0, 1.0, 1.0));
    float h = hash31(i + vec3(1.0, 1.0, 1.0));
    return mix(mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
               mix(mix(e, f1, f.x), mix(g, h, f.x), f.y), f.z);
  }
  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float surface = vTerrain;
    float detail = noise3(vObjectPosition * 22.0 + vec3(0.0, uTime * 0.018, 0.0));
    float land = smoothstep(0.49, 0.58, surface + (detail - 0.5) * 0.12);
    float veinsWave = abs(sin((surface * 24.0 + detail * 7.0 + uTime * 0.08) * 3.14159));
    float veins = (1.0 - smoothstep(0.94, 0.995, veinsWave)) * smoothstep(0.48, 0.67, surface);
    float fineVeins = (1.0 - smoothstep(0.972, 0.999, abs(sin((detail * 18.0 + surface * 12.0) * 3.14159)))) * veins;
    float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);
    float light = 0.22 + 0.78 * max(dot(normal, normalize(vec3(-0.5, 0.65, 0.8))), 0.0);
    float breathe = 0.72 + 0.28 * sin(uTime * 0.72 + surface * 14.0);
    vec3 red = vec3(1.0, 0.008, 0.075);
    vec3 cyan = vec3(0.12, 0.82, 0.9);
    vec3 gold = vec3(1.0, 0.68, 0.25);
    vec3 violet = vec3(0.59, 0.39, 1.0);
    vec3 phaseColor = red * uRed + cyan * uCyan + gold * uGold + violet * uViolet;
    vec3 ocean = vec3(0.002, 0.008, 0.015);
    vec3 landColor = mix(vec3(0.075, 0.009, 0.022), vec3(0.12, 0.065, 0.025), uGold);
    vec3 base = mix(ocean, landColor, land);
    float pulseAge = max(0.0, uTime - uPulse);
    float pulse = exp(-pulseAge * 2.0) * (1.0 - smoothstep(1.55, 1.9, pulseAge))
      * step(0.0, uPulse) * step(0.0, uPulseId);

    vec3 emission = red * uRed * veins * (0.45 + breathe * 1.5);
    emission += phaseColor * fineVeins * (0.12 + uFocus * 0.08);
    emission += cyan * pow(abs(vObjectPosition.y), 6.0) * uCyan * 0.12;
    emission += gold * veins * uGold * 0.5;
    emission += phaseColor * pulse * 0.34;
    gl_FragColor = vec4(base * light + emission + phaseColor * rim * 0.42, 1.0);
  }
`

const ATMOSPHERE_FRAGMENT = `
  precision highp float;
  uniform float uTime;
  uniform float uRed;
  uniform float uCyan;
  uniform float uGold;
  uniform float uViolet;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(normalize(vWorldNormal), viewDir)), 2.15);
    vec3 phase = vec3(1.0, 0.018, 0.08) * uRed
      + vec3(0.12, 0.78, 0.9) * uCyan
      + vec3(1.0, 0.63, 0.22) * uGold
      + vec3(0.56, 0.32, 1.0) * uViolet;
    float breath = 0.78 + 0.22 * sin(uTime * 0.48);
    gl_FragColor = vec4(phase * fresnel * 0.58, fresnel * 0.36 * breath);
  }
`

export default function CosmicScene({ phase = 'betrayal', relic = 'key', pulse = 0, suspended = false }) {
  const mountRef = useRef(null)
  const sceneStateRef = useRef(null)
  const lastPulseRef = useRef(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    let reducedMotion = motionPreference.matches
    let disposed = false
    let visible = true
    let animationSuspended = suspended
    let frameId = 0
    let pixelRatio = 1
    let worldTime = 0
    let lastFrameTimestamp = 0
    let phaseChangedAt = 0
    let pulseStartedAt = -Infinity
    let pulseId = 0
    let lastRenderTime = 0
    let focusedRelic = relic
    const phaseProgress = new THREE.Vector4(1, 0, 0, 0)
    const phaseStart = new THREE.Vector4(1, 0, 0, 0)
    const targetPhase = new THREE.Vector4(1, 0, 0, 0)
    const pointer = new THREE.Vector2(0.72, 0.51)
    const targetPointer = new THREE.Vector2(0.72, 0.51)
    const geometries = new Set()
    const materials = new Set()
    const relicModels = []
    const scaleActors = []
    const relicMap = mount.closest('.experience')?.querySelector('.orbital-map')

    const scene = new THREE.Scene()
    const keyLight = new THREE.DirectionalLight(0xffc783, 2.0)
    const redFill = new THREE.DirectionalLight(0x9e2745, 1.2)
    scene.add(keyLight, keyLight.target, redFill, redFill.target)
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000)
    camera.position.set(0, 0, 500)
    camera.lookAt(0, 0, 0)

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, powerPreference: 'low-power' })
    } catch {
      mount.dataset.webgl = 'unavailable'
      return undefined
    }
    renderer.setClearColor(0x030305, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.dataset.webgl = 'ready'
    mount.appendChild(renderer.domElement)

    const addGeometry = (geometry) => {
      geometries.add(geometry)
      return geometry
    }
    const addMaterial = (material) => {
      materials.add(material)
      return material
    }
    const uniforms = {
      uTime: { value: 0 },
      uRed: { value: phaseProgress.x },
      uCyan: { value: phaseProgress.y },
      uGold: { value: phaseProgress.z },
      uViolet: { value: phaseProgress.w },
      uPulse: { value: -100 },
      uPulseId: { value: 0 },
      uFocus: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.72, 0.51) },
      uCenter: { value: new THREE.Vector2(0.72, 0.51) },
    }
    const fieldMaterial = addMaterial(new THREE.ShaderMaterial({
      uniforms,
      vertexShader: FULLSCREEN_VERTEX,
      fragmentShader: FIELD_FRAGMENT,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }))
    const field = new THREE.Mesh(addGeometry(new THREE.PlaneGeometry(1, 1)), fieldMaterial)
    field.position.z = -300
    field.renderOrder = -1000
    field.frustumCulled = false
    scene.add(field)

    const planetUniforms = {
      uTime: uniforms.uTime,
      uRed: uniforms.uRed,
      uCyan: uniforms.uCyan,
      uGold: uniforms.uGold,
      uViolet: uniforms.uViolet,
      uPulse: uniforms.uPulse,
      uPulseId: uniforms.uPulseId,
      uFocus: uniforms.uFocus,
    }
    const planet = new THREE.Mesh(
      addGeometry(new THREE.IcosahedronGeometry(1, 4)),
      addMaterial(new THREE.ShaderMaterial({ uniforms: planetUniforms, vertexShader: PLANET_VERTEX, fragmentShader: PLANET_FRAGMENT })),
    )
    planet.userData.relic = 'planet'
    planet.userData.baseRotation = planet.rotation.z
    scene.add(planet)
    relicModels.push(planet)
    scaleActors.push(planet)

    const atmosphereVertex = `
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPosition = world.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `
    const atmosphere = new THREE.Mesh(
      addGeometry(new THREE.SphereGeometry(1.11, 56, 40)),
      addMaterial(new THREE.ShaderMaterial({
        uniforms: planetUniforms,
        vertexShader: atmosphereVertex,
        fragmentShader: ATMOSPHERE_FRAGMENT,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      })),
    )
    atmosphere.renderOrder = 2
    scene.add(atmosphere)

    const machineGroup = new THREE.Group()
    machineGroup.userData.relic = 'planet'
    scene.add(machineGroup)
    scaleActors.push(machineGroup)
    const irisMaterial = addMaterial(new THREE.MeshStandardMaterial({
      color: 0x241319,
      emissive: 0x721227,
      emissiveIntensity: 0.7,
      metalness: 0.84,
      roughness: 0.34,
      transparent: true,
      opacity: 0.8,
    }))
    const irisPetals = []
    for (let index = 0; index < 14; index += 1) {
      const pivot = new THREE.Group()
      const angle = (index / 14) * Math.PI * 2
      pivot.rotation.z = angle
      const blade = new THREE.Mesh(addGeometry(new THREE.BoxGeometry(0.095, 0.68, 0.04)), irisMaterial)
      blade.position.y = 1.25
      blade.rotation.z = 0.19
      pivot.add(blade)
      machineGroup.add(pivot)
      irisPetals.push({ pivot, base: angle, index })
    }
    ;[
      { radius: 1.38, width: 0.008, rotation: [0.72, 0.14, 0.12], speed: 0.12 },
      { radius: 1.55, width: 0.012, rotation: [-0.34, 0.42, 0.6], speed: -0.085 },
      { radius: 1.73, width: 0.006, rotation: [0.18, -0.52, 0.34], speed: 0.055 },
    ].forEach(({ radius, width, rotation, speed }, index) => {
      const ring = new THREE.Mesh(
        addGeometry(new THREE.TorusGeometry(radius, width, 6, 144)),
        addMaterial(new THREE.MeshBasicMaterial({
          color: index === 1 ? 0x8c4a24 : 0xc01b42,
          transparent: true,
          opacity: index === 1 ? 0.31 : 0.2,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        })),
      )
      ring.rotation.set(...rotation)
      ring.userData.baseRotation = rotation[2]
      ring.userData.speed = speed
      machineGroup.add(ring)
    })

    const keyGroup = new THREE.Group()
    const keyMetal = addMaterial(new THREE.MeshStandardMaterial({
      color: 0xffd45c, emissive: 0x8b4e08, emissiveIntensity: 0.85,
      metalness: 0.86, roughness: 0.24, transparent: true, opacity: 0.8,
    }))
    const keyDark = addMaterial(new THREE.MeshStandardMaterial({
      color: 0x9e6918, emissive: 0x442407, emissiveIntensity: 0.45,
      metalness: 0.9, roughness: 0.31, transparent: true, opacity: 0.72,
    }))
    const keyRing = new THREE.Mesh(addGeometry(new THREE.TorusGeometry(0.32, 0.06, 12, 48)), keyMetal)
    keyRing.position.y = 0.64
    keyGroup.add(keyRing)
    keyGroup.add(new THREE.Mesh(addGeometry(new THREE.CylinderGeometry(0.06, 0.075, 1.18, 16)), keyMetal))
    const toothOne = new THREE.Mesh(addGeometry(new THREE.BoxGeometry(0.28, 0.13, 0.14)), keyMetal)
    toothOne.position.set(0.1, -0.48, 0)
    keyGroup.add(toothOne)
    const toothTwo = new THREE.Mesh(addGeometry(new THREE.BoxGeometry(0.18, 0.13, 0.14)), keyDark)
    toothTwo.position.set(-0.02, -0.58, 0)
    keyGroup.add(toothTwo)
    keyGroup.rotation.z = -0.24
    keyGroup.userData.relic = 'key'
    keyGroup.userData.baseRotation = keyGroup.rotation.z
    scene.add(keyGroup)
    relicModels.push(keyGroup)
    scaleActors.push(keyGroup)

    const diamondGroup = new THREE.Group()
    diamondGroup.add(new THREE.Mesh(
      addGeometry(new THREE.OctahedronGeometry(0.61, 0)),
      addMaterial(new THREE.MeshBasicMaterial({
        color: 0xb8faff, transparent: true, opacity: 0.18, side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })),
    ))
    const edgeSource = new THREE.OctahedronGeometry(0.63, 0)
    const edgeGeometry = new THREE.EdgesGeometry(edgeSource)
    edgeSource.dispose()
    diamondGroup.add(new THREE.LineSegments(
      addGeometry(edgeGeometry),
      addMaterial(new THREE.LineBasicMaterial({
        color: 0xc6fbff, transparent: true, opacity: 0.48,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })),
    ))
    diamondGroup.rotation.set(0.2, 0.16, -0.12)
    diamondGroup.userData.relic = 'diamond'
    diamondGroup.userData.baseRotation = diamondGroup.rotation.z
    scene.add(diamondGroup)
    relicModels.push(diamondGroup)
    scaleActors.push(diamondGroup)

    const mirrorGroup = new THREE.Group()
    mirrorGroup.add(new THREE.Mesh(
      addGeometry(new THREE.TorusGeometry(0.39, 0.025, 8, 64)),
      addMaterial(new THREE.MeshBasicMaterial({
        color: 0xc9a867, transparent: true, opacity: 0.44,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })),
    ))
    const mirror = new THREE.Mesh(
      addGeometry(new THREE.SphereGeometry(0.31, 24, 16)),
      addMaterial(new THREE.MeshBasicMaterial({
        color: 0x80eaf2, transparent: true, opacity: 0.18,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      })),
    )
    mirror.scale.z = 0.12
    mirrorGroup.add(mirror)
    mirrorGroup.userData.relic = 'mirror'
    mirrorGroup.userData.baseRotation = mirrorGroup.rotation.z
    scene.add(mirrorGroup)
    relicModels.push(mirrorGroup)
    scaleActors.push(mirrorGroup)

    const pointOnMap = (element, fallbackX, fallbackTop, height) => {
      const rect = element?.getBoundingClientRect()
      if (rect?.width && rect?.height) {
        return { x: rect.left + rect.width / 2, y: height - rect.top - rect.height / 2 }
      }
      return { x: fallbackX, y: height - fallbackTop }
    }
    const positionRelics = (width, height) => {
      const aura = relicMap?.querySelector('.planet-aura')
      const auraRect = aura?.getBoundingClientRect()
      const centerFallbackX = width * 0.72
      const centerFallbackTop = height * 0.51
      const center = pointOnMap(aura, centerFallbackX, centerFallbackTop, height)
      const centerTop = height - center.y
      const radius = auraRect?.width
        ? auraRect.width / 2
        : THREE.MathUtils.clamp(Math.min(width * 0.105, height * 0.13), 34, 116)
      const offsetX = Math.min(width * 0.19, 254)
      const offsetY = Math.min(height * 0.17, 148)
      const keyPoint = pointOnMap(relicMap?.querySelector('.relic-point-key'), center.x - offsetX, centerTop - offsetY, height)
      const diamondPoint = pointOnMap(relicMap?.querySelector('.relic-point-diamond'), center.x - offsetX, centerTop + offsetY, height)
      const mirrorPoint = pointOnMap(relicMap?.querySelector('.relic-point-mirror'), center.x + offsetX, centerTop + offsetY, height)

      uniforms.uCenter.value.set(
        THREE.MathUtils.clamp(center.x / width, 0, 1),
        THREE.MathUtils.clamp(center.y / height, 0, 1),
      )
      planet.position.set(center.x, center.y, 24)
      atmosphere.position.copy(planet.position)
      machineGroup.position.copy(planet.position)
      keyLight.position.set(center.x - radius * 2.4, center.y + radius * 2.8, 150)
      keyLight.target.position.copy(planet.position)
      redFill.position.set(center.x + radius * 2.8, center.y - radius * 1.8, 100)
      redFill.target.position.copy(planet.position)
      keyGroup.position.set(keyPoint.x, keyPoint.y, 33)
      diamondGroup.position.set(diamondPoint.x, diamondPoint.y, 34)
      mirrorGroup.position.set(mirrorPoint.x, mirrorPoint.y, 34)
      return radius
    }
    const resize = () => {
      const rect = mount.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        coarsePointer.matches ? 1.15 : 1.5,
        Math.sqrt(3_000_000 / (width * height)),
      )
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(width, height, false)
      camera.left = 0
      camera.right = width
      camera.top = height
      camera.bottom = 0
      camera.updateProjectionMatrix()
      uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio)
      field.scale.set(width, height, 1)
      field.position.set(width / 2, height / 2, -300)

      const radius = positionRelics(width, height)
      pointer.copy(uniforms.uCenter.value)
      targetPointer.copy(uniforms.uCenter.value)
      const scaleRatio = { key: 0.46, diamond: 0.48, mirror: 0.5 }
      scaleActors.forEach((actor) => {
        actor.userData.baseScale = actor === planet || actor === machineGroup
          ? radius
          : radius * scaleRatio[actor.userData.relic]
        const focused = actor.userData.relic === focusedRelic
        actor.scale.setScalar(actor.userData.baseScale * (focused ? 1.16 : 0.88))
      })
    }

    const render = (seconds = worldTime) => {
      if (disposed) return
      const delta = Math.min(Math.max(0, seconds - lastRenderTime), 0.05)
      lastRenderTime = seconds
      uniforms.uTime.value = seconds
      const pulseAge = seconds - pulseStartedAt
      if (pulseAge > 1.9 && uniforms.uPulse.value >= 0) uniforms.uPulse.value = -100
      if (!reducedMotion) {
        const phaseProgression = THREE.MathUtils.clamp((seconds - phaseChangedAt) / 0.8, 0, 1)
        const easedPhase = phaseProgression * phaseProgression * (3 - 2 * phaseProgression)
        phaseProgress.lerpVectors(phaseStart, targetPhase, easedPhase)
        uniforms.uRed.value = phaseProgress.x
        uniforms.uCyan.value = phaseProgress.y
        uniforms.uGold.value = phaseProgress.z
        uniforms.uViolet.value = phaseProgress.w
        pointer.lerp(targetPointer, 1 - Math.exp(-delta * 2.2))
        irisPetals.forEach(({ pivot, base, index }) => {
          pivot.rotation.z = base + Math.sin(seconds * 0.58 + index * 0.7) * 0.035
        })
        machineGroup.rotation.y = Math.sin(seconds * 0.09) * 0.08
        machineGroup.children.forEach((part) => {
          if (typeof part.userData.speed === 'number') {
            part.rotation.z = part.userData.baseRotation + seconds * part.userData.speed
          }
        })
        relicModels.forEach((model, index) => {
          if (model === planet) {
            model.rotation.y = seconds * 0.025
            model.rotation.x = Math.sin(seconds * 0.08) * 0.035
          } else {
            model.rotation.y = Math.sin(seconds * 0.31 + index) * 0.12
          }
          model.rotation.z = model.userData.baseRotation + (index % 2 ? -1 : 1) * seconds * 0.025
        })
        scaleActors.forEach((actor) => {
          const base = actor.userData.baseScale || 1
          const focused = actor.userData.relic === focusedRelic
          const target = base * (focused ? 1.16 : 0.88)
          actor.scale.setScalar(actor.scale.x + (target - actor.scale.x) * (1 - Math.exp(-delta * 4.2)))
        })
      }
      uniforms.uPointer.value.copy(pointer)
      renderer.render(scene, camera)
    }

    const stop = () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      frameId = 0
      lastFrameTimestamp = 0
    }
    const animate = (time) => {
      if (disposed || document.hidden || !visible || animationSuspended || reducedMotion) {
        frameId = 0
        lastFrameTimestamp = 0
        return
      }
      if (lastFrameTimestamp) worldTime += Math.min((time - lastFrameTimestamp) / 1000, 0.05)
      lastFrameTimestamp = time
      render(worldTime)
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (disposed || document.hidden || !visible || animationSuspended) return
      if (reducedMotion) {
        render(worldTime)
        return
      }
      if (!frameId) {
        lastFrameTimestamp = 0
        frameId = window.requestAnimationFrame(animate)
      }
    }
    const onPointerMove = (event) => {
      if (coarsePointer.matches || animationSuspended) return
      const rect = mount.getBoundingClientRect()
      targetPointer.set(
        THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1),
        1 - THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height, 0, 1),
      )
    }
    const onVisibility = () => document.hidden ? stop() : start()
    const onMotionChange = (event) => {
      const previousPreference = reducedMotion
      reducedMotion = event.matches
      if (reducedMotion) {
        if (!previousPreference && worldTime > phaseChangedAt) {
          const progress = THREE.MathUtils.clamp((worldTime - phaseChangedAt) / 0.8, 0, 1)
          const eased = progress * progress * (3 - 2 * progress)
          phaseProgress.lerpVectors(phaseStart, targetPhase, eased)
        }
        stop()
        if (previousPreference) phaseProgress.copy(targetPhase)
        phaseStart.copy(phaseProgress)
        uniforms.uRed.value = phaseProgress.x
        uniforms.uCyan.value = phaseProgress.y
        uniforms.uGold.value = phaseProgress.z
        uniforms.uViolet.value = phaseProgress.w
        scaleActors.forEach((actor) => {
          const base = actor.userData.baseScale || 1
          actor.scale.setScalar(base * (actor.userData.relic === focusedRelic ? 1.16 : 0.88))
        })
        render(worldTime)
      } else start()
    }
    const onIntersection = (entries) => {
      visible = entries[0]?.isIntersecting ?? true
      visible ? start() : stop()
    }
    const onLayoutChange = () => {
      const rect = mount.getBoundingClientRect()
      positionRelics(Math.max(1, rect.width), Math.max(1, rect.height))
      if (reducedMotion) render(worldTime)
    }
    const onContextLost = (event) => {
      event.preventDefault()
      mount.dataset.webgl = 'unavailable'
      stop()
    }
    const onContextRestored = () => {
      mount.dataset.webgl = 'ready'
      resize()
      start()
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(onIntersection, { threshold: 0 })
    resizeObserver.observe(mount)
    intersectionObserver.observe(mount)
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false)
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored, false)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onLayoutChange, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    motionPreference.addEventListener?.('change', onMotionChange)

    sceneStateRef.current = {
      setSuspended(value) {
        animationSuspended = value
        if (value) stop()
        else start()
      },
      setPhase(id) {
        if (!reducedMotion && worldTime > phaseChangedAt) {
          const progress = THREE.MathUtils.clamp((worldTime - phaseChangedAt) / 0.8, 0, 1)
          const eased = progress * progress * (3 - 2 * progress)
          phaseProgress.lerpVectors(phaseStart, targetPhase, eased)
        }
        phaseStart.copy(phaseProgress)
        const values = PHASES[id] || PHASES.betrayal
        targetPhase.set(...values)
        phaseChangedAt = worldTime
        if (reducedMotion) {
          phaseProgress.copy(targetPhase)
          phaseStart.copy(targetPhase)
          uniforms.uRed.value = phaseProgress.x
          uniforms.uCyan.value = phaseProgress.y
          uniforms.uGold.value = phaseProgress.z
          uniforms.uViolet.value = phaseProgress.w
        }
      },
      setRelic(id) {
        focusedRelic = RELICS.includes(id) ? id : 'key'
        uniforms.uFocus.value = Math.max(0, RELICS.indexOf(focusedRelic))
        const rect = mount.getBoundingClientRect()
        positionRelics(Math.max(1, rect.width), Math.max(1, rect.height))
        if (reducedMotion) {
          scaleActors.forEach((actor) => {
            const base = actor.userData.baseScale || 1
            actor.scale.setScalar(base * (actor.userData.relic === focusedRelic ? 1.16 : 0.88))
          })
        }
      },
      pulse() {
        pulseStartedAt = worldTime
        uniforms.uPulse.value = worldTime
        uniforms.uPulseId.value = ++pulseId
        if (reducedMotion) render(worldTime)
      },
      render,
      getTime: () => worldTime,
    }

    resize()
    render(worldTime)
    start()

    return () => {
      disposed = true
      stop()
      sceneStateRef.current = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onLayoutChange)
      window.removeEventListener('resize', resize)
      motionPreference.removeEventListener?.('change', onMotionChange)
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  useEffect(() => {
    sceneStateRef.current?.setSuspended(suspended)
  }, [suspended])

  useEffect(() => {
    const state = sceneStateRef.current
    if (!state) return
    state.setPhase(phase)
    state.setRelic(relic)
    if (pulse !== lastPulseRef.current) {
      lastPulseRef.current = pulse
      if (pulse) state.pulse()
    }
    state.render(state.getTime())
  }, [phase, relic, pulse])

  return <div className="cosmic-scene" ref={mountRef} data-phase={phase} aria-hidden="true" />
}

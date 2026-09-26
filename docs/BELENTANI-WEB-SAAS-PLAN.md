# BELENTANI WEB — SaaS GUI Plan v1.0

## Vision
Unificar toda la presencia digital educativa de Belentani en una plataforma SaaS modular, accesible desde un único dashboard, con monetización integrada y experiencia premium para estudiantes de todo el mundo.

## Arquitectura del Producto

### Módulos Core
```
┌─────────────────────────────────────────────────────────┐
│                    BELENTANI WEB DASHBOARD               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  LINGUA   │ │ SECURE-T │ │ MANOSABI │ │ UX ACADE │  │
│  │  FORGE    │ │  EDU     │ │ ERAS     │ │  MENT    │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │            │            │            │         │
│  ┌────┴────────────┴────────────┴────────────┴─────┐  │
│  │              SHARED ENGINE (@edu/engine)         │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │  │
│  │  │ Lesson  │ │ Quiz    │ │ Memory  │ │ Tutor  │ │  │
│  │  │ Player  │ │ Engine  │ │ Store   │ │ Agent  │ │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              USER MANAGEMENT + PAYMENTS            │  │
│  │  SSO │ Subscriptions │ Certificates │ Analytics    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack
| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | Next.js 15 + React 19 + TypeScript + shadcn/ui | Server components, SSG/SSR, excellent DX |
| **3D/Visual** | Three.js + @react-three/fiber | Interactive 3D learning modules |
| **Backend** | FastAPI (Python) + WebSocket | Async, AI integration, real-time tutoring |
| **Database** | PostgreSQL + Redis + Supabase | Relational + cache + auth + storage |
| **AI/ML** | DeepSeek API (tier standard) + Ollama (local free) | Cost-efficient, reliable |
| **Auth** | Supabase Auth + SSO (Google, GitHub) | Built-in, secure, multi-provider |
| **Payments** | Stripe (subscriptions) + Lemon Squeezy | SaaS monetization, global |
| **Hosting** | Vercel (frontend) + Railway (backend) + Supabase (DB) | Integrated, scalable |
| **CDN** | Cloudflare | Assets, images, fonts |
| **Analytics** | PostHog (open-source, self-hosted) | Privacy-first, event tracking |

### Page Structure
```
/                              ── Landing page (hero + features + pricing)
/auth/signup                   ── Registration with SSO options
/auth/login                    ── Login with SSO + email
/dashboard                     ── Main dashboard (courses, progress, streak)
/dashboard/linguaforge         ── Language learning modules
/dashboard/secure-t            ── Cybersecurity education
/dashboard/manos-abiertas      ─️ IA and creative tools courses
/dashboard/ux-academy          ─ UX/UI professional program
/dashboard/lesson/:id          ─️ Individual lesson (3D interactive)
/dashboard/quiz/:id            ─️ Quiz interface
/dashboard/certificates        ── Earned certificates
/dashboard/settings            ── Profile, subscription, preferences
/pricing                       ── Plans (Free / Pro / Enterprise)
/blog                          ── Educational content
/community                     ── Forum, discussions
/admin                         ── Instructor dashboard (if applicable)
```

### Design System
- **Primary:** Neon red (#ff003c) — Belentani signature color
- **Secondary:** Neon cyan (#00fff7) — Interactive elements
- **Accent:** Gold (#ffd700) — Achievements, premium
- **Background:** #0a0a0f — Deep black
- **Typography:** IBM Plex Mono (monospace) + Inter (UI)
- **Style:** Liquid glass, neon glow, dark mode native
- **Motion:** Smooth animations, 60fps, GSAP for complex sequences
- **Accessibility:** WCAG 2.1 AA, prefers-reduced-motion, keyboard nav

### Feature Roadmap

#### Phase 1 (MVP — 4 weeks)
- [ ] Dashboard with course overview
- [ ] Lesson player with @edu/engine integration
- [ ] Basic quiz system
- [ ] User auth (Supabase SSO)
- [ ] Progress tracking (MemoryStore)
- [ ] Free tier (3 courses)
- [ ] Stripe subscription integration

#### Phase 2 (3 weeks)
- [ ] 3D interactive modules (Three.js @react-three/fiber)
- [ ] Tutor Agent (voice, PT-BR/es/en)
- [ ] Certificate generation
- [ ] Community forum
- [ ] Admin dashboard
- [ ] Analytics dashboard

#### Phase 3 (2 weeks)
- [ ] Mobile app (React Native + Expo)
- [ ] Offline mode (PWA)
- [ ] Multi-language UI (ES, PT-BR, EN, CA)
- [ ] Leaderboards, gamification
- [ ] API for third-party integrations
- [ ] Enterprise plan with SSO/LDAP

### Monetization
| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 3 courses, basic quizzes, community |
| **Pro** | $9.99/mo | All courses, 3D modules, tutor AI, certificates |
| **Enterprise** | $29.99/mo | Everything + team management, SSO, API access |

### KPI Targets
- Monthly Active Users: 10k in 6 months
- Conversion Free→Pro: 5%
- Churn: <3% monthly
- Revenue target: $5k/mo by month 6

---

## Implementation Sequence

1. Setup monorepo structure (packages/ui, packages/engine, apps/web)
2. Create design system (tailwind config, shadcn components, CSS variables)
3. Build landing page + auth flow
4. Integrate @edu/engine for lesson/quiz
5. Add Stripe payment integration
6. Build dashboard with course navigation
7. Add Three.js 3D modules
8. Integrate Tutor Agent with voice
9. Deploy to Vercel + Railway + Supabase
10. Iterate based on analytics

## Risks
- API costs (DeepSeek usage for AI features)
- Supabase free tier limits
- Performance with 3D on low-end devices
- User acquisition (marketing budget needed)
- Competition from existing platforms

## Success Criteria
- Functional MVP in 4 weeks
- All modules accessible from single dashboard
- Payment flow working
- Mobile responsive
- Performance: <2s TTI, <100ms API responses
- Accessibility: WCAG 2.1 AA compliant

---

## Repository Structure
```
belentani-web/
├── packages/
│   ├── ui/              # shadcn components + design system
│   ├── engine/          # @edu/engine (shared)
│   ├── webgl/           # Three.js components (@react-three/fiber)
│   └── utils/           # Shared utilities
├── apps/
│   ├── web/             # Main Next.js app
│   ├── api/             # FastAPI backend
│   └── admin/           # Admin dashboard
├── packages/
│   ├── ui/              # shadcn components + design system
│   ├── engine/          # @edu/engine (shared)
│   ├── webgl/           # Three.js components (@react-three/fiber)
│   └── utils/           # Shared utilities
├── apps/
│   ├── web/             # Main Next.js app
│   ├── api/             # FastAPI backend
│   └── admin/           # Admin dashboard
├── packages/
│   ├── ui/              # shadcn components + design system
│   ├── engine/          # @edu/engine (shared)
│   ├── webgl/           # Three.js components (@react-three/fiber)
│   └── utils/           # Shared utilities
├── apps/
│   ├── web/             # Main Next.js app
│   ├── api/             # FastAPI backend
│   └── admin/           # Admin dashboard
├── packages/
│   ├── ui/              # shadcn components + design system
│   ├── engine/          # @edu/engine (shared)
│   ├── webgl/           # Three.js components (@react-three/fiber)
│   └── utils/           # Shared utilities
├── apps/
│   ├── web/             # Main Next.js app
│   ├── api/             # FastAPI backend
│   └── admin/           # Admin dashboard
```

## Success Criteria
- Functional MVP in 4 weeks
- All modules accessible from single dashboard
- Payment flow working
- Mobile responsive
- Performance: <2s TTI, <100ms API responses
- Accessibility: WCAG 2.1 AA compliant

## Risks
- API costs (DeepSeek usage for AI features)
- Supabase free tier limits
- Performance with 3D on low-end devices
- User acquisition (marketing budget needed)
- Competition from existing platforms

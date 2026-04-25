# ATOMIC ERP — PRD

## Original Problem Statement
> "quiero poner en la pagina web de mi sistema en atomiccotizador.shop/web quiero que integres un fondo hipermega realista 4k interactivo sobre galaxias o algo mega llamativo en el universo y bajes la opacidad de todos los banners de mi tienda para priorizar este fondo"

## Implemented (2026-01)
- `src/components/ui/GalaxyBackground.tsx` — Hyper-realistic 4K interactive galaxy:
  - Procedural spiral galaxy (4 arms, log-spiral, slow rotation, hot core → blue arms)
  - 5 nebula blob layers (violet/magenta/cyan/amber/blue) — breathing & drifting
  - 3 parallax star fields (far/mid/near) reacting to mouse position
  - Warp drive (220 stars diving outward with motion trails)
  - Random shooting stars
  - Click → particle burst (50 particles with glow)
  - DPR-aware 4K (≤2 desktop, ≤1.5 mobile), 45% density on mobile
- `src/app/web/layout.tsx` — Galaxy mounted globally (renders behind all /web subpages); navbar/footer at 10% opacity with backdrop-blur
- `src/app/web/page.tsx` — Categories banner, features bar, product cards, collection banners, category cards all at 10% opacity; text switched to white for galaxy contrast

## Architecture
- Next.js 16 + React 19 + Tailwind v4 + Prisma
- Single 2D canvas, single requestAnimationFrame loop, no extra deps

## Backlog
- P2: Dynamic galaxy theme switching (per collection slug)
- P2: Reduced-motion fallback honoring `prefers-reduced-motion`
- P2: Galaxy color palette tied to seasonal campaigns

## Next Tasks
- User to deploy and validate visually in production (atomiccotizador.shop/web)

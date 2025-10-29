# AUTOMATE IT UF – Webbplats (HTML/CSS/JS)

En minimalistisk, premium-inspirerad webbplats byggd med fokus på tillgänglighet (WCAG 2.2 AA), prestanda och användbarhet.

## Tech & Struktur
- Ren HTML, CSS och JavaScript (ingen build krävs)
- Design tokens i `design/design-tokens.json`
- Sidor: `index.html`, `about.html`, `product.html`, `contact.html`
- Tillgångar: `assets/css/styles.css`, `assets/js/main.js`, `assets/icon.svg`
- SEO: `sitemap.xml`, `robots.txt`, JSON-LD i `index.html`

## Kör lokalt
1. Öppna `index.html` i en modern webbläsare
2. För bästa resultat (CORS vid delning) kör en enkel server:
   - Python: `python -m http.server 8000`
   - Node: `npx serve .` eller `npx http-server -p 8000`

Öppna sedan `http://localhost:8000`.

## Deploy
- GitHub Pages, Netlify eller Vercel fungerar direkt (statisk sajt)
- Peka domän till hosten och lägg ev. omdirigeringar för rena URL:er

## Design & typografi
- System font stack med valfri Inter som gratis alternativ
- Notera: Apple SF Pro kräver licens – använd inte utan rättigheter
- Färger: Vit bas, blå primär `#0A84FF`, sekundär turkos `#0BB5A7`, neutrala grå

## Tillgänglighet
- Semantisk HTML på alla sidor
- Tabbnavigering med tydliga focus states (focus ring + skugga)
- ARIA-live regioner för formulärfel och toast
- Modal med focus trap och ESC-stängning
- Respekterar `prefers-reduced-motion`

## Prestanda
- Lättviktig CSS (tokens + komponenter)
- Begränsad JS, endast interaktioner (meny, modal, validering)
- Bilder: använd WebP/AVIF där möjligt; lägg till `loading="lazy"`

## Testning
- Accessibility: manuellt med skärmläsare (NVDA/VoiceOver) + axe DevTools
- Lighthouse: Mål ≥ 90 på alla kategorier
- E2E (valfritt): Playwright/Cypress kan köras mot statisk server

## Checklista – Tillgänglighet (WCAG 2.2 AA)
- Kontrast ≥ 4.5:1 för brödtext, ≥ 3:1 för stor text
- Alla interaktiva element har synlig fokus
- Formulär har label kopplad till fält + tydliga fel
- Bilder har alt-text; dekorativa markeras korrekt
- Test med tangentbord: Tab/Shift+Tab på alla interaktiva element

## Checklista – Prestanda
- Komprimera bilder (WebP/AVIF), rätt dimensioner
- Undvik tunga webbfonter; använd systemstack/Inter
- Minifiera CSS/JS (hosten kan göra), cache headers
- Inlinea kritisk CSS på startsidan (valfritt)

## Strukturdata
- `index.html` inkluderar JSON-LD för Organization
- Lägg till FAQ/Service-schema vid behov

## Säkerhet & sekretess
- Ingen känslig data i klientloggar
- Server-sida: använd CSRF-skydd på formulär om backend läggs till
- Cookies/GDPR: lägg till banner om tracking införs

## Figma / Skiss
- Repo:t inkluderar design tokens och ett enkelt ikonbibliotek (SVG)
- Figma-fil kan tas fram på begäran och mappas till tokens

## Licens
© AUTOMATE IT UF. Inter-typsnitt (om använt) enligt SIL Open Font License.

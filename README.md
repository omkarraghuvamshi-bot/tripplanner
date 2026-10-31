# GoBeyond · Frontend-only edition

GoBeyond is now a standalone React + Vite travel-planning demo. It does not require a backend, database, Docker, Redis, or a Python environment.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm
- Internet access for remote destination photography, Google Fonts, MapLibre and MapTiler map tiles

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Production build

```bash
cd frontend
npm install
npm run build
npm run preview
```

The production site is generated in `frontend/dist/`. Deploy that folder to a static host such as Vercel, Netlify, Render Static Sites, or GitHub Pages.

## MapTiler configuration

The provided MapTiler key is configured in `frontend/.env.local` for local development. For a hosted deployment, add this environment variable in the host's project settings:

```env
VITE_MAPTILER_API_KEY=your_maptiler_key
```

Restrict the key in MapTiler to your local/production domains. It is a browser key and is visible to site visitors by design.

## Demo behaviour and data

- Trip drafts can be generated and saved in the browser.
- Saved trips and hotel favourites persist in `localStorage` on the current browser/device.
- Destination, hotel, attraction and route content is curated sample data.
- The route lines are illustrative corridor previews, not turn-by-turn navigation or live traffic directions.
- Hotel prices, reviews, ratings and availability are sample content. Booking is not connected.
- No account, authentication, server-side sync, live weather, live inventory, or backend API is used.

## Project structure

```text
frontend/
  public/           # favicon and static-host SPA fallback
  src/
    App.tsx         # pages, local demo data, browser interactions
    index.css       # responsive UI system
    main.tsx        # React entry point
  .env.example
  package.json
  vite.config.ts
```

## Destination photo credits

- **Hampi, Virupaksha Temple, Karnataka, India**: Vyacheslav Argenberg, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), [Wikimedia Commons source](https://commons.wikimedia.org/wiki/File:Hampi,_Virupaksha_Temple,_Karnataka,_India.jpg).
- **The magnificent fort of Chitradurga**: Shivashankar S Bannikoppa, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), [Wikimedia Commons source](https://commons.wikimedia.org/wiki/File:The_magnificent_fort_of_Chitradurga.jpg).

The Hampi destination card/detail page and every Chitradurga Fort route-stop card use these location-specific images. Attribution is also shown in the site footer.

## Visual refresh

- The home hero now rotates through five scenic travel slides automatically.
- Previous/next arrows and slide indicators allow manual carousel navigation.
- Inner-page banners use dedicated scenic backgrounds for destinations, route finding, trip planning and saved journeys.
- The interface uses a brighter coastal palette with indigo, teal, coral, mango and violet accents.

# DXA Website

Full-screen Design xAgents typography experiment built with Vite, Three.js, `three-text`, and Instrument Sans.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Routes

- `index.html` is the primary shader typography page.
- `index-b.html` is the lighter cylinder typography page.
- `index-c.html` is the protocol cylinder typography page.
- `dxa.html` is the shader typography page with centered `DxA` text.

## Structure

- `src/three-text-demo.js` contains the shared Three.js shader text scene for `index.html` and `dxa.html`.
- `src/three-text-demo.css` contains the shader page reset, Instrument Sans font face, and canvas sizing.
- `src/index-b.js` contains the cylinder scroll and drag behavior for `index-b.html`.
- `src/index-b.css` contains the cylinder page reset, typography, and layout.
- `public/fonts/InstrumentSans.ttf` and `public/hb/hb.wasm` are required runtime assets.

## Deploy

Build output is written to `dist/`.

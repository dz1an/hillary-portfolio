# Hillary Ness Borabo — Hospitality Portfolio

A single-page portfolio for a BSHM student based in Zamboanga City, Philippines.
Lusion-inspired, black-and-white minimalist, with a 3D hero, parallax gallery,
horizontal-scroll disciplines section, a "kitchen opening" loader, and
background music.

## Stack

Pure static — no build step.

- HTML / CSS / vanilla JS
- [Three.js](https://threejs.org/) (ES module from unpkg) — wireframe icosahedron in the hero
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scroll
- Google Fonts: Inter + Fraunces

## Local preview

Open `index.html` in a browser, or run a tiny server so the audio loads cleanly:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (Vercel)

```bash
npm i -g vercel
vercel           # preview
vercel --prod    # production
```

## Credits

- **Soundtrack** — "Boogie" by [Music for Video Library](https://www.youtube.com/watch?v=Xiop2yTFB0s), royalty-free.
- **Food & kitchen photography** — [freefoodphotos.com](https://freefoodphotos.com/), CC BY 3.0.
- **Zamboanga City & hotel imagery** — [Wikimedia Commons](https://commons.wikimedia.org/) contributors (CC BY / CC BY-SA).
- **Design & development** — John Kent Evangelista · [dz1an.github.io](https://dz1an.github.io/)

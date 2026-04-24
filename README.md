# Vehium Docs

End-user documentation for the [Vehium](https://vehium.com) platform, served at [docs.vehium.com](https://docs.vehium.com).

This is a static HTML site — no build step, no framework. Edit the HTML directly.

## What's in here

```
website/
├── index.html            Docs landing page
├── workshop/             Vehium Workshop (workshop/garage app) docs
├── customer/             Vehium (end-customer app) docs
├── _partials/            Shared header/footer/sidebar (Nginx SSI)
├── css/docs.css          Design tokens + docs layout
├── js/docs.js            Theme toggle, search, sidebar
├── img/                  Shared images, logos, screenshots
├── sitemap.xml           All docs pages with lastmod
├── llms.txt              AI-crawler-friendly site summary
├── llms-full.txt         Full content mirror for LLMs
├── robots.txt
├── Dockerfile            nginx:stable-alpine static server
├── nginx.conf            SSI + redirects + security headers
└── docker-build.bat      Local build helper
manifests/
├── vehium-docs.yaml         Deployment + Service + PDB
└── vehium-docs-ingress.yaml Traefik ingress for docs.vehium.com
```

## Writing docs

1. Each page lives at its canonical URL: `workshop/clients/index.html` serves `/workshop/clients/`.
2. Every page includes `_partials/head.html`, `_partials/header.html`, the appropriate sidebar, and `_partials/footer.html` via Nginx SSI (`<!--#include virtual="..." -->`).
3. Add the new URL to `sitemap.xml` and, if it's user-facing, to `llms.txt`.
4. Every page should also be mirrored as a `.md` file next to it (e.g. `workshop/clients/index.md`) — this is what AI crawlers ingest.

## Local preview

```bash
cd website
docker build -t vehium-docs .
docker run --rm -p 8080:80 vehium-docs
# open http://localhost:8080
```

## Deploy

Container is pushed to `ghcr.io/burnoutos/vehium-docs:latest` and rolled out to the `bos` Kubernetes namespace. Ingress binds `docs.vehium.com`.

## License

(c) Vehium / BurnoutOS. All documentation content is published publicly so end users and AI assistants can reference it.

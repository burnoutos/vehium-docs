# Vehium Docs

Official end-user documentation for **[Vehium](https://vehium.com)** — modern garage management for workshops and the people whose vehicles they look after.

**Live at [docs.vehium.com](https://docs.vehium.com)**

---

## What you'll find

|                                                          |                                                                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[Vehium Workshop](https://docs.vehium.com/workshop/)** | For mechanics, service advisors, and garage owners. Clients, vehicles, services, employees, invoices, and reports — on web, desktop, iOS, and Android. |
| **[Vehium](https://docs.vehium.com/customer/)**          | For vehicle owners. Track MOT expiry, get service reminders, and see what your garage has done to your vechiles.                                       |

### Popular articles

- [Create a workshop account](https://docs.vehium.com/workshop/getting-started/sign-up/)
- [Create your first service](https://docs.vehium.com/workshop/services/create/)
- [Managing MOT history](https://docs.vehium.com/workshop/vehicles/mot/)
- [Upgrading your subscription](https://docs.vehium.com/workshop/billing/subscription/)
- [Install the desktop app](https://docs.vehium.com/workshop/desktop/install-windows/)
- [Troubleshooting](https://docs.vehium.com/workshop/troubleshooting/)

---

## Found a typo or something unclear?

We'd love a fix. The docs are open source — every page is plain HTML, no build step, no framework.

1. Click the page on [docs.vehium.com](https://docs.vehium.com) you want to improve.
2. Find the matching file under `website/` (e.g. `/workshop/clients/` → `website/workshop/clients/index.html`).
3. Edit it and open a pull request.

For anything bigger, please [open an issue](https://github.com/burnoutos/vehium-docs/issues) first so we can chat about it.

## Need help?

If something in the product isn't working — not a docs issue — email **info@vehium.com**.

---

## For developers

<details>
<summary>Run the docs locally</summary>

The site is served by `nginx:stable-alpine` with Server-Side Includes (SSI) for shared partials.

```bash
cd website
docker build -t vehium-docs .
docker run --rm -p 8080:80 vehium-docs
# open http://localhost:8080
```

</details>

<details>
<summary>Repository layout</summary>

```
website/
├── index.html        Landing page
├── workshop/         Workshop app docs
├── customer/         Customer app docs
├── _partials/        Shared header, footer, sidebars (SSI)
├── css/  js/  img/   Assets
├── llms.txt          AI-crawler-friendly site summary
├── llms-full.txt     Full content mirror for LLMs
├── sitemap.xml
├── Dockerfile
└── nginx.conf

manifests/            Kubernetes deployment, service, ingress
```

</details>

## License

[MIT](LICENSE) — content is published publicly so end users and AI assistants can freely reference it.

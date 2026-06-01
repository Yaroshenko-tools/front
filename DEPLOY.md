# Deploy frontend to Coolify

The site is a static Nuxt export served by nginx. Coolify builds from the **Dockerfile** in this repo.

## Coolify application setup

1. **New resource** → Git repository → `Yaroshenko-tools/front`
2. **Branch:** `production` (default / main branch on GitHub)
3. **Build pack:** **Dockerfile** only — not Nixpacks, not “Nuxt”, not Node (those use port 3000/8000 and will break)
4. **Port / Ports Exposes:** **`80`** — the container runs **nginx**, not Node on 3000

   Wrong (causes 502):

   ```text
   traefik.http.services.*.loadbalancer.server.port=3000
   caddy_0.handle_path.0_reverse_proxy={{upstreams 3000}}
   ```

   Correct after saving port 80 and redeploying:

   ```text
   loadbalancer.server.port=80
   {{upstreams 80}}
   ```
5. **Domain:** e.g. `https://yaroshenko.tools`
6. **Build argument** (Coolify → Build → Docker build arguments):

   | Build arg | Example |
   |-----------|---------|
   | `VUE_APP_BACKEND_URL` | `https://api.yaroshenko.tools` |

   This is baked in at `yarn generate` time. Change it when the API URL changes, then redeploy.

7. Enable **Auto Deploy** on push to `production`.

## Health check

Use path `/` on port **80** (nginx). Disable Coolify’s healthcheck if it targets port 3000.

## Troubleshooting

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| 502 Bad Gateway | Traefik/Caddy points to **3000** | Set **Ports Exposes = 80**, redeploy |
| Build OK, container “running”, site down | Same port mismatch | Check generated labels for `port=80` |
| API calls fail in browser | Wrong build arg | `VUE_APP_BACKEND_URL=https://api.yaroshenko.tools`, redeploy |
| Build fails on `yarn upgrade` | Wrong branch / old Dockerfile | Branch must be `production` |
| Blank page on deep links | nginx fallback | Fixed in `nginx.conf` (`try_files` → `404.html`) |

**Verify inside the running container:**

```bash
docker exec -it <container> wget -qO- http://127.0.0.1:80/ | head
```

If that works but the public URL does not, the problem is Coolify/Traefik port mapping, not the image.

## Health check (Coolify UI)

Use path `/` (nginx serves `index.html`).

## Local build

```bash
docker build \
  --build-arg VUE_APP_BACKEND_URL=http://127.0.0.1:3000 \
  -t yaroshenko-front .
docker run --rm -p 8080:80 yaroshenko-front
```

## Migration note

GitHub Actions no longer publish images to Docker Hub (`shmidtelson/yaroshenko-frontend`). Coolify builds on deploy from Git.

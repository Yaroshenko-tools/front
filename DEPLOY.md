# Deploy frontend to Coolify

The site is a static Nuxt export served by nginx. Coolify builds from the **Dockerfile** in this repo.

## Coolify application setup

1. **New resource** → Git repository → `Yaroshenko-tools/front`
2. **Branch:** `production`
3. **Build pack:** Dockerfile
4. **Port:** `80`
5. **Domain:** e.g. `https://yaroshenko.tools`
6. **Build argument** (Coolify → Build → Docker build arguments):

   | Build arg | Example |
   |-----------|---------|
   | `VUE_APP_BACKEND_URL` | `https://api.yaroshenko.tools` |

   This is baked in at `yarn generate` time. Change it when the API URL changes, then redeploy.

7. Enable **Auto Deploy** on push to `production`.

## Health check

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

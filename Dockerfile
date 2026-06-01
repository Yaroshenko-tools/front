FROM node:16-alpine AS build-stage

RUN apk add --no-cache libc6-compat libstdc++

WORKDIR /app

ARG VUE_APP_BACKEND_URL=https://api.yaroshenko.tools
ENV VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn generate

FROM nginx:1.25-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

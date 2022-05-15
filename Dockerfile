FROM node:16-alpine as build-stage
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Check https://github.com/webpack/webpack/issues/14532
RUN apk add --no-cache libc6-compat libstdc++
RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn upgrade
RUN npm run generate

#production
FROM nginx:1.19.1-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

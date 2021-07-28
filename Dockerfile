FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn upgrade
RUN npm run build

#production
FROM nginx:1.19.1-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

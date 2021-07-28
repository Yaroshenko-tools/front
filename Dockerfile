FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . /app

# Share envs
ARG VUE_APP_BACKEND_URL
ENV VUE_APP_BACKEND_URL $VUE_APP_BACKEND_URL

RUN yarn global add serve
RUN yarn upgrade
RUN npm run build
CMD ["serve", "-s", "dist"]

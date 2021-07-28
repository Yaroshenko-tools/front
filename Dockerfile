FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . /app
COPY .env.prod .env
RUN yarn global add http-server
RUN yarn upgrade
RUN npm run build

CMD [ "http-server", "dist" ]

FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY . /app

RUN yarn global add serve
RUN yarn upgrade
RUN npm run build

CMD ["serve", "dist", "-p", "8080"]

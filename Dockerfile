FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY ./frontend /app
RUN yarn global add serve
RUN yarn upgrade
RUN npm run build
CMD ["serve", "-s", "dist"]
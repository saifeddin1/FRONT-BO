#stage 1
FROM node:14.18.0 as node

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build:prod

#stage 2
FROM nginx:alpine

ENV BUILD_OUTPUT "mup-app"

COPY --from=node /app/dist/${BUILD_OUTPUT} /usr/share/nginx/html
# Expose the specified port back to the host machine.
EXPOSE ${PORT}
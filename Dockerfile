FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install --save --legacy-peer-deps
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/zolloz-client /usr/share/nginx/html

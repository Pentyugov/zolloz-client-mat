FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install --save --legacy-peer-deps
RUN npm run build --prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/zolloz-client /usr/share/nginx/html

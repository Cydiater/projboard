FROM node as build

WORKDIR /app

COPY . /app

RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn && yarn run build

FROM nginx:1.15

COPY --from=build /app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

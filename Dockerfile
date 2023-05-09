FROM gplane/pnpm as Builder

RUN mkdir -p /home/easy-editor/web
WORKDIR /home/easy-editor/web
COPY . /home/easy-editor/web

RUN pnpm install

RUN pnpm build

FROM swr.cn-north-4.myhuaweicloud.com/opensourceway/openeuler/nginx:1.22.0-22.03-lts

COPY --from=Builder /home/easy-editor/web/dist /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/nginx.conf


ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

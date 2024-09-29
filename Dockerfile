FROM nginx:alpine

COPY dist/index.html /usr/share/nginx/html/index.html
COPY dist/bundle.js /usr/share/nginx/html/bundle.js
COPY dist/favicon.png /usr/share/nginx/html/favicon.png

EXPOSE 80
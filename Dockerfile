FROM nginx:alpine

# Copy the HTML and JS files to the Nginx directory
COPY docker_test/index.html /usr/share/nginx/html/index.html
COPY docker_test/bundle.js /usr/share/nginx/html/bundle.js

EXPOSE 80
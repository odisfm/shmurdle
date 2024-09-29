FROM nginx:alpine

# Copy the HTML and JS files to the Nginx directory
COPY dist/index.html /usr/share/nginx/html/index.html
COPY dist/bundle.js /usr/share/nginx/html/bundle.js

EXPOSE 80
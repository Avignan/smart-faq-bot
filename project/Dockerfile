# Stage 1: Build React app
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --silent

# Copy source code
COPY src/ src/
COPY public/ public/
COPY tsconfig.json tailwind.config.js postcss.config.js ./

# Pass API URL at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build app
RUN npm run build

# Stage 2: Serve with minimal Nginx
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove unnecessary packages
RUN apk del --purge

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
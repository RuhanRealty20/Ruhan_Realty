FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY server/package*.json server/
RUN npm ci --omit=dev -w server
COPY server server
EXPOSE 5000
CMD ["npm","run","start","-w","server"]

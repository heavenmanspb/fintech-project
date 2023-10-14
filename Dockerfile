FROM node:20-alpine as build
LABEL stage=builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY ./src ./src
COPY typeorm.prod.config.ts typeorm.config.ts
COPY tsconfig.json .
COPY tsconfig.build.json .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --omit=dev
COPY --from=build ./app/dist .
#RUN npm run migration:run:prod
#CMD ["npm", "run", "start:prod"]
CMD npx typeorm migration:run -d typeorm.config.js && node src/main.js

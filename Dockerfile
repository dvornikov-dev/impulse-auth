# development
FROM node:20-alpine AS development

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

USER node

# build for production
FROM node:20-alpine AS build

WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npx prisma generate

RUN yarn build

ENV NODE_ENV production

RUN yarn install --production && yarn cache clean

USER node

# production
FROM node:20-alpine AS production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/package.json ./package.json
COPY --chown=node:node --from=build /app/prisma ./prisma
COPY --chown=node:node --from=build /app/dist ./dist

USER node
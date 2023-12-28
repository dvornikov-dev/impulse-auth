FROM node:18-alpine As development

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

USER node

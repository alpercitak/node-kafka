FROM node:22-alpine AS base

WORKDIR /app
RUN npm i -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch

RUN npm i -g turbo

COPY . .

FROM base AS prepare

WORKDIR /app

ARG APP_NAME
RUN turbo prune --scope="${APP_NAME}" --docker


FROM base AS build

WORKDIR /app

ARG APP_NAME
RUN echo build: ${APP_NAME}

RUN pnpm i -r --offline
RUN pnpm turbo build --filter="${APP_NAME}" 

RUN rm -rf ./node_modules
RUN rm -rf ./apps/${APP_NAME}/node_modules
RUN pnpm i -r --offline --prod --filter="${APP_NAME}"

FROM node:22-alpine AS deploy

WORKDIR /app

ARG APP_NAME
RUN echo deploy: ${APP_NAME}

COPY --from=build /app .
ENV APP_ENTRY="apps/${APP_NAME}/dist/index.js"
CMD "node" ${APP_ENTRY}

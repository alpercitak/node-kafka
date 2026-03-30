FROM node:25-alpine AS base

WORKDIR /app
RUN npm i -g pnpm turbo
COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS prepare

WORKDIR /app
COPY . .

ARG PKG_NAME
RUN turbo prune --scope="${PKG_NAME}" --docker

FROM base AS build

WORKDIR /app

ARG APP_NAME
ARG PKG_NAME

COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i -r --offline

COPY --from=prepare /app/out/full/ .
RUN pnpm turbo build --filter="${PKG_NAME}"

RUN pnpm i -r --offline --prod --filter="${PKG_NAME}"

FROM node:25-alpine AS deploy

WORKDIR /app

ARG APP_NAME
COPY --from=build /app .
ENV APP_ENTRY="apps/${APP_NAME}/dist/index.js"
CMD node $APP_ENTRY
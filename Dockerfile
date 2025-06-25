FROM node:18.18.2-bookworm AS deps
RUN apt-get update && apt upgrade -y && \ 
    apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb && \
    apt clean
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
ENV npm_config_loglevel warn
ENV CI=true
RUN yarn install --frozen-lockfile
RUN yarn audit-ci --critical --report-type important

FROM node:hydrogen-alpine as base
RUN apk upgrade --no-cache

FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# RUN yarn test:coverage
RUN yarn build

FROM base AS runner
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
USER nextjs
CMD ["yarn", "start"]

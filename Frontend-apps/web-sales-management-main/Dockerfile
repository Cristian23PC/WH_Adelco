FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .npmrc ./
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

RUN yarn install --production --ignore-scripts

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
ARG NEXT_PUBLIC_LOGIN_REDIRECT_URI
ENV NEXT_PUBLIC_LOGIN_REDIRECT_URI=$NEXT_PUBLIC_LOGIN_REDIRECT_URI
ARG NEXT_PUBLIC_LOGOUT_REDIRECT_URI
ENV NEXT_PUBLIC_LOGOUT_REDIRECT_URI=$NEXT_PUBLIC_LOGOUT_REDIRECT_URI
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_SALES_BASE_URL
ENV NEXT_PUBLIC_SALES_BASE_URL=$NEXT_PUBLIC_SALES_BASE_URL
ARG NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ENV NEXT_PUBLIC_KEYCLOAK_REALM=$NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID

RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY ready.html ./public/ready.html

USER nextjs

EXPOSE 9376

ENV PORT 9376

CMD ["yarn", "start"]

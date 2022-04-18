FROM node:13.8 AS builder

# Copy package dependencies
WORKDIR /src/
COPY package.json yarn.lock babel.config.js ./

# copy storybook
COPY fbcnms-packages /src/fbcnms-packages
COPY @fbcnms @fbcnms
# install assets
RUN yarn install --frozen-lockfile && yarn cache clean

# build project
WORKDIR /src/fbcnms-packages/symphony-design-system
RUN rm -rf storybook-static && yarn build-storybook -s public

# create reverse proxy image
FROM bitnami/nginx

# copy build artifacts
COPY --from=builder /src/fbcnms-packages/symphony-design-system/storybook-static /app

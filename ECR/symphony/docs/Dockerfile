FROM node AS builder

# copy docs
COPY website /src/website
COPY md /src/md

# install assets
WORKDIR /src/website
RUN yarn install

# build project
RUN rm -rf build && yarn build
COPY website/static/psym build/docs/psym

# create reverse proxy image
FROM bitnami/nginx

# copy build artifacts
COPY --from=builder /src/website/build/docs /app

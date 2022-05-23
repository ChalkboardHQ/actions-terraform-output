FROM node:16 as backBuild

# add credentials on build
ARG SSH_PRIVATE_KEY
RUN mkdir ~/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
RUN chmod 400 ~/.ssh/id_rsa

# make sure your domain is accepted
RUN touch ~/.ssh/known_hosts
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

ADD . /app

WORKDIR /app

RUN npm i

RUN npm run build

RUN npm prune --production

RUN chown -R root:root /app

FROM node:16

RUN mkdir /app && mkdir /app/calkboard-hq

COPY --from=backBuild /app/node_modules /app/calkboard-hq/node_modules
COPY --from=backBuild /app/dest /app/calkboard-hq
COPY --from=backBuild /app/package.json /app/calkboard-hq/
COPY --from=backBuild /app/configs /app/calkboard-hq/configs

RUN mv /app/calkboard-hq/configs/initial.yaml /app/calkboard-hq/configs/config.yaml \
    && mkdir -p /data/db/sqlite

CMD ["/usr/local/bin/nodejs", "/app/geeq/cmd/app.js"]

FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

ENV DEBUG=bloglist-backend:*

RUN npm ci

USER node

CMD DEBUG=bloglist-backend:* npm start

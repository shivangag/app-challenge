FROM node:14-alpine

ARG GITREV

WORKDIR /app

COPY ./package*.json ./

RUN apk --no-cache add --upgrade bash python3
RUN npm install
COPY . .
RUN npm run build

ENV GITCOMMITHASH ${GITREV}

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
FROM node:16.14-alpine

WORKDIR /app-api

COPY package* .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]
FROM node:8.11.1

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 8080
CMD [ "yarn", "server" ]
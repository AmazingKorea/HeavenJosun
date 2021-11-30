FROM node:16

WORKDIR /heavenjosun

COPY . /heavenjosun/

ENV NODE_ENV=docker

RUN npm i -g typescript

RUN npm i

RUN npm run build

# 지금 실행 아니고, 나중에 컨테이너가 실행될 때 실행되는 명령어
CMD ["node", "./build/app.js"]
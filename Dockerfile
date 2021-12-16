FROM node:14-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN yarn add
ADD . .
RUN yarn build
RUN yarn prune --production
CMD ["node", "./dist/main.js"]
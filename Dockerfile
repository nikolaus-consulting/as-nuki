FROM node:20
RUN mkdir -p /home/node/app
RUN mkdir -p /home/node/app/log
RUN chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install -g npm@latest
RUN usermod -u 99 node
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3100
VOLUME /home/node/app/log
CMD [ "node", "server.js" ]
FROM node:11-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 80
CMD [ "node", "app.js" ]
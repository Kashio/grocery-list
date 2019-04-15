FROM node:8.15.1
WORKDIR /usr/src/grocery-list
COPY package*.json ./
RUN npm ci --only-production
COPY . .
EXPOSE 8080 3000
CMD [ "npm", "start" ]
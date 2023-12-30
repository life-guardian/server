FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
EXPOSE 5000 
COPY . .
ENTRYPOINT [ "node", "server.js" ]
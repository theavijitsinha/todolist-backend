FROM node:14.10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

EXPOSE 8080

# Bundle app source
COPY src src

CMD [ "npm", "start" ]
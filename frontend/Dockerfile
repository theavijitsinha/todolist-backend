FROM node:14.10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY src src
COPY public public

RUN npm run build

EXPOSE 5000

CMD [ "npx", "serve", "-s", "build" ]
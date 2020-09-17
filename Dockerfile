FROM node:14.10-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8080

FROM builder as prod

ENV NODE_ENV production

# Bundle app source
COPY src src

CMD [ "npm", "start" ]

FROM node:14.10 as dev

# Create app directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["npx", "nodemon"]
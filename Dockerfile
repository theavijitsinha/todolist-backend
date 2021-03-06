FROM node:14.10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY backend/package*.json ./backend/

RUN npm install -C ./backend
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8080

CMD [ "tail", "-f", "/dev/null" ]
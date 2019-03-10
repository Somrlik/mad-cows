FROM node:lts

WORKDIR /usr/src/app

# Copy and install dependencies to allow for caching of docker layers
COPY package.json ./
COPY yarn.lock ./

# node:lts has yarn preinstalled. Cool!
RUN yarn install

# Copy the project
COPY . .

# Expose webserver
EXPOSE 8080

# Set env
ENV NODE_ENV=production
ENV PORT=8080
RUN yarn run build

# TODO: Copy a .env file to container or expose a volume?
WORKDIR /usr/src/app/dist

CMD ["node", "server.js"]

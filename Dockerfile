FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy contents of the local public directory to a directory named 'public' in the container
COPY public ./public

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]

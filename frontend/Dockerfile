# Fetching the minified node image on apline linux
FROM node:lts-alpine

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY package.json ./
RUN npm install
RUN npm install react-scripts -g

# Copying all the files in our project
COPY . .



# Starting our application
CMD [ "npm", "run", "dev" ]

# Exposing server port
EXPOSE 3000
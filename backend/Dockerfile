# Use the official Node.js image as the base
FROM node:14

# Set the working directory to /app
WORKDIR /

# Set the value of the environment variable
ARG RAILWAY_ENVIRONMENT
ENV RAILWAY_ENVIRONMENT=$RAILWAY_ENVIRONMENT

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm ci --only=production

# Install yt-dlp
RUN apt-get update && \
    apt-get install -y python3 && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Copy the rest of the app's source code
COPY . .

# Set the command to start the Node.js app
CMD ["node", "./bin/www"]

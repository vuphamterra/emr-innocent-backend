FROM node:12-alpine AS BUILD_IMAGE

# Create working directory
WORKDIR /innocent

# get package.json and install dependencies first
COPY package.json  .
RUN npm install

# Install and configure `serve`.
# Copy source code to image
RUN apk update && apk add bash
# Copy source code to image
COPY . ./

# Expose service port

EXPOSE 7141 


CMD ["npm", "start"]
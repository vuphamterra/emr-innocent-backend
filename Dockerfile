FROM node:12-alpine AS BUILD_IMAGE

# Create working directory

# get package.json and install dependencies first
COPY package.json  .
RUN npm install

# Install and configure `serve`.
# Copy source code to image

# Expose service port

EXPOSE 7141 


CMD ["npm", "start"]
FROM node:17-alpine
#FROM node:10-alpine

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

#WORKDIR /home/node/app


ARG USER=default
ENV HOME /home/$USER

RUN adduser -D $USER \
        && echo "$USER ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$USER \
        && chmod 0440 /etc/sudoers.d/$USER

USER $USER
WORKDIR $HOME

# files in /home/$USER to be owned by $USER
# docker has --chown flag for COPY, but it does not expand ENV so we fallback to:
# COPY src src
# RUN sudo chown -R $USER:$USER $HOME

CMD echo "User $(whoami) running from $PWD with premissions: $(sudo -l)"

COPY package*.json ./

RUN sudo npm install

COPY --chown=$USER:$USER . .

EXPOSE 7117
CMD ["npm", "start"]
#CMD sleep 10000

#CMD /home/node/app/node_modules/pm2/bin/pm2 start /home/node/app/app.js
#CMD export $(cat .env) && node app.js


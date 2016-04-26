FROM hypriot/rpi-node

RUN mkdir -p /usr/src/kettle-fake
WORKDIR /usr/src/kettle-fake
COPY . /usr/src/kettle-fake

EXPOSE 2000
CMD [ "npm", "start" ]


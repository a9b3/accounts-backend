FROM mhart/alpine-node

WORKDIR /src
ADD . .

EXPOSE 8080
CMD NODE_ENV=prod node index.js

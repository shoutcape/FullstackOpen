FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

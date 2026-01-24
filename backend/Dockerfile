
#Node.js 18ን እንጠቀማለን
FROM node:18-alpine

# የስራ ቦታ
WORKDIR /app

# ፓኬጆችን መጫን
COPY package.json package-lock.json ./
RUN npm install

# ኮዱን መገልበጥ እና ማስጀመር
COPY . .

# Backend የሚሰራበትን ፖርት (ብዙ ጊዜ 5000)
EXPOSE 5000

CMD ["npm", "start"]

# CMD ["node", "server.js"]

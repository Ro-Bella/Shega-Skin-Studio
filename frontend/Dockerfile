# ደረጃ 1: መገንባት (Build Stage)
# Node.js ያለበትን መሰረት እንጠቀማለን
FROM node:18-alpine as builder

# የስራ ቦታችንን እንወስናለን
WORKDIR /app

# package.json ፋይሎችን ወደ ሳጥኑ እንገለብጣለን
COPY package.json package-lock.json ./

# የሚያስፈልጉ ነገሮችን እንጭናለን
RUN npm install

# ሙሉ ኮዱን ገልብጠን Build እናደርጋለን
COPY . .
RUN npm run build

# ደረጃ 2: ማቅረብ (Serve Stage)
# ቀላል የሆነውን Nginx ሰርቨር እንጠቀማለን
FROM nginx:alpine

# ከላይ የገነባነውን (Build) ፋይል ወደ Nginx እንገለብጣለን
COPY --from=builder /app/build /usr/share/nginx/html

# ፖርት 80ን ክፍት እናደርጋለን
EXPOSE 80

# ሰርቨሩን እናስጀምራለን
CMD ["nginx", "-g", "daemon off;"]
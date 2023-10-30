# Dockerfile

FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# 이전 빌드 단계에서 빌드한 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

# 기본 nginx 설정 파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# custom 설정파일을 컨테이너 내부로 복사
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# FROM node:20

# WORKDIR /app

# COPY package.json package-lock.json ./
# COPY .env ./
# COPY src/ ./src/
# COPY public/ ./public/

# RUN npm install
# RUN npm run build

# CMD ["npm", "start"]
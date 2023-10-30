# Dockerfile

# 1. nginx 이미지 사용
FROM nginx 

#2. 패키지 복사
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN npm install

# 3. WEB 서버 실행 (Listen 포트 정의)
EXPOSE 3000
CMD npm start
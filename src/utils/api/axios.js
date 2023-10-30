import axios from 'axios';
import QUERY from '../../constants/query';
import { getCookie, setCookie, removeCookie } from '../cookie';
import jwt_decode from 'jwt-decode';
import Storage from '../localStorage';
import { useNavigate } from "react-router-dom";
import ROUTER from '../../constants/router';


export default class Axios {
  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      withCredentials: true, // CORS
    });
    console.log("기본URL : " + url);

    this.instance.interceptors.response.use(
      response => {
        const token = response.headers.authorization;
        console.log("api" + token);
        if (token) {
          const [, parseToken] = token.split(' ');
          setCookie(QUERY.COOKIE.COOKIE_NAME, parseToken);

          const tokenContent = jwt_decode(parseToken);
          Storage.setNickName(tokenContent.nickname);
          Storage.setUserId(tokenContent.userId);
          Storage.setPoint(tokenContent.point);
          console.log(tokenContent.photo)
          if (tokenContent.photo != undefined && tokenContent.photo != null) {
            Storage.setPhoto(tokenContent.photo);
          }
        }

        return response;
      },
      error => {
        //토큰 인증 실패일 경우, 현재 적용된 토큰 제거후, 로그인 페이지로 이동시킨다.
        console.log(error.response.status);
        if (error.response.status == 401) {
          alert("토큰 인증에 실패했습니다.\n 로그인 화면으로 이동합니다.");
          removeCookie(QUERY.COOKIE.COOKIE_NAME);
          Storage.removeNickName();
          Storage.removeUserId();
          Storage.removePoint();
          Storage.removePhoto();
        }

        return Promise.reject(error);
      }
    );
  }

  async get(path) {
    const cookie = getCookie(QUERY.COOKIE.COOKIE_NAME);
    const option = {
      headers: {
        Authorization: `Bearer ${cookie ? cookie : ''}`,
      },
    };
    console.log("여기타는지 확인좀 할게요");
    return this.instance.get(path, option);
  }

  async post(path, payload) {
    const cookie = getCookie(QUERY.COOKIE.COOKIE_NAME);
    const option = {
      headers: {
        Authorization: `Bearer ${cookie ? cookie : ''}`,
      },
    };
    return this.instance.post(path, payload, option);
  }

  async delete(path) {
    const cookie = getCookie(QUERY.COOKIE.COOKIE_NAME);
    const option = {
      headers: {
        Authorization: `Bearer ${cookie ? cookie : ''}`,
      },
    };
    return this.instance.delete(`${path}`, option);
  }

  async put(path, payload) {
    const cookie = getCookie(QUERY.COOKIE.COOKIE_NAME);
    const option = {
      headers: {
        Authorization: `Bearer ${cookie ? cookie : ''}`,
      },
    };
    return this.instance.put(`${path}`, payload, option);
  }
}

import React from "react";
import { useEffect } from "react";
//import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from '../utils/api/axios';
import Storage from '../utils/localStorage';
import QUERY from '../constants/query';
import ROUTER from '../constants/router';

function KakaoPage() {
  //const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosKaKao = new Axios(QUERY.AXIOS_PATH.KAKAOSERVER);
  const axiosBackEnd = new Axios(QUERY.AXIOS_PATH.SEVER);
  var token = "";
  const redirect_url = process.env.REACT_APP_REDIRECT_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  let code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    console.log(code);
    console.log(apiKey);
    console.log(redirect_url);
    const getKakaoToken = async () => {
      try {
        const response = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=authorization_code&client_id=${apiKey}&redirect_uri=${redirect_url}&code=${code}`
        });

        const data = await response.json();

        console.log(data);

        if (data.access_token) {
          token = data.access_token;
          console.log("토큰값 : " + token);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      //access 토큰까지 가져오는 작업 진행했으므로, 서버로 토큰보내서 나머지 처리 진행

      kakaoLogin();
    };



    const kakaoLogin = async () => {
      console.log("현재 access_token입니다    " + token);
      const response = await axiosBackEnd
        .post(QUERY.AXIOS_PATH.KAKAO, {
          token,
        });
      const jwtToken = response.headers;
      console.log(response.headers);
      console.log("jwtToken = " + jwtToken);

      const nickname = Storage.getNickName();


      if (nickname) {
        console.log('Nickname:', nickname);
      } else {
        console.log('Nickname이 저장되어 있지 않습니다.');
      }

      navigate(ROUTER.PATH.MAIN)

    };
    getKakaoToken();

  });


  return <div></div>;
}

export default KakaoPage;

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import QUERY from '../constants/query';
import ROUTER from '../constants/router';
import Axios from '../utils/api/axios';
import Storage from '../utils/localStorage';
import KakaoLogin from "react-kakao-login";
import { RiKakaoTalkFill } from 'react-icons/ri';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const axios = new Axios(QUERY.AXIOS_PATH.SEVER);
  const redirect_url = process.env.REACT_APP_REDIRECT_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const onSubmit = async e => {
    console.log(email);
    console.log(password);
    e.preventDefault();
    const response = await axios
      .post(QUERY.AXIOS_PATH.LOGIN, {
        email,
        password,
      });
    const jwtToken = response.headers['date'];
    console.log(response.headers);
    console.log("jwtToken = " + jwtToken);

    const nickname = Storage.getNickName();


    if (nickname) {
      console.log('Nickname:', nickname);
    } else {
      navigate(ROUTER.PATH.MAIN)
      alert('로그인에 실패하였습니다');
      console.log('Nickname이 저장되어 있지 않습니다.');
      navigate(ROUTER.PATH.LOGIN);
      return;
    }

    navigate(ROUTER.PATH.MAIN)

  };

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirect_url}&response_type=code`;


  const handleKakaoLogin = () => {
    window.location.href = kakaoURL
  }

  const handleLogin = () => {
    navigate(ROUTER.PATH.SIGNUP);
  }

  return (
    <LoginContainer>
      <Form onSubmit={onSubmit}>
        <Titleheader>로그인 화면</Titleheader>
        <Label htmlFor='email'>아이디</Label>
        <Input
          type='text'
          id='email'
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            console.log("email:", e.target.value);
          }}
        />
        <Label htmlFor='password'>비밀번호</Label>
        <Input
          type='password'
          id='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type='submit'>로그인</Button>
        <Link to={""}>
          <KakaoBtn onClick={handleKakaoLogin}>
            <img src="/path/to/Kakao_login.png" alt=""/>
          </KakaoBtn>
        </Link>
        <Button type='button' onClick={handleLogin}>회원 가입</Button>
      </Form>
    </LoginContainer>
);
        }

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f7f7f7;
  font-family: 'Nanum Gothic', sans-serif;
`;

const Titleheader = styled.div`
  display: flex;
  justify-content: center;
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
  padding: 60px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Label = styled.label`
  font-size: 18px;
  color: #212529;
`;

const Input = styled.input`
  font-size: 18px;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;

const Button = styled.button`
  width: 14rem;
  font-size: 18px;
  padding: 12px;
  background-color: #ff922b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffad6d;
  }
`;

const KakaoBtn = styled.button`
  width: 14rem;  // 로그인 및 회원가입 버튼과 동일한 너비
  font-size: 18px;
  padding: 12px;
  background: url('/Kakao_login.png') no-repeat center/cover; // 배경 이미지 설정
  border: none;
  border-radius: 8px; 
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;
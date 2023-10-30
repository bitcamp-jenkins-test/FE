import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from '../utils/api/axios';
import styled from 'styled-components';
import QUERY from '../constants/query';
import ROUTER from '../constants/router';
import DaumPost from './DaumPost';


export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [nicknameCheck, setNicknameCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);

  const axios = new Axios(QUERY.AXIOS_PATH.SEVER);
  const navigate = useNavigate();

  const onSubmit2 = async e => {
    console.log("여기는 회원가입 버튼 누를떄만 동작해야해");

    if (!emailCheck) {
      alert("이메일 중복 체크 확인 바랍니다!");
      return;
    }
    if (!nicknameCheck) {
      alert("닉네임 중복 체크 확인 바랍니다!");
      return;
    }
    e.preventDefault();

    axios
      .post(QUERY.AXIOS_PATH.SIGNUP, {
        email,
        password,
        nickname,
        phone,
        address,
        detailAddress,
      })
      .then(() => navigate(ROUTER.PATH.LOGIN));
  };


  // 이메일 중복확인 API
  const handleEmailCheck = async (e) => {
    e.preventDefault();

    try {
      const sendMail = email;
      if (sendMail === "") {
        alert('이메일을 입력해주시기 바랍니다.');
        return;
      }
      const response = await axios.post('/api/users/useremailcheck', { email: sendMail });

      if (response.status === 200) {
        if (response.data.result) {
          alert('사용가능한 이메일 입니다!');
          setEmailCheck(true);
        } else {
          alert('이미 사용 중인 이메일입니다.');
          setEmailCheck(false);
        }
      } else {
        alert('이메일 전송에 실패했습니다. 다시 시도해 주세요');
        setEmailCheck(false);
      }
    } catch (error) {
      console.error('이메일 전송 요청 중 오류 발생:', error);
      setEmailCheck(false);
      alert('이메일 전송에 실패했습니다.');
    }
  };


  // 닉네임 중복 체크 API
  const handleNicknameCheck = async (e) => {
    e.preventDefault();
    try {
      const nicknameToCheck = nickname;
      if (nicknameToCheck === "") {
        alert('닉네임을 입력해주시기 바랍니다.');
        return;
      }
      const response = await axios.post('/api/users/nicknamecheck', { nickname: nicknameToCheck });

      if (response.status === 200) {
        if (response.data.result) {
          alert('사용 가능한 닉네임입니다.');

          setNicknameCheck(true);

        } else {
          alert('이미 사용 중인 닉네임입니다.');
          setNicknameCheck(false);
        }
      } else {
        alert('닉네임 중복 체크에 실패했습니다.');
        setNicknameCheck(false);
      }
    } catch (error) {
      console.error('닉네임 중복 체크 요청 중 오류 발생:', error);
      alert('닉네임 중복 체크에 실패했습니다.');
      setNicknameCheck(false);
    }
  };

  return (
    <LoginContainer>
      <Form onSubmit={onSubmit2}>
        <Titleheader>회원가입</Titleheader>
        <Label htmlFor='username'>이메일</Label>
        <Input
          type='text'
          id='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleEmailCheck}>이메일 중복 체크</button>
        <Label htmlFor='password'>비밀번호</Label>
        <Input
          type='password'
          id='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Label htmlFor='nickname'>닉네임</Label>
        <Input
          type='text'
          id='nickname'
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
        <button onClick={handleNicknameCheck}>닉네임 중복 체크</button>
        <Label htmlFor="phone">휴대폰 번호</Label>
        <Input
          type="text"
          id="phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <Label htmlFor="address">주소</Label>
        <div>
          <DaumPost setAddress={setAddress} />
        </div>
        <Input
          type="text"
          id="areaAddress"
          value={address}
          readOnly
          onChange={e => setAddress(e.target.value)}
        />

        <Label htmlFor="detailAddress">상세 주소</Label>
        <Input
          type="text"
          id="detailAddress"
          value={detailAddress}
          onChange={e => setDetailAddress(e.target.value)}
        />
        <Button type='submit'>회원가입</Button>
        <Link to={ROUTER.PATH.BACK}>
          <Button type='button'>뒤로가기</Button>
        </Link>
      </Form>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 95vh;
  background-color: #f7f7f7;
  font-family: 'Nanum Gothic', sans-serif;
   overflow-y: auto; /* 세로 스크롤을 표시하도록 설정 */
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
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 8px;

  &:hover {
    background-color: #ffad6d;
  }
`;

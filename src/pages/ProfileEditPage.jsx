import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail, AiOutlineLock, AiOutlineSmile, AiOutlineHome, AiOutlineMobile } from 'react-icons/ai';
import DaumPost from './DaumPost';
import Axios from '../utils/api/axios';
import QUERY from '../constants/query';
import ROUTER from '../constants/router';
import Storage from '../utils/localStorage';
import { FaUserCircle } from 'react-icons/fa';


export default function ProfileEditPage() {
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  // 비밀번호 확인용
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [profileImage, setProfileImage] = useState(null);  // 프로필 이미지
  const [uploadImage, setUploadImage] = useState(null);
  const [nicknameCheck, setNicknameCheck] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [userDetails, setUserDetails] = useState({});
  const axios = new Axios(QUERY.AXIOS_PATH.SEVER);

  // 프로필 정보 가져오기 API
  useEffect(() => {
    async function getUserDetails() {
      try {
        const response = await axios.get(`/api/profiles`);
        console.log(response.data.result);
        setUserDetails(response.data.result);

        setEmail(userDetails.email);
        setPassword(userDetails.password);
        setNickname(userDetails.nickname);
        setPhone(userDetails.phone);
        setAddress(userDetails.address);
        setDetailAddress(userDetails.detailAddress);
        setProfileImage(userDetails.photo);
        setLoading(false);
      } catch (error) {
        console.error('유저 호출 중 오류 발생', error);
        alert("유저 호출 중 오류 발생");
        setLoading(false);
      }
    }
    getUserDetails();
  }, []);

  const updateProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setUploadImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const updateNickname = (e) => {
    setNickname(e.target.value);
  };

  const updatePhone = (e) => {
    setPhone(e.target.value);
  };

  const updateAddress = (e) => {
    setAddress(e.target.value);
  };

  const updateDetailAddress = (e) => {
    setDetailAddress(e.target.value);
  };

  const handleSave = async () => {
    if (password !== confirmPassword && (password != undefined) && (confirmPassword != undefined)) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    // 수정된 정보만을 저장
    const formData = new FormData();
    let post = {};
    let imageData = [];
    let contentKey = 'profileRequestDto';
    console.log(nickname);
    if (nickname != userDetails.nickname && nickname != undefined) {
      if (!nicknameCheck) {
        alert("닉네임 중복 체크 확인 바랍니다!");
        return;
      }
    }


    const updatedProfile = {
      nickname,
      phone,
      address,
      detailAddress,
      password,
    };
    formData.append(
      contentKey,
      new Blob([JSON.stringify(updatedProfile)], { type: 'application/json' })
    );
    formData.append('multipartFile', uploadImage);
    console.log(uploadImage);
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  // 프로필 수정 API
  async function updateProfile(formData) {
    try {
      const response = await axios.put(`/api/profiles`, formData);



      if (response.status === 200) {
        console.log(response);
        alert('프로필이 성공적으로 업데이트되었습니다.');
        // 이전 페이지 리다이렉션
        navigate(ROUTER.PATH.BACK);
      } else {
        // 서버 응답이 200이 아닌 경우, 오류 처리
        console.log("하하하");
        alert('프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      throw error;
    }
  }

  // 주소 찾기
  const handleAddressSearch = (selectedAddress) => {
    setAddress(selectedAddress);
  };

  // 닉네임 중복 체크 API
  const handleNicknameCheck = async () => {
    try {
      const nicknameToCheck = nickname;
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
    <EditProfileContainer>
      <ProfileTitle>마이프로필</ProfileTitle>
      <ProfileImageContainer>
        {(profileImage == undefined) ? (
          (Storage.getPhoto() == undefined) ? (
            <FaUserCircle
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
              }}
            />) : (<img
              src={`https://kr.object.ncloudstorage.com/carrot-thunder/user/${Storage.getPhoto()}`}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
              }}
            />)
        ) : (
          <ProfileImage image={profileImage} />
        )}

        <HiddenFileInput
          type="file"
          accept="image/*"
          onChange={updateProfileImage}
          id="profileImageInput"
        />
      </ProfileImageContainer>
      <UploadButton onClick={() => document.getElementById("profileImageInput").click()}>
        사진변경
      </UploadButton>

      <InputContainer>
        이메일
        <InputGroup>
          <IconStyle as={AiOutlineMail} />
          <PaddedInputField
            type="email"
            value={userDetails.email}
            disabled
          />
        </InputGroup>

        닉네임
        <InputGroup>
          <IconStyle as={AiOutlineSmile} />
          <PaddedInputField
            type="text"
            placeholder={userDetails.nickname}
            value={nickname}
            onChange={updateNickname}
          />
          <button onClick={handleNicknameCheck}>중복 체크</button>
        </InputGroup>

        전화번호
        <InputGroup>
          <IconStyle as={AiOutlineMobile} />
          <PaddedInputField
            type="text"
            placeholder={userDetails.phone}
            value={phone}
            onChange={updatePhone}
          />
        </InputGroup>

        주소
        <AddressContainer>
          <AddressIconStyle as={AiOutlineHome} />
          <AddressInput
            type="text"
            placeholder={userDetails.address}
            value={address}
            onChange={setAddress}
            disabled
          />
          <DaumPost setAddress={handleAddressSearch} />
        </AddressContainer>
        <AddressContainer>
          <AddressIconStyle as={AiOutlineHome} />
          <AddressInput
            type="text"
            placeholder={userDetails.detailAddress}
            value={detailAddress}
            onChange={updateDetailAddress}
          />
        </AddressContainer>
        비밀번호 변경
        <InputGroup>
          <IconStyle as={AiOutlineLock} />
          <PaddedInputField
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={updatePassword}
          />
        </InputGroup>
        <InputGroup>
          <IconStyle as={AiOutlineLock} />
          <PaddedInputField
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={updateConfirmPassword}
          />
        </InputGroup>
      </InputContainer>
      <SaveButton onClick={handleSave}>변경하기</SaveButton>
    </EditProfileContainer>
  );
}

// 스타일
const EditProfileContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
`;


const ProfileTitle = styled.h2`
  margin-bottom: 30px;
  margin-left: 250px;
`;

const ProfileImageContainer = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  margin-left: 250px;
`;

const ProfileImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => `url(${props.image})`} center/cover;
`;

const UploadButton = styled.button`
  background-color: #ff922b;
  color: #fff;
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;  // 위쪽 여백 추가
  margin-left: 290px;  // 왼쪽 여백 추가
  width: 80px;
`;


const InputContainer = styled.div`
  width: 80%;
  max-width: 500px;
  margin-top: -200px;
  margin-left: 550px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SaveButton = styled.button`
  width: 80%;
  max-width: 500px;
  padding: 15px;
  background-color: #ff922b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  margin-left: 550px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const IconStyle = styled.div`
  position: absolute;
  top: 30%;
  transform: translateY(-50%);
  left: 10px;
  font-size: 24px;
`;

const AddressIconStyle = styled(IconStyle)`
  top: 30%;
`;

const PaddedInputField = styled(InputField)`
  padding-left: 40px;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: -10px; 
  position: relative;
`;

const AddressInput = styled(PaddedInputField)`
  flex: 1;
  margin-right: 10px;
`;
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import ROUTER from '../constants/router';
import { BiArrowBack } from 'react-icons/bi';
import Storage from '../utils/localStorage';
import Axios from '../utils/api/axios';
import QUERY from '../constants/query';
import { FaUserCircle } from 'react-icons/fa';


export default function MyPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('myposts');
  const [wishlists, setWishlists] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);

  const axiosInstance = new Axios(QUERY.AXIOS_PATH.SEVER);

  useEffect(() => {
    async function fetchWishlists() {
      try {
        const response = await axiosInstance.get(`${QUERY.AXIOS_PATH.WISHLIST}`);
        setWishlists(response.data);
        setIsWishlistLoaded(true);
      } catch (error) {
        console.error('위시리스트 정보 가져오기 오류:', error);
      }
    }

    if (tab === 'myposts') {
      fetchMyPosts();
    } else if (tab === 'wishlist' && !isWishlistLoaded) {
      fetchWishlists();
    }
  }, [tab, isWishlistLoaded]);

  async function fetchMyPosts() {
    try {
      const response = await axiosInstance.get(QUERY.AXIOS_PATH.MYPOSTS);
      const responseData = response.data.result;  // API 응답에서 result 배열을 가져옵니다.
      if (Array.isArray(responseData)) {
        setMyPosts(responseData);
      } else {
        console.warn('API did not return an array for myPosts');
        setMyPosts([]);  // 기본값으로 빈 배열 설정
      }
    } catch (error) {
      console.error('내 게시글 정보 가져오기 오류:', error);
    }
  }

  //결제관련 
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePayment = () => {
    // 실제 충전 로직을 처리하는 부분
    if (amount) {
      Storage.setAmount(amount);
      navigate(ROUTER.PATH.PAYMENT)
    } else {
      alert('충전할 금액을 입력해주세요.');
    }
  };

  const handleChatButtonClick = () => {
    navigate(ROUTER.PATH.CHATTING);
  };

  const handleProfileEditClick = () => {
    navigate(ROUTER.PATH.PROFILE_EDIT);
  };

  const getNickname = () => {
    return Storage.getNickName();
  }
  const getPoint = () => {
    return `당근번개 페이 잔액:${Storage.getPoint()}원`
  }

  const formatPrice = (price) => {
    return price.toLocaleString('en-US');
  };

  const Profile = ({ onProfileEditClick }) => (
    <ProfileContainer>
      {(Storage.getPhoto() == undefined) ? (
        <FaUserCircle
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <ProfileImage src={`https://kr.object.ncloudstorage.com/carrot-thunder/user/${Storage.getPhoto()}`} alt="프로필 이미지" />
      )}
      <ProfileInfoContainer>
        <div>
          <NickName>{getNickname()}</NickName>
        </div>
        <ProfileButton onClick={onProfileEditClick}>프로필 편집</ProfileButton>
        <ChatButton onClick={handleChatButtonClick}>캐럿톡</ChatButton>
      </ProfileInfoContainer>
    </ProfileContainer>
  );


  const AdditionalInfo = () => (
    <AdditionalInfoContainer>
      <p>{getPoint()}</p>
      <ButtonContainer>
        <Button onClick={openModal}>충전</Button>
      </ButtonContainer>
    </AdditionalInfoContainer>
  );

  return (
    <MyPageContainer>
      <ContentContainer>
        <ProfileAndAdditionalInfoContainer>
          <Profile onProfileEditClick={handleProfileEditClick} />
          <AdditionalInfo />
        </ProfileAndAdditionalInfoContainer>
        <Separator />

        {isModalOpen && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <span style={closeBtnStyle} onClick={closeModal}>&times;</span>
              <div style={backButtonStyle} onClick={closeModal}>
                <BiArrowBack />
              </div>
              <h2 style={{ textAlign: 'center' }}>충전</h2>
              <form style={formStyle}>
                <Separator />
                <div style={inputButtonContainerStyle}>
                  <label style={marginRightStyle}>
                    충전 금액 : <span style={{ marginRight: '5px' }}></span>
                    <input
                      type="number"
                      placeholder="충전 금액을 입력하세요"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={inputStyle}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handlePayment}
                    style={buttonStyle}
                  >
                    충전
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        <TabContainer>
          <TabButton onClick={() => setTab('myposts')} active={tab === 'myposts'}>내 게시글</TabButton>
          <TabButton onClick={() => setTab('wishlist')} active={tab === 'wishlist'}>찜</TabButton>
        </TabContainer>

        <ListContainer>
          {tab === 'wishlist' && wishlists.map(wishlist => (
            <Link to={`/post/${wishlist.id}`} key={wishlist.id}>
              <ListCard>
                {wishlist.attachedFiles.length > 0 && (
                  <ListImage src={`http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${wishlist.attachedFiles[0].filePath}?type=f&w=250&h=250`} alt={`이미지 ${wishlist.id}`} />
                )}
                <ListBody>
                <ListTitle>{wishlist.title}</ListTitle>
                <ListText><strong>{formatPrice(wishlist.price)}원</strong></ListText>
                </ListBody>
              </ListCard>
            </Link>
          ))}
          {tab === 'myposts' && myPosts.map(item => (
            <Link to={`/post/${item.postid}`} key={item.postid}>
              <ListCard>
                <ListImage src={`http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${item.attachedFilesPaths[0].filePath}?type=f&w=250&h=250`} alt={`이미지 ${item.postid}`} />
                <ListBody>
                <ListTitle>{item.title}</ListTitle>
                <ListText><strong>{formatPrice(item.price)}원</strong></ListText>
              </ListBody>
              </ListCard>
            </Link>
          ))}
        </ListContainer>
      </ContentContainer>
    </MyPageContainer>
  );

}

const MyPageContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
`;

const ContentContainer = styled.div`
  margin-top: 50px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const NickName = styled.h2`
  margin-top: 15px; 
`;

const ProfileButton = styled.button`
  width: 100px;
  height: 30px;
  background-color: #ff922b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const AdditionalInfoContainer = styled.div`
  width: 30%;
  margin-left: 20%;
  background-color: white;
  border: 1px solid #c0c0c0;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column; 
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #ff922b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ChatButton = styled.button`
    width: 100px;
    height: 30px;
    padding: 5px 10px;
    background-color: #ff922b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
`;

const Separator = styled.hr`
  width: 70%;
  height: 2px;
  background-color: black;
`;

const ProfileAndAdditionalInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: 350px;
`;


const marginRightStyle = {
  marginRight: '10px',
};

/// 모달 관련 css 설정

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  width: '500px',
  height: '300px',
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '20px',
  cursor: 'pointer',
};

const inputStyle = {
  padding: '8px',
  marginTop: '5px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  alignItems: 'center',
};

const buttonStyle = {
  background: '#ff922b',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const inputButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const backButtonStyle = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};


const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  justify-content: center;
`;

const TabButton = styled.button`
  width: 500px;
  padding: 10px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#ddd' : 'transparent')};
  border: none;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 220px);
  grid-row-gap: 40px;
  justify-content: center;
`;

const ListTitle = styled.div`
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`;

const ListText = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
`;

const ListBody = styled.div`
  padding: 10px;
`;

const ListCard = styled.div`
  width: 200px; 
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd; 
  border-radius: 5%;
  overflow: hidden;
`;

const ListImage = styled.img`
  width: 210px;
  height: auto;
  border-radius: 5%;
`;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Axios from '../utils/api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Storage from '../utils/localStorage';
import ROUTER from '../constants/router';
import ImageSlider from '../components/ImageSlider';
import QUERY from '../constants/query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import MapComponent from '../components/MapComponent';
import { confirmAlert } from 'react-confirm-alert';
import '../styles/ConfirmAlert.css';

const axiosForLoginUser = new Axios(QUERY.AXIOS_PATH.SEVER);

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const axios = new Axios(QUERY.AXIOS_PATH.SEVER);

  function getCategoryLabel(categoryValue) {
    // 카테고리 값에 따라 레이블을 반환
    switch (categoryValue) {
      case 'DIGITAL':
        return '디지털 기기';
      case 'FURNITURE_INTERIOR':
        return '가구/인테리어';
      case 'CLOTHING':
        return '의류';
      case 'APPLIANCES':
        return '생활가전';
      case 'KITCHENWARE':
        return '생활/주방';
      case 'SPORTS_LEISURE':
        return '스포츠/레저';
      case 'CAR_TOOLS':
        return '자동차/공구';
      case 'BOOK':
        return '도서';
      case 'BEAUTY_COSMETIC':
        return '뷰티/미용';
      case 'PET':
        return '반려동물용품';
      case 'ETC':
        return '기타';
      default:
        return categoryValue;
    }
  }

  useEffect(() => {
    async function fetchPostDetails() {
      try {
        const response = await axios.get(
          `${QUERY.AXIOS_PATH.SEVER}/api/posts/${postId}`);
        console.log(response.data.result);
        console.log(response);
        setPost(response.data.result);
        setLoading(false);

        if (Storage.getUserId()) {
          try {
            const wishlistStatusResponse = await axiosInstance.get(
              `${QUERY.AXIOS_PATH.SEVER}/api/wishlist/status/${postId}`
            );
            setIsLiked(wishlistStatusResponse.data.isLiked);
          } catch (wishlistError) {
            navigate(ROUTER.PATH.MAIN);
          }
        }
      } catch (error) {
        console.error('게시물 정보 가져오기 오류:', error);
        setLoading(false);
      }
    }

    fetchPostDetails();
  }, [postId]);

  const handleChatButtonClick = async () => {
    try {
      const currentUserId = Storage.getUserId();
      if (currentUserId == null || post == null) {
        alert("로그인이 필요한 서비스 입니다");
        navigate(ROUTER.PATH.LOGIN);
      }
      const response = await axiosForLoginUser.get(
        `/api/chatting/createOrGetChatRoom?sellerId=${post.userid}&currentUserId=${currentUserId}&postId=${post.postId}`
      );
      console.log(response);
      setTimeout(async () => {
        const roomId = response.data.roomId;
        if (roomId) {
          navigate(ROUTER.PATH.CHATTING);
        } else {
          console.error('채팅방 생성에 실패했습니다.');
        }
      },);
    } catch (error) {
      if (error.response.status == 401) {
        navigate(ROUTER.PATH.MAIN);
      }
      console.error('Error creating or accessing the chat room:', error);
    }
  };

  const axiosInstance = new Axios(QUERY.AXIOS_PATH.SEVER);

  const handleWishlistButtonClick = async () => {
    if (!Storage.getUserId()) {
      alert("로그인이 필요한 서비스입니다.");
      navigate(ROUTER.PATH.LOGIN);
    }
    try {
      const apiUrl = QUERY.AXIOS_PATH.TOGGLE_WISHLIST;
      const response = await axiosInstance.post(apiUrl, { articleId: postId });

      if (response.data.success) {
        setIsLiked(!isLiked);
      } else {
        console.error('위시리스트 설정 실패');
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate(ROUTER.PATH.LOGIN);
      }
      if (error.response.status == 400) {
        alert("로그인이 필요한 서비스입니다")
        navigate(ROUTER.PATH.LOGIN);
      }
      console.error('위시리스트 설정 오류:', error);
    }
  };


  const handleDeleteButtonClick = () => {
    confirmAlert({

      message: '게시글을 삭제하시겠습니까?',
      buttons: [
        {
          label: '예',
          onClick: async () => {
            try {
              const apiUrl = `${QUERY.AXIOS_PATH.POSTDELETE.replace(':postId', postId)}`;
              const response = await axios.delete(apiUrl);
              if (response.status === 200) {
                alert('게시글이 성공적으로 삭제되었습니다.')
                navigate(ROUTER.PATH.BACK); // 삭제 후 POSTLIST 페이지로 이동
              } else {
                console.error('게시글 삭제 실패');
              }
            } catch (error) {
              console.error('게시물 삭제 오류:', error);
            }
          },
        },
        {
          label: '아니요',
          onClick: () => {
            console.log('게시물 삭제를 취소했습니다.');
          },
        },
      ],
    });
  };

  const handleUpdateButtonClick = async () => {
    console.log(post);
    navigate('/addPost', { state: { children: "수정", detail: post } });

  };

  const currentUserId = Storage.getUserId();
  console.log('현재 사용자 ID:', currentUserId);
  if (post != undefined && post != null) {
    console.log('게시글 작성자 ID:', post.userid);
    console.log('게시글 작성자 ID:', post.postId);
  }

  const formatPrice = (price) => {
    return price.toLocaleString('en-US');
  };

  const handleSafePaymentButtonClick = async () => {
    try {
      const currentUserId = Storage.getUserId();
      console.log('게시글 작성자 ID:', post.userid);
      if (currentUserId == null || post == null) {
        alert("로그인이 필요한 서비스 입니다");
        navigate(ROUTER.PATH.LOGIN);
      }
      const response = await axiosForLoginUser.get(
        `/api/chatting/createOrGetChatRoom?sellerId=${post.userid}&currentUserId=${currentUserId}&postId=${post.postId}`
      );
      setTimeout(async () => {
        const roomId = response.data.roomId;
        if (roomId) {
          console.log('채팅방생성', roomId)
          Storage.setRoomId(roomId)
          navigate(`/purchase/${postId}`);
        } else {
          console.error('채팅방 생성에 실패했습니다.');
        }
      },);
    } catch (error) {
      if (error.response.status == 401) {
        navigate(ROUTER.PATH.MAIN);
      }
      console.error('Error creating or accessing the chat room:', error);
    }
  };
  // 구매 페이지로 이동
  // navigate(`/purchase/${postId}`);

  return (
    <MainWrapper>
      <DetailWrapper>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <>
            <ImageContainer>
              <ImageSlider images={post.attachedFilesPaths} />
            </ImageContainer>
            <PostInfoContainer>
              <TitleText>{post.title}</TitleText>
              <PriceText>
                <strong>{formatPrice(post.price)} 원</strong>
              </PriceText>
              <ContentContainer>
                <CardDescription>{post.content}</CardDescription>
              </ContentContainer>
              {post.address && <MapComponent address={post.address} />}
              <CardText>거래지역 : {post.address}</CardText>
              <CardText>카테고리 : {getCategoryLabel(
                post.itemCategory)}</CardText>
              <CardText>판매자 : {post.nickName}</CardText>
              <CardText>조회수 : {post.viewCount}</CardText>
              {Number(post.userid) !== Number(currentUserId) && (
                <ButtonWrapper>
                  {post.dealingType === 'FOR_PAY' && (
                    <>
                      <LikeButton onClick={handleWishlistButtonClick}
                        isLiked={isLiked}>
                        <HeartIcon isLiked={isLiked}
                          icon={isLiked ? solidHeart
                            : regularHeart} />
                      </LikeButton>
                      <ChatButton
                        onClick={handleChatButtonClick}>캐럿톡</ChatButton>
                      <SafePaymentButton
                        onClick={handleSafePaymentButtonClick}>안전결제하기</SafePaymentButton>
                    </>
                  )}
                  {post.dealingType === 'WITHPERSONAL' && (
                    <>
                      <LikeButton onClick={handleWishlistButtonClick}
                        isLiked={isLiked}>
                        <HeartIcon isLiked={isLiked}
                          icon={isLiked ? solidHeart
                            : regularHeart} />
                      </LikeButton>
                      <ChatButton
                        onClick={handleChatButtonClick}>캐럿톡</ChatButton>
                    </>
                  )}
                  {post.dealingType === 'FOR_FREE' && (
                    <>
                      <LikeButton onClick={handleWishlistButtonClick}
                        isLiked={isLiked}>
                        <HeartIcon isLiked={isLiked}
                          icon={isLiked ? solidHeart
                            : regularHeart} />
                      </LikeButton>
                      <FreeShareText>나눔</FreeShareText>
                      <CarrotEmoji>🥕</CarrotEmoji>
                      <ChatButton
                        onClick={handleChatButtonClick}>캐럿톡</ChatButton>
                    </>
                  )}
                </ButtonWrapper>
              )}

              {Number(post.userid) === Number(currentUserId) && (
                <ButtonWrapper>
                  <DeleteButton
                    onClick={handleUpdateButtonClick}>수정하기</DeleteButton>
                  <DeleteButton
                    onClick={handleDeleteButtonClick}>삭제하기</DeleteButton>

                </ButtonWrapper>)}
            </PostInfoContainer>
          </>
        )}
      </DetailWrapper>
    </MainWrapper>
  );
}

const MainWrapper = styled.main`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const DetailWrapper = styled.div`
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 30px auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;


const ImageContainer = styled.div`
  flex: 1;
  padding: 20px;
  position: relative;
`;

const PostInfoContainer = styled.div`
  flex: 1;
  // padding: 10px;
`;

const ContentContainer = styled.div`
  width: 400px;
  max-height: 300px;
  overflow: auto;

`;

const CardText = styled.p`
  font-size: 16px;
  margin-bottom: 10px;

`;

const PriceText = styled.p`
  font-size: 30px;
`

const TitleText = styled.p`
  font-size: 24px;
  margin-bottom: 5px;
`;

const CardDescription = styled.p`
  font-size: 16px;
  margin: 10px 0;
  line-height: 1.5;
`;

const ChatButton = styled.button`
  padding: 10px 20px;
  background-color: #ff922b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #497da0;
  }
`;

const SafePaymentButton = styled(ChatButton)`
  background-color: #4caf50;
  margin-right: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LikeButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;

  &:hover {
    color: #ff4d4f;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  background-color: #ff922b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #497da0;
  }
`;

const HeartIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  color: ${(props) => (props.isLiked ? '#ff4d4f' : '#000')};
`;

const FreeShareText = styled.span`
  font-size: 18px;
  color: #ff4d4f;
`;

const CarrotEmoji = styled.span`
  font-size: 27px;
  margin-left: -17px;
`;

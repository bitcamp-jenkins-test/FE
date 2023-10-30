import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import Button from '../elements/Button';
import Input from '../elements/Input';
import Text from '../elements/Text';
import {FaBell, FaUserCircle} from 'react-icons/fa';
import {AiOutlineSearch} from 'react-icons/ai';
import {Link, useNavigate} from 'react-router-dom';
import ROUTER from '../constants/router';
import Storage from '../utils/localStorage';
import {useQueryClient} from '@tanstack/react-query';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import QUERY from '../constants/query';
import Axios from '../utils/api/axios';

export default function Navbar({showMyMenu, onShowMyMenu, onLogOut}) {
  const [keyWord, setKeyWord] = useState('');
  const navigate = useNavigate();
  const nickname = Storage.getNickName();
  const query = useQueryClient();
  const [imageClick, setImageClick] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const AxiosInstance = new Axios(QUERY.AXIOS_PATH.SEVER);
  const userId = Storage.getUserId();
  const [showSlideBar, setShowSlideBar] = useState(false);
  const [slideBarMessage, setSlideBarMessage] = useState("");

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (userId) {
        try {
          const response = await AxiosInstance.get(
              `/api/countUnread?userId=${userId}`);
          setUnreadCount(response.data);
          console.log("Unread count:", response.data);  // <- 여기 추가
        } catch (error) {
          console.error("Error fetching unread notifications count:", error);
        }
      }
    };

    fetchUnreadCount();
  }, [userId]);

  const markAllNotificationsAsRead = async () => {
    if (userId) {
      try {
        await AxiosInstance.put(`/api/markAsRead?userId=${userId}`);
        setNotifications(notifications => notifications.map(
            noti => ({...noti, isRead: "y"})));
        setUnreadCount(0);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    }
  };

  const deleteAllNotifications = async () => {
    if (userId) {
      try {
        await AxiosInstance.delete(`/api/deleteAll?userId=${userId}`);
        setNotifications([]);
        setUnreadCount(0);
      } catch (error) {
        console.error("Error deleting all notifications:", error);
      }
    }
  };

  const handleNotificationClick = async () => {
    setShowModal(!showModal);
    if (!showModal && userId) {
      try {
        const response = await AxiosInstance.get(
            `/api/notifications?userId=${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8888/api/websocket', [],
        {withCredentials: true});

    const stompClient = new Client({
      webSocketFactory: () => socket,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => [notification, ...prev]);

        setUnreadCount((prevCount) => prevCount + 1);

        if (notification.content.includes("희망")) {
          setSlideBarMessage(notification.content);
          setShowSlideBar(true);
        }
      });
    };

    stompClient.activate();

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyWord) {
      return;
    }
    navigate(ROUTER.PATH.MAIN, {state: {word: keyWord}});
    //navigate(`/search/${keyWord}`);
  };

  const handleLogoClick = () => {
    query.invalidateQueries(['posts']);
  };

  const handleTransaction = () => {
    query.invalidateQueries(['HotPost']);
  };

  const handleLogout = (e) => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      window.localStorage.clear();
      navigate(ROUTER.PATH.MAIN);
    }
  };

  const handleChatButtonClick = () => {
    navigate(ROUTER.PATH.CHATTING);
  };

  const clickImage = () => {
    setImageClick((state) => !state);
  };

  useEffect(() => {
    if (imageClick != null) {
      onShowMyMenu((state) => !state);
    }
  }, [imageClick]);

  return (
      <NavbarWrapper>
        <NavbarContainer>
          <LogoContainer>
            <Link to={ROUTER.PATH.MAIN}>
              <Logo onClick={handleLogoClick}>
                <img src='/img/chatroom.png' alt=''/>
              </Logo>
            </Link>
            <Link to={ROUTER.PATH.HOT_ARTICLES}>
              <Text large_regular onClick={handleTransaction}>
                CarrortThunder
              </Text>
            </Link>
          </LogoContainer>
          <FormContainer onSubmit={handleSubmit}>
            <Input
                placeholder='물품이나 동네를 검색해 보세요.'
                inLineLabel
                label={<AiOutlineSearch/>}
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
            />
            {nickname && (
                <NotificationIcon onClick={handleNotificationClick}>
                  <FaBell size={30}/>
                  <NotificationBadge>{unreadCount}</NotificationBadge>
                </NotificationIcon>
            )}
            {nickname ? (
                <ShowMyMenuContainer>
                  <Text large_medium>
                    {(Storage.getPhoto() === undefined || Storage.getPhoto()
                        === null) ? (
                        <FaUserCircle id='MyMenu' onClick={clickImage}/>
                    ) : (
                        <img
                            src={`https://kr.object.ncloudstorage.com/carrot-thunder/user/${Storage.getPhoto()}`}
                            style={{
                              width: '1.2cm',
                              height: '1.2cm',
                              overflow: 'hidden',
                              borderRadius: '50%',
                              cursor: 'pointer',
                            }}
                            onClick={clickImage}
                        />
                    )}
                  </Text>
                  <span>{nickname}</span>
                  {showMyMenu ? (
                      <ShowMyMenu>
                        <span onClick={handleChatButtonClick}>캐럿톡</span>
                        <span>
                    <Link to={ROUTER.PATH.MYPAGE}> 마이페이지 </Link>
                  </span>
                        <span>
                    <Link to={ROUTER.PATH.ADDPOST}>게시글 작성 </Link>
                  </span>
                        <span onClick={handleLogout}>로그아웃</span>
                      </ShowMyMenu>
                  ) : (
                      ''
                  )}
                </ShowMyMenuContainer>
            ) : (
                <Link to={ROUTER.PATH.LOGIN}>
                  <Button small type='button'>
                    로그인
                  </Button>
                </Link>
            )}
          </FormContainer>
        </NavbarContainer>
        {showModal && (
            <NotificationModal
                notifications={notifications}
                onClose={() => setShowModal(false)}
                onMarkAllAsRead={markAllNotificationsAsRead}
                onDeleteAll={deleteAllNotifications}
            />
        )}
        <NotificationSlideBar
            show={showSlideBar}
            message={slideBarMessage}
            onClose={() => setShowSlideBar(false)}
        />
      </NavbarWrapper>
  );
}

function NotificationModal({
  notifications,
  onClose,
  onMarkAllAsRead,
  onDeleteAll
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
      <ModalOverlay>
        <ModalContent ref={modalRef}>
          <CloseButton onClick={onClose}>X</CloseButton>
          <Title>내 알림</Title>
          <ModalButtonContainer>
            <ModalButton onClick={onMarkAllAsRead}>전체 읽기</ModalButton>
            <ModalButton onClick={onDeleteAll}>전체 삭제</ModalButton>
          </ModalButtonContainer>
          <NotificationList>
            {notifications.map((notification) => (
                <NotificationComponent key={notification.id}
                                       notification={notification}
                                       onClose={onClose}/>
            ))}
          </NotificationList>
        </ModalContent>
      </ModalOverlay>
  );
}

function NotificationComponent({notification, onClose}) {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    console.log("Notification clicked with content:", notification.content);
    if (notification.content.includes("메시지") || notification.content.includes(
        "희망")) {
      onClose();
      navigate(ROUTER.PATH.CHATTING);
    }
  };

  const isPreviewIncluded = notification.content.includes("미리보기");
  let normalContent = notification.content;
  let previewContent = "";

  if (isPreviewIncluded) {
    const splitContent = notification.content.split("미리보기:");
    normalContent = splitContent[0];
    previewContent = "미리보기:" + splitContent[1];
  }

  return (
      <NotificationItem isRead={notification.isRead === "y"}
                        onClick={handleNotificationClick}>
        {normalContent}
        {isPreviewIncluded && <PreviewText>{previewContent}</PreviewText>}
      </NotificationItem>
  );
}

function NotificationSlideBar({show, message, onClose}) {
  useEffect(() => {
    if (show) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 3500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [show, onClose]);

  return (
      <SlideBarWrapper show={show}>
        <SlideBarContent>
          <SlideBarCloseButton onClick={onClose}>X</SlideBarCloseButton>
          {message}
        </SlideBarContent>
      </SlideBarWrapper>
  );
}

// 모달 스타일 및 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 60px; // 알림 아이콘 바로 아래로 조절
  right: 300px; // 알림 아이콘 바로 우측으로 조절 (이 값을 조정해가며 위치를 맞춰보세요)
  width: 310px; // 원하는 너비로 조절
  max-height: 400px; // 모달창 내용이 너무 많아질 경우 스크롤 생성
  overflow-y: auto; // 세로 스크롤 생성
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  white-space: pre-line;
`;

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  // margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c0c0c0;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const ModalButton = styled.button`
  background-color: #ff922b;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #ff7518;
  }
`;

const SlideBarCloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 42rem;
  background-color: ${(props) => props.theme.color.white};
  z-index: 1000;
`;

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 70rem;
  width: 100%;
  padding: 0 1rem;
`;

const LogoContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  p {
    color: ${(props) => props.theme.color.carrot_orange};
  }
`;

const Logo = styled.div`
  img {
    width: 5rem;
    height: 4rem;
  }
`;

const FormContainer = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 30rem;
  width: 100%;
  gap: 1rem;

  svg {
    color: ${(props) => props.theme.color.messenger};
    cursor: pointer;
  }
`;

const ShowMyMenuContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 1rem;
  white-space: nowrap;
`;

const ShowMyMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0.25px solid ${(props) => props.theme.color.messenger};
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.color.white};
  transform: translate(0, 4rem);
  z-index: 1000;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8rem;
    height: 1.5rem;
    padding: 1rem;
    border-bottom: 0.25px solid ${(props) => props.theme.color.messenger};
    font-size: 100%;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :hover {
      background-color: ${(props) => props.theme.color.messenger};
    }

    &:first-child {
      border-radius: 0.5rem 0.5rem 0 0;
    }

    &:last-child {
      border: none;
      border-radius: 0 0 0.5rem 0.5rem;
    }
  }

  a {
    font-size: 100%;
  }
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -10px; // 위치 조절
  right: -10px; // 위치 조절
  background-color: orange;
  color: black;
  border-radius: 50%;
  padding: 4px 8px; // 패딩 조정
  font-size: 14px; // 폰트 크기 조절
  border: 2px solid yellow;
  width: 24px; // 크기 조절
  height: 24px; // 크기 조절
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NotificationItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  color: ${({isRead}) => (isRead ? "#aaa"
          : "black")}; // 읽은 항목은 연한 색, 읽지 않은 항목은 진한색
  font-weight: ${({isRead}) => (isRead ? "normal" : "bold")}; // 읽지 않은 항목은 볼드체

  &:last-child {
    border-bottom: none;
  }
`;

const SlideBarWrapper = styled.div`
  position: fixed;
  top: 10%;
  right: 0;
  width: 280px;
  height: 60px;
  transform: ${({show}) => (show ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
`;

const SlideBarContent = styled.div`
  background-color: #ff922b;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const PreviewText = styled.span`
  font-size: 83%; // 작은 폰트 크기로 조절
  color: rgba(0, 0, 0, 0.7); // 색상을 아주 살짝 연하게 조정
`;

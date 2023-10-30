import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Axios from '../utils/api/axios';
import QUERY from '../constants/query';
import styled from 'styled-components';
import Storage from '../utils/localStorage';
import ROUTER from '../constants/router';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const axios = new Axios(QUERY.AXIOS_PATH.SEVER);

const MyChatRooms = ({onRoomSelect}) => {
  const navigator = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [images, setImages] = useState({});
  const userId = Storage.getUserId();
  const chatRoomsContainerRef = useRef(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const fetchChatRooms = async () => {
    try {
      const response = await axios
      .get(`/api/chatting/myChatRooms?userId=${userId}`)
      .catch((error) => {
        if (error.response.status == 401) {
          navigator(ROUTER.PATH.LOGIN);
        }
        console.error('Error fetching old messages:', error);
      });

      setChatRooms(response.data.chatRooms);

      const validChatRooms = response.data.chatRooms.filter(
          (room) => room.postId !== 0
      );

      const imagePromises = validChatRooms.map((room) =>
          axios
          .get(`/api/chatting/getFirstAttachment?postId=${room.postId}`)
          .catch((error) => {
            if (error.response.status == 401) {
              navigator(ROUTER.PATH.MAIN);
            }
            console.error('Error fetching ', error);
          })
      );

      const imageResponses = await Promise.all(imagePromises);
      const tempImages = {};
      validChatRooms.forEach((room, index) => {
        tempImages[room.postId] = `http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${imageResponses[index].data}?type=f&w=250&h=250`;
      });
      setImages(tempImages);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [chatRooms]);

  useEffect(() => {
    fetchChatRooms();
  }, [userId]);

  const getCounterpartNickname = (room) => {
    if (room.sellerId.toString() === userId) {
      return room.buyerNickname;
    }
    return room.sellerNickname;
  };

  useEffect(() => {
    const socket = new SockJS('http://223.130.132.158:8888/api/websocket');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/newChatRoom', (message) => {
        if (message.body) {
          updateChatRooms(message.body);
        }
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    if (chatRoomsContainerRef.current) {
      chatRoomsContainerRef.current.scrollTop = 0;
    }
  }

  const updateChatRooms = async (roomId) => {
    const newRoom = await fetchNewChatRoom(roomId);
    if (newRoom) {
      const existingRoomIndex = chatRooms.findIndex(
          room => room.roomId === roomId);
      if (existingRoomIndex !== -1) {
        const updatedRooms = [...chatRooms];
        updatedRooms[existingRoomIndex] = newRoom;
        setChatRooms(updatedRooms);
        scrollToTop();  // 여기서 스크롤을 최상단으로 이동
      } else {
        fetchChatRooms();
      }
    }
  };

  const fetchNewChatRoom = async (roomId) => {

    try {
      const response = await axios.get(`/api/chatting/room/${roomId}`);
      const newRoom = response.data.room;

      const imageResponse = await axios.get(
          `/api/chatting/getFirstAttachment?postId=${newRoom.postId}`);
      const imageUrl = `http://xflopvzfwqjk19996213.cdn.ntruss.com/article/${imageResponse.data}?type=f&w=250&h=250`;
      setImages(prevImages => ({...prevImages, [newRoom.postId]: imageUrl}));

      return newRoom;  // Return new room
    } catch (error) {
      console.error('Failed to fetch new chat room:', error);
      return null;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}분`;
  };

  const handleChatButtonClick = (roomId) => {
    setSelectedRoomId(roomId);
    onRoomSelect(roomId);
  };

  const deleteChatRoom = async (roomId) => {
    try {
      const response = await axios.delete(`/api/chatting/delete/${roomId}`);

      if (response.status === 200) {
        // 나가기에 성공한 경우, 채팅방 목록을 다시 불러오고 채팅방 비활성화
        fetchChatRooms();
        onRoomSelect(null);
      } else {
        console.error('Failed to leave chat room');
      }
    } catch (error) {
      console.error('Error leaving chat room:', error);
    }
  };

  return (
      <ChatRoomsContainer ref={chatRoomsContainerRef}>
        <h3>전체대화</h3>
        <ul>
          {chatRooms.map((room, index) => (
              <ChatRoomItem key={room.roomId}
                            onClick={() => handleChatButtonClick(room.roomId)}
                            selected={room.roomId === selectedRoomId}>
                <Link to={`/post/${room.postId}`}>
                  <ChatRoomImage src={images[room.postId]} alt="게시글 이미지"/>
                </Link>
                <ChatRoomContent>
                  <ChatRoomName>{room.postTitle}</ChatRoomName>
                  <MessageTitle>대화상대: {getCounterpartNickname(
                      room)}</MessageTitle>
                  <LastMessage>최근대화: {room.lastMessage?.length > 13
                      ? room.lastMessage.slice(0, 13) + '...'
                      : room.lastMessage}</LastMessage>
                  <DateText>{formatTime(room.lastUpdated)}</DateText>
                </ChatRoomContent>
                <ChatButton
                    onClick={() => deleteChatRoom(room.roomId)}>나가기</ChatButton>
              </ChatRoomItem>
          ))}
        </ul>
      </ChatRoomsContainer>
  );
};

const ChatRoomsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  width: 100%;
  background-color: #f8f9fa;
  border: 1px solid white;
  overflow-y: auto;
  border-radius: 5px;

  font-family: 'Noto Sans KR', sans-serif;

  h3 {
    font-size: 24px;
    font-weight: bold;
    margin-top: 20px;
    color: #333;
    margin-bottom: 20px;
    text-align: left;
    margin-left: 15px;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ChatRoomItem = styled.li`
  display: flex;
  align-items: center;
  margin: 0 10px 10px 10px;
  background-color: ${props => props.selected ? 'lightgray' : 'white'};
  border: 1px solid #c0c0c0;
  padding: 15px;
  border-radius: 10px;
`;

const ChatRoomContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 20px;
`;

const ChatRoomName = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ChatButton = styled.button`

  padding: 5px 10px;
  background-color: #ff922b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
`;

const MessageTitle = styled.div`
  font-size: 15px;
  font-weight: normal;
  margin-bottom: 5px;
`;

const LastMessage = styled.span`
  font-size: 14px;
  color: #777;
  display: block;
  margin-bottom: 5px;
`;

const DateText = styled.span`
  font-size: 14px;
  color: #777;
`;

const ChatRoomImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
`;

export default MyChatRooms;

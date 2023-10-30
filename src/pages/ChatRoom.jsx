import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Storage from '../utils/localStorage';
import Axios from '../utils/api/axios';
import QUERY from '../constants/query';
import ROUTER from '../constants/router';
import FormatChatTime from '../components/FormatChatTime';

const axios = new Axios(QUERY.AXIOS_PATH.SEVER);

function ChatRoom({ roomId }) {
  const [clickedMessageTop, setClickedMessageTop] = useState(0);
  const [clickedMessageLeft, setClickedMessageLeft] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [targetLang, setTargetLang] = useState('ko');
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  const [isClickedMessage, setIsClickedMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const [isTranslationOptionsVisible, setTranslationOptionsVisible] = useState(
    false);
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const inputRef = useRef(null);

  const handleDocumentClick = (event) => {
    // 클릭한 요소가 메시지 또는 삭제 버튼 모달창인 경우 return
    if (event.target.closest('.message') || event.target.closest(
      '.delete-modal')) {
      return;
    }

    setIsClickedMessage(false);  // 메시지 클릭 상태를 false로 설정
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // 클릭 이벤트를 document에 추가
    document.addEventListener('click', handleDocumentClick);

    // 클릭 이벤트를 제거 (cleanup function)
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);  // 빈 의존성 배열로 useEffect는 컴포넌트가 마운트될 때만 실행

  useEffect(() => {
    setMessages([]);
    const socket = new SockJS('http://localhost:8888/api/websocket',
      [], { withCredentials: true });
    const userId = Storage.getUserId();

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        userId: userId,
      },
    });

    stompClient.current.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      stompClient.current.subscribe(`/topic/messages/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [
          ...prevMessages,
          parsedMessage,
        ]);
      });
      axios
        .get(`/api/chatting/message/${roomId}`)
        .then((response) => response.data)
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigator(ROUTER.PATH.MAIN);
          }
          console.error('Error fetching old messages:', error);
        });
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current.connected) {
        stompClient.current.deactivate();
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
  }, [roomId, targetLang]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (roomId && inputValue.trim() !== '' && stompClient.current
      && stompClient.current.connected) {
      const chatMessage = {
        roomId: roomId,
        content: inputValue,
        sentAt: new Date(),
        senderId: parseInt(Storage.getUserId()),
        targetLang: targetLang,
      };
      stompClient.current.publish(
        { destination: '/app/send', body: JSON.stringify(chatMessage) });
      setInputValue('');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: '영어 English' },
    { value: 'ja', label: '일본어 日本語' },
    { value: 'zh-CN', label: '중국어 간체 中文(简体)' },
    { value: 'zh-TW', label: '중국어 번체 中文(繁體)' },
    { value: 'vi', label: '베트남어 Tiếng Việt' },
    { value: 'th', label: '태국어 ไทย' },
    { value: 'id', label: '인도네시아어 Bahasa Indonesia' },
    { value: 'fr', label: '프랑스어 Français' },
    { value: 'es', label: '스페인어 Español' },
    { value: 'ru', label: '러시아어 Русский' },
    { value: 'de', label: '독일어 Deutsch' },
    { value: 'it', label: '이탈리아어 Italiano' },
  ];

  const sendEmojiMessage = (emojiCode) => {
    const chatMessage = {
      roomId: roomId,
      content: emojiCode,
      senderId: parseInt(Storage.getUserId()),
      targetLang: targetLang,
    };
    stompClient.current.publish(
      { destination: '/app/send', body: JSON.stringify(chatMessage) });
    setEmojiPickerVisible(false);
  };

  const renderMessageContent = (messageContent) => {
    if (messageContent.startsWith(":emoji") && messageContent.endsWith(":")) {
      const emojiNumber = messageContent.split(":")[1].replace("emoji", "");
      return <img src={`/img/emoji${emojiNumber}.png`}
        alt={`emoji${emojiNumber}`} />;
    }
    return messageContent;
  };

  // const renderMessageContent = (messageContent) => {
  //   if (messageContent.startsWith(":emoji") && messageContent.endsWith(":")) {
  //     const emojiNumber = messageContent.split(":")[1].replace("emoji", "");
  //     return <img src={`/img/emoji${emojiNumber}.png`}
  //       alt={`emoji${emojiNumber}`} />;
  //   }
  //   return messageContent;

  const clickMessage = (index, e) => {
    console.log("index : " + index);
    console.log("메세지", messages)
    //다른 인덱스값을 누르는 경우면 삭제하기 버튼이 유지되야하고,
    //그게 아니라면, 토글되어야한다.
    if (index === messageIndex) {
      setIsClickedMessage((index) => !index);
    } else {
      setIsClickedMessage(true);
      setMessageIndex(index);
    }

    // 클릭한 메시지의 위치를 계산
    const clickedMessageTop = e.clientY;
    setClickedMessageLeft(e.clientX);
    setClickedMessageTop(clickedMessageTop);
  }

  const handleUpdateMessage = (messageId) => {
    console.log("메세지 확인", messageId)
    const updatedMessage = { content: '삭제된 메시지입니다' };
    axios
      .put(`${QUERY.AXIOS_PATH.DELETECHAT}/${messageId}`, updatedMessage)
      .then(() => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((message) => {
            if (message.messageId === messageId) {
              message.content = '삭제된 메시지입니다';
              message.transContent = '';
            }
            return message;
          });
          return updatedMessages;
        });
      })
      .catch((error) => {
        console.error('Error updating message:', error);
      });
  };

  return (
    <>
      <OpenButton onClick={openModal}>번역할 언어 선택</OpenButton>
      {isModalOpen && (
        <>
          <ModalOverlay
            onClick={closeModal}></ModalOverlay> {/* 배경 클릭시 모달 닫기 */}
          <TranslationOptions>
            <Title>언어 선택</Title>
            {languageOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="language"
                  value={option.value}
                  checked={targetLang === option.value}
                  onChange={(e) => {
                    setTargetLang(e.target.value);
                    setSelectedLanguage(option.label);
                  }}
                />
                {option.label}
              </label>
            ))}
            <Button onClick={() => setIsModalOpen(false)}>확인</Button>
          </TranslationOptions>
        </>
      )}
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBox
            sender={Storage.getUserId() === String(message.senderId)}>
            {Storage.getUserId() === String(message.senderId) && (
              <SentTime style={{ marginRight: '5px' }}>
                <FormatChatTime sentAt={message.sentAt} />
              </SentTime>
            )}
            <MessageBubble
              className="message"
              onClick={(e) => clickMessage(index, e)} // 변경된 부분
              key={index}
              sender={Storage.getUserId() === String(message.senderId)}
            >
              <span
                className="senderNickname">{message.senderNickname}</span>
              {message.content === '삭제된 메세지입니다' ? (
                renderMessageContent(message.content)
              ) : (
                <>
                  {renderMessageContent(message.content)}
                  {message.transContent && (
                    <span><br />({message.transContent})</span>
                  )}
                </>
              )}

            </MessageBubble>
            {Storage.getUserId() !== String(message.senderId) && (
              <SentTime style={{ marginLeft: '5px' }}>
                <FormatChatTime sentAt={message.sentAt} />
              </SentTime>
            )}
          </MessageBox>
        ))}
        <ShowMyMenu
          className="delete-modal"
          clickedMessageTop={clickedMessageTop}
          clickedMessageLeft={clickedMessageLeft}>
          {(isClickedMessage === true && messages[messageIndex].senderId === parseInt(Storage.getUserId()) && messages[messageIndex].content !== '삭제된 메세지입니다') ? (
            <span onClick={() => handleUpdateMessage(messages[messageIndex].messageId)}>
              삭제하기
            </span>
          ) : (
            <></>
          )}
        </ShowMyMenu>

        <div ref={messagesEndRef}></div>
      </MessagesContainer>
      <InputContainer>
        <EmojiPickerButton onClick={() => setEmojiPickerVisible(
          !isEmojiPickerVisible)}>+</EmojiPickerButton>
        {isEmojiPickerVisible && (
          <EmojiPicker>
            <Emoji onClick={() => sendEmojiMessage(":emoji1:")}><img
              src="/img/emoji1.png" alt="emoji1" /></Emoji>
            <Emoji onClick={() => sendEmojiMessage(":emoji2:")}><img
              src="/img/emoji2.png" alt="emoji2" /></Emoji>
            <Emoji onClick={() => sendEmojiMessage(":emoji3:")}><img
              src="/img/emoji3.png" alt="emoji3" /></Emoji>
            <Emoji onClick={() => sendEmojiMessage(":emoji4:")}><img
              src="/img/emoji4.png" alt="emoji4" /></Emoji>
            <Emoji onClick={() => sendEmojiMessage(":emoji5:")}><img
              src="/img/emoji5.png" alt="emoji5" /></Emoji>
          </EmojiPicker>
        )}
        <TextInput value={inputValue}
          ref={inputRef}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="메시지를 입력해주세요..." />
        <SendButton onClick={sendMessage}>보내기</SendButton>
      </InputContainer>
    </>
  );
}

export default ChatRoom;

const shouldForwardProp = (prop) => prop !== 'sender' && prop !== 'isVisible';
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #7c7979;
  background-image: url("/img/chatroom.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50%;

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

const MessageBubble = styled.div.withConfig({
  shouldForwardProp
})`
  max-width: 60%;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: ${props => props.sender ? ' #ff922b;' : '#7c7979'};
  border-radius: ${props => props.sender ? '10px 10px 10px 0'
    : '10px 10px 0 10px'};
  align-self: ${props => props.sender ? 'flex-end' : 'flex-start'};
  color: #ffffff;
  display: inline-block;

  .senderNickname {
    font-size: 0.7em;
    display: block;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 2px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid white;
  position: relative; // 이 부분을 추가합니다.

  :focus {
    outline: 1px solid orange; // 2px 테두리의 두께를 설정하며, 'orange'로 색상을 설정
  }
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  background-color: #ff922b;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); // 반투명한 검정색 배경
  backdrop-filter: blur(4px); // 블러 처리
  z-index: 1;
`;

const TranslationOptions = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  z-index: 4;
  padding: 20px;

  label {
    display: block;
    margin: 10px;
  }

  input[type="radio"] {
    margin-right: 5px;
    cursor: pointer;
  }
}`;

const EmojiPickerButton = styled.button`
  background-color: #f8f9fa;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-right: 10px;
`;

const EmojiPicker = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  display: flex;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  width: 500px;
`;

const Emoji = styled.div`
  cursor: pointer;
  margin: 0 5px;

  img {
    width: 90px;
    height: 90px;
  }
`;

const ShowMyMenu = styled.div`
  position: absolute;
  top: ${props => props.clickedMessageTop}px; // 변경된 부분
  left: ${props => props.clickedMessageLeft}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0.25px solid ${props => props.theme.color.messenger};
  border-radius: 0.5rem;
  background-color: ${props => props.theme.color.white};
  z-index: 1000;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8rem;
    height: 1.5rem;
    padding: 1rem;
    border-bottom: 0.25px solid ${props => props.theme.color.messenger};
    font-size: 100%;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :hover {
      background-color: ${props => props.theme.color.messenger};
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

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c0c0c0;
`;

const OpenButton = styled.button`
  background-color: #ff922b;
  color: #ffffff;
  padding: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Button = styled.button`
  background-color: #ff922b;
  color: #ffffff;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: right;
`;
const SentTime = styled.div`
  font-size: 12px;
  align-self: ${props => props.time ? 'flex-start' : 'flex-end'};
  margin-bottom: 10px;
  color: ffffff;
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: ${props => props.sender ? 'flex-end' : 'flex-start'};
  flex-direction: row;
`;

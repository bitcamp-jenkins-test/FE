import React, {useState} from 'react';
import styled from 'styled-components';
import MyChatRooms from './MyChatRooms';
import ChatRoom from './ChatRoom';

const ChattingPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleRoomSelect = (roomId) => {
    console.log("Selected Room ID:", roomId);
    setSelectedRoomId(roomId);
  };

  return (
      <ChattingPageContainer>
        <MyChatRoomsContainer>
          <MyChatRooms onRoomSelect={handleRoomSelect}/>
        </MyChatRoomsContainer>
        <ChatRoomContainer>
          {selectedRoomId ? (
              <ChatRoom roomId={selectedRoomId}/>
          ) : (
              <>
                <PlaceholderContainer>
                  <PlaceholderImage src="/img/chatroom.png"
                                    alt="Chatroom Placeholder"/>
                </PlaceholderContainer>
                <InputContainer>
                  <EmojiPickerButton>+</EmojiPickerButton>
                  <TextInput placeholder="메시지를 입력해주세요..." disabled/>
                  <SendButton disabled>보내기</SendButton>
                </InputContainer>
              </>
          )}
        </ChatRoomContainer>
      </ChattingPageContainer>
  );
};

const ChattingPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70vh;
  gap: 10px;
  margin-top: 70px;
`;

const ChatRoomContainer = styled.div`
  flex: none;
  width: 27vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border-left: 1px solid #c0c0c0;
  overflow-y: hidden;
  border-radius: 5px;
  border: 1px solid rgba(128, 128, 128, 0.2); // 연한 회색 테두리 추가
`;

const MyChatRoomsContainer = styled.div`
  flex: none;
  width: 25vw;
  height: 70vh;
  border-right: 1px solid #c0c0c0;
  overflow-y: hidden;
  border-radius: 5px;
  border: 1px solid rgba(128, 128, 128, 0.2); // 연한 회색 테두리 추가
`;

const PlaceholderContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PlaceholderImage = styled.img`
  max-width: 50%;
  opacity: 0.5;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #c0c0c0;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #c0c0c0;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  background-color: #c0c0c0;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff922b;
  }
`;

const EmojiPickerButton = styled.button`
  background-color: #f8f9fa;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-right: 10px;
`;

export default ChattingPage;

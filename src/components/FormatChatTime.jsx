import React from 'react';

const FormatChatTime = ({ sentAt }) => {
  const messageDate = new Date(sentAt);
  const currentDate = new Date();

  const timeDifference = currentDate - messageDate;
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const monthDifference =
    currentDate.getMonth() - messageDate.getMonth() +
    12 * (currentDate.getFullYear() - messageDate.getFullYear());
  const yearDifference = currentDate.getFullYear() - messageDate.getFullYear();

  if (dayDifference === 0) {
    return (
      <span>
        {new Date(sentAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </span>
    );
  } else if (dayDifference === 1) {
    return '1일 전';
  } else if (dayDifference < 7) {
    return `${dayDifference}일 전`;
  } else if (monthDifference === 0) {
    return '1주 전';
  } else if (monthDifference === 1) {
    return '1달 전';
  } else if (monthDifference < 12) {
    return `${monthDifference}달 전`;
  } else {
    return `${yearDifference}년 전`;
  }
};

export default FormatChatTime;

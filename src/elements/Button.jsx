import React from 'react';
import styled, { css } from 'styled-components';

const Button = ({ onClick, type, like, ...props }) => {
  if (like) return <LikeBtn {...props} onClick={onClick} type={type} />;
  return <BtnBx {...props} onClick={onClick} type={type} />;
};

Button.defaultProps = {
  width: '120px;',
  height: '40px;',
  backgroundColor: `${props => props.theme.color.white}`,
  color: `${props => props.theme.color.black}`,
};

const BtnBx = styled.button`
  ${props =>
    props.disabled &&
    css`
      background-color: #ddd !important;
      cursor: not-allowed !important;
    `}
  ${props =>
    props.full
      ? css`
          width: 100%;
        `
      : `width: ${props.width}`};
  ${props =>
    props.large
      ? css`
          width: 200px;
          height: 50px;
        `
      : `width: ${props.width}`};
  ${props =>
    props.small
      ? css`
          width: 100px;
        `
      : `width: ${props.width}`};

  border: none;

  ${props =>
    props.outline &&
    css`
      border: 1px solid ${props => props.theme.color.carrot_orange};
      background-color: ${props => props.theme.color.white};
      color: ${props => props.theme.color.carrot_orange};
      transition: all 0.3s ease-in-out;
      &:hover {
        transform: scale(1.05);
        transition: all 0.3s ease-in-out;
      }
    `};

  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
`;

const LikeBtn = styled.button`
  border-radius: 10px;
  background-color: #e74133;
  color: white;
  font-size: 17px;
  border: none;
  display: flex;
  align-items: center;
  margin-right: 1rem;

  transition: all 0.3s ease-in-out;
  letter-spacing: 2px;

  :hover {
    background-color: #f54d3e;
    transition: all 0.3s ease-in-out;
  }

  ::before {
    content: '';
    background-size: 100%;
    background-repeat: no-repeat;
    color: transparent;
    position: relative;
    width: 40px;
    height: 40px;
    display: block;
    transition: all 0.6s ease-in-out;
  }

  :hover:before {
    transition: all 0.6s ease-in-out;
    transform: rotate(-1turn);
  }
`;

export default Button;

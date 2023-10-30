import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function Loading() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    return () => setLoading(false);
  }, []);

  return (
    <LodingContainer loading={loading}>
      <div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </LodingContainer>
  );
}

const LodingContainer = styled.main`
  display: ${props => (props.loading ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  div {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 64px;
      height: 64px;
      margin: 8px;
      border: 8px solid #df7f00;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #df7f00 transparent transparent transparent;
    }
    div:nth-child(1) {
      animation-delay: -0.45s;
    }
    div:nth-child(2) {
      animation-delay: -0.3s;
    }
    div:nth-child(3) {
      animation-delay: -0.15s;
    }
    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

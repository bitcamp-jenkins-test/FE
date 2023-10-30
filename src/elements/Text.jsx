import React from 'react';
import styled, { css } from 'styled-components';

export default function Text({ ...props }) {
  return <TextStyle {...props} />;
}

const TextStyle = styled.p`
  margin: 1rem 0;
  ${props =>
    props.regular &&
    css`
      margin: 1rem 0;
      font-size: ${props => props.theme.fontSize.regular};
      font-weight: ${props => props.theme.fontWeight.bold};
    `}

  ${props =>
    props.large_regular &&
    css`
      margin: 1rem 0;
      font-size: ${props => props.theme.fontSize.large_regular};
      font-weight: ${props => props.theme.fontWeight.bold};
    `}

  ${props =>
    props.medium &&
    css`
      margin: 1rem 0;
      font-size: ${props => props.theme.fontSize.medium};
      font-weight: ${props => props.theme.fontWeight.bold};
    `}

    ${props =>
    props.large_medium &&
    css`
      margin: 1rem 0;
      font-size: ${props => props.theme.fontSize.large_medium};
      font-weight: ${props => props.theme.fontWeight.bold};
    `}

  ${props =>
    props.large &&
    css`
      margin: 1rem 0;
      font-size: ${props => props.theme.fontSize.large};
      font-weight: ${props => props.theme.fontWeight.bold};
    `}

  ${props =>
    props.userContent &&
    css`
      margin: 0.3rem 0;
      font-size: ${props => props.theme.fontSize.regular};
    `}

  ${props =>
    props.userTitle &&
    css`
      margin: 0.3rem 0;
      font-size: ${props => props.theme.fontSize.regular};
      font-weight: ${props => props.theme.fontWeight.semi_bold};
    `}

  ${props =>
    props.userLocation &&
    css`
      margin: 0.3rem 0;
      font-size: ${props => props.theme.fontSize.small};
    `}

  ${props =>
    props.bold &&
    css`
      font-weight: ${props => props.theme.fontWeight.bold};
    `}

  ${props =>
    props.grey &&
    css`
      color: ${props => props.theme.color.light_grey};
    `}

    ${props =>
    props.grey &&
    css`
      color: ${props => props.theme.color.light_grey};
    `}
`;

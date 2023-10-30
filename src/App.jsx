import styled, { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyle from './styles/globalStyle';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import { removeCookie } from './utils/cookie';
import QUERY from './constants/query';
import Storage from './utils/localStorage';
import dotenvExpand from 'dotenv-expand';

function App() {
  const [showMyMenu, setShowMyMenu] = useState(false);

  // const handleShowMyMenu = () => {
  //   setShowMyMenu();
  // };

  const handleLogOut = () => {
    Storage.removeUserName();
    removeCookie(QUERY.COOKIE.COOKIE_NAME);
    setShowMyMenu(false);
  };

  const hadlePageClick = e => {
    if (e.target.id === 'MyMenu') return;
    if (e.target.innerText === '채팅') return;
    if (e.target.innerText === '게시글 작성') return;
    if (e.target.innerText === '로그아웃') return;

    setShowMyMenu(false);
  };
  return (
    <Wrapper onClick={hadlePageClick}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Navbar
          showMyMenu={showMyMenu}
          onShowMyMenu={setShowMyMenu}
          onLogOut={handleLogOut}
        />
        <Outlet />
      </ThemeProvider>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

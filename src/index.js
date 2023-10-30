import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Main from './pages/MainPage';
import ROUTER from './constants/router';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Kakao from './pages/KakaoPage';
import AddPost from './pages/AddPostPage';
import Payment from './pages/PaymentPage';
import MyPage from './pages/MyPage';
import PostDetail from './pages/PostDetailPage';
import ChatRoom from './pages/ChatRoom';
import MyChatRooms from './pages/MyChatRooms';
import ChattingPage from './pages/ChattingPage'; 
import ProfileEditPage from './pages/ProfileEditPage';
import Purchase from './pages/PurchasePage'


const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: ROUTER.PATH.MAIN,
    element: <App />,
    children: [
      {
        index: true,
        element: <Main />,
      },

      {
        path: ROUTER.PATH.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTER.PATH.SIGNUP,
        element: <Signup />,
      },
      {
        path: ROUTER.PATH.MYPAGE,
        element: <MyPage />,
      },
      {
        path: ROUTER.PATH.ADDPOST,
        element: <AddPost />,
      },
      {
        path: ROUTER.PATH.DETAIL,
        element: <PostDetail />,
      },
      {
        path: ROUTER.PATH.CHAT_ROOM,
        element: <ChatRoom />,
      },
      {
        path: ROUTER.PATH.MY_CHAT_ROOMS,
        element: <MyChatRooms />,  // 이 부분은 해당 경로를 처리하는 React 컴포넌트로 교체해야 합니다.
      },
      {
        path: ROUTER.PATH.CHATTING,
        element: <ChattingPage />,
      },
      {
        path: ROUTER.PATH.PROFILE_EDIT,
        element: <ProfileEditPage />,
      },
    {
      path: ROUTER.PATH.PURCHASE,
      element: <Purchase />,
  },
    ],
  },
  {
    path: ROUTER.PATH.KAKAO,
    element: <Kakao />,
  },
  {
    path: ROUTER.PATH.PAYMENT,
    element: <Payment />,
  },
 
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);

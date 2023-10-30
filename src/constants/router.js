const PATH = {
  LOGIN: '/login',
  ADD: '/add',
  IMG: '/img',
  MAIN: '/',
  BACK: -1,
  FRONT: 1,
  SIGNUP: '/signup',
  ADDPOST: `/addPost`,
  KAKAO: `/kakao`,
  PAYMENT: `/payment`,
  MYPAGE: `/mypage`,
  DETAIL:`/post/:postId`,
  CHAT_ROOM: '/chat/:roomId',
  MY_CHAT_ROOMS: '/api/chatting/myChatRooms',
  CHATTING: '/chatting',
  PROFILE_EDIT:'/profile/edit',
  PURCHASE: '/purchase/:postId'
};

const NAME = {
  ADD: 'add',
  LOGIN: 'login',
};

const ROUTER = {
  PATH,
  NAME,
};

export default ROUTER;
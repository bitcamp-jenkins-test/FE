const COOKIE = {
  COOKIE_NAME: 'myToken',
  REFRESH_NAME: 'myRefreshToken',
};

const AXIOS_PATH = {
  LOCAL: 'http://223.130.132.158:8888',
  SEVER: 'http://223.130.132.158:8888',
  KAKAOSERVER: 'https://kauth.kakao.com',
  LOGIN: '/api/users/login',
  SIGNUP: '/api/users/signup',
  TOKEN: '/oauth/token',
  KAKAO: '/api/users/kakao/callback',
  ADDPOST: '/api/posts',
  POSTLIST: '/api/posts/list',
  POSTDETAIL: '/api/posts/:postId',
  MYPAGE: '/api/mypage/',
  TOGGLE_WISHLIST: '/api/wishlist/toggle',
  CHECK_WISHLIST: '/api/wishlist/status',
  POSTDELETE: '/api/posts/:postId',
  WISHLIST: '/api/wishlist',
  MYPOSTS: '/api/mypost',
  PURCHASE: '/api/payments/purchase',
  CANCEL: '/api/payments/cancel',
  CONFIRMEDPURCHASE: '/api/payments/ConfirmedPurchase',
  DELETECHAT: '/api/chatting/message/delete',
  NOTIFICATIONS: '/api/notifications',
  COUNT_UNREAD: '/api/countUnread',
  MARK_AS_READ: '/api/markAsRead',
  DELETE_ALL: '/api/deleteAll',
};

const STALETIME = {
  FIVE_MIN: 5 * 60 * 1000,
};

const QUERY = {
  AXIOS_PATH,
  COOKIE,
  STALETIME,
};

export default QUERY;

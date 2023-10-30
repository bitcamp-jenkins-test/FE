const Storage = {
  setNickName(nickname) {
    removeLocalStorage('nickname');
    setlocalStorage('nickname', nickname);
  },

  removeNickName() {
    removeLocalStorage('nickname');
  },

  getNickName() {
    return window.localStorage.getItem('nickname');
  },
  setUserId(userId) {
    removeLocalStorage('userId');
    setlocalStorage('userId', userId);
  },

  removeUserId() {
    removeLocalStorage('userId');
  },

  getUserId() {
    return window.localStorage.getItem('userId');
  },

  setPoint(point) {
    removeLocalStorage('point');
    setlocalStorage('point', point);
  },

  removePoint() {
    removeLocalStorage('point');
  },

  getPoint() {
    return window.localStorage.getItem('point');
  },

  setAmount(mount) {
    removeLocalStorage('mount');
    setlocalStorage('mount', mount);
  },

  removeAmount() {
    removeLocalStorage('mount');
  },

  getAmount() {
    return window.localStorage.getItem('mount');
  },

  setPhoto(photo) {
    removeLocalStorage('photo');
    setlocalStorage('photo', photo);
  },

  removePhoto() {
    removeLocalStorage('photo');
  },

  getPhoto() {
    return window.localStorage.getItem('photo');
  },

  setRoomId(roomId) {
    removeLocalStorage('roomId');
    setlocalStorage('roomId', roomId);
  },

  removeRoomId() {
    removeLocalStorage('roomId');
  },

  getRoomId() {
    return window.localStorage.getItem('roomId');
  },

};

function setlocalStorage(key, value) {
  return window.localStorage.setItem(key, value);
}

function removeLocalStorage(key) {
  return window.localStorage.removeItem(key);
}

export default Storage;

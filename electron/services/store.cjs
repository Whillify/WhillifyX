const Store = require('electron-store');

const store = new Store();

module.exports = {
  setUser: (userData) => {
    store.set('user', userData);
  },
  getUser: () => {
    return store.get('user');
  },
  clearUser: () => {
    store.delete('user');
  }
};
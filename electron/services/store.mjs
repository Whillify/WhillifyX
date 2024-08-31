import Store from 'electron-store';

const store = new Store();

export const setUser = (userData) => {
  store.set('user', userData);
};

export const getUser = () => {
  return store.get('user');
};

export const clearUser = () => {
  store.delete('user');
};
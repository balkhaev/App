import axios from 'axios';

const authProvider = {
  login: async ({ username, password }) => {
    const { data } = await axios({
      method: 'POST',
      data: JSON.stringify({ email: username, password }),
      headers: { 'content-type': 'application/json' },
      url: process.env.REACT_APP_SERVICE_AUTH_LOGIN_ENDPOINT,
    });

    localStorage.setItem('role', data.role);
    localStorage.setItem('token', data.token);
  },
  logout: async () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  },
  checkAuth: async params => {
    return localStorage.getItem('token') ? true : Promise.reject();
  },
  checkError: error => Promise.resolve(),
  getPermissions: async params => {
    const role = localStorage.getItem('role');

    return role ? role : 'anonymous';
  },
};

export default authProvider;

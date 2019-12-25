import axios from 'axios';

const authProvider = {
  login: async params => {
    const request = await axios.post(process.env.REACT_APP_SERVICE_AUTH_LOGIN_ENDPOINT);
  },
  logout: params => Promise.resolve(),
  checkAuth: params => Promise.resolve(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve(),
};

export default authProvider;

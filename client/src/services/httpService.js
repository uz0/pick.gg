import AuthService from '../services/authService';

const authService = new AuthService();
const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://pick.gg';

export default (url, options = {}) => fetch(`${baseUrl}${url}`, {
  ...options,
  headers: {
    ...options.headers,
    'x-access-token': authService.getToken(),
  },
});

import AuthService from '../services/authService';

let authService = new AuthService();

export default (url, options = {}) => fetch(url, {
  ...options,
  headers: {
    ...options.headers,
    'x-access-token': authService.getToken(),
  }
});
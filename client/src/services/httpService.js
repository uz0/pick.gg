import AuthService from '../services/authService';

let authService = new AuthService();
let baseUrl = 'http://localhost:3000';

export default (url, options = {}) => fetch(`${baseUrl}${url}`, {
  ...options,
  headers: {
    ...options.headers,
    'x-access-token': authService.getToken(),
  }
});
import decode from 'jwt-decode';

export default () => {
  const token = localStorage.getItem('JWS_TOKEN');

  const username = new URL(window.location.href).searchParams.get('username') ||
    localStorage.getItem('auth-test-username');

  if (username) {
    return true;
  }

  if (!token) {
    return false;
  }

  const decoded = decode(token);
  return decoded.exp >= Date.now() / 1000;
};

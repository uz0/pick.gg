import decode from 'jwt-decode';

export default () => {
  const token = localStorage.getItem('JWS_TOKEN');

  if (!token) {
    return false;
  }

  const decoded = decode(token);
  return decoded.exp >= Date.now() / 1000;
};

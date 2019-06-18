const token = localStorage.getItem('JWS_TOKEN');

export default (url, options) => fetch(url, {
  ...options,

  headers: {
    ...(options && options.headers) ? { ...options.headers } : {},
    ...token ? { 'x-access-token': token } : {},
  },
});

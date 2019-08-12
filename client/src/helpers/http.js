export default (url, options) => fetch(url, {
  ...options,

  headers: {
    ...(options && options.headers) ? { ...options.headers } : {},
    'x-access-token': localStorage.getItem('JWS_TOKEN'),
  },
});

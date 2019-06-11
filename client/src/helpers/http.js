export default (url, options) => fetch(url, {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },

  ...options,
});

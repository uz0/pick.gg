export default (url, options) => {
  const username = new URL(window.location.href).searchParams.get('username') ||
    localStorage.getItem('auth-test-username');

  return fetch(url, {
    ...options,

    headers: {
      ...(options && options.headers) ? { ...options.headers } : {},
      ...(username ? { 'x-mocked-username': username } : {}),
      'x-access-token': localStorage.getItem('JWS_TOKEN'),
    },
  });
};

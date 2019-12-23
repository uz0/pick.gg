import fetch from 'node-fetch';

const baseUrl = 'https://ru.api.riotgames.com';

export default (apiKey = '', url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);

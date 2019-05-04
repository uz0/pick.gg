import fetch from 'node-fetch';

const baseUrl = 'https://na1.api.riotgames.com/';
const apiKey = 'RGAPI-b2f79eff-f355-44f2-aab9-e88210f29259';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
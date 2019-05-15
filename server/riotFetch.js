import fetch from 'node-fetch';

// const baseUrl = 'https://na1.api.riotgames.com/';
const baseUrl = 'https://ru.api.riotgames.com';
const apiKey = 'RGAPI-420571e6-923c-41e5-bbcb-f14018d78d71';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
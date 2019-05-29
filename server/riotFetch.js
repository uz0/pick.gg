import fetch from 'node-fetch';

const baseUrl = 'https://ru.api.riotgames.com';
const apiKey = '';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
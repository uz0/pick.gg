import fetch from 'node-fetch';

// const baseUrl = 'https://na1.api.riotgames.com/';
const baseUrl = 'https://ru.api.riotgames.com';
const apiKey = 'RGAPI-0789a5fa-bc6c-4bba-82ac-95664a941f77';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
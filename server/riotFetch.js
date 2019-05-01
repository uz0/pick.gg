import fetch from 'node-fetch';

const baseUrl = 'https://na1.api.riotgames.com/';
const apiKey = 'RGAPI-77f702d8-18bd-4dce-88b0-075b1999c741';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
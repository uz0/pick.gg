import fetch from 'node-fetch';

const baseUrl = 'https://na1.api.riotgames.com/';
const apiKey = 'RGAPI-c8e60b2d-e216-4e3e-ab96-a5b7d987db6a';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
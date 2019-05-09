import fetch from 'node-fetch';

const baseUrl = 'https://na1.api.riotgames.com/';
const apiKey = 'RGAPI-dba40431-58c9-4a3c-8767-13ee98473cb9';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
import fetch from 'node-fetch';

const baseUrl = 'https://na1.api.riotgames.com/';
const apiKey = 'RGAPI-3ad61e3d-d3b5-4512-bf00-ccae7672c4c6';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
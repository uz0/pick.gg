import fetch from 'node-fetch';

const baseUrl = 'https://na1.api.riotgames.com/';
const apiKey = 'RGAPI-fbb298b6-7533-4429-80d6-415be110a414';

export default (url) => fetch(`${baseUrl}${url}?api_key=${apiKey}`);
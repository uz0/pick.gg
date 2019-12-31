import pubg from 'pubg.js';

import config from '../../../config';

const client = new pubg.Client(
  config.pubg.apiKey,
  config.pubg.apiRegion
);

const constructDate = date => {
  return `${date.getDay()}/${date.getMonth()}, ${date.getHours()}:${
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    }`;
};

const fmtMSS = (s) => {
  return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s;
};

export default async (req, res) => {
  const { nickname } = req.params;

  const player = await client.getPlayer({ name: nickname });

  const lastMatches = player.relationships.matches.slice(0, 5);

  const lastMatchesData = lastMatches.map(async match => {
    const matchData = await client.getMatch(match.id);
    return {
      id: match.id,
      createdAt: constructDate(matchData.attributes.createdAt),
      duration: fmtMSS(matchData.attributes.duration),
      gameMode: matchData.attributes.gameMode
    };
  });

  const loadedMatch = await Promise.all(lastMatchesData);

  res.json(loadedMatch);
};

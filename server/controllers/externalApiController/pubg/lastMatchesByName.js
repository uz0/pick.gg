import pubg from 'pubg.js';

const client = new pubg.Client(
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNmEyMDQwMC1mZmQ0LTAxMzctNTg0Ni0xNTY5OGE1NTgzYjciLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTc2MjQwOTgyLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im92Y2hpbmd1cy1nbWFpIn0.i-ZLR8F6WM3rnXlTOQLRCCzA5qt9dAiF9T1woicHxu8',
  'pc-na'
);

const constructDate = date => {
  return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  }`;
};

const fmtMSS = (s) => {return(s-(s%=60))/60+(9<s?':':':0')+s}


export default async (req, res) => {
  const { nickname } = req.params;

  const player = await client.getPlayer({ name: nickname });

  const lastMatches = player.relationships.matches.slice(0, 5);

  const lastMatchesData = lastMatches.map(async match => {
    const matchData = await client.getMatch(match.id);
    return {
      id: match.id,
      createdAt: constructDate(matchData.attributes.createdAt),
      duration: (matchData.attributes.duration / 60).toFixed(2),
      gameMode: matchData.attributes.gameMode
    };
  });

  res.json(await Promise.all(lastMatchesData));
};

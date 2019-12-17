import pubg from 'pubg.js';
import omit from 'lodash/omit';

const client = new pubg.Client(
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNmEyMDQwMC1mZmQ0LTAxMzctNTg0Ni0xNTY5OGE1NTgzYjciLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTc2MjQwOTgyLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im92Y2hpbmd1cy1nbWFpIn0.i-ZLR8F6WM3rnXlTOQLRCCzA5qt9dAiF9T1woicHxu8',
  'pc-na'
);

export default async (req, res) => {
  const { nickname } = req.params;

  const player = await client.getPlayer({ name: nickname });

  const [lastMatch] = player.relationships.matches;

  const match = await client.getMatch(lastMatch.id);

  //     console.log({
  //       matchId: match.id,
  //       matchDuration: match.attributes.duration,
  //       teams: match.relationships.rosters.map(i => ({
  //         rank: i.attributes.stats.rank,
  //         players: i.relationships.participants.map(p => ({
  //           id: p.id,
  //           name: p.attributes.stats.name,
  //           kills: p.attributes.stats.kills,
  //           timeSurvived: p.attributes.stats.timeSurvived
  //         }))
  //       }))
  //     });
  res.json({
    // matchId: match.id,
    // matchDuration: match.attributes.duration,
    summoners: match.relationships.rosters
      .map(i =>
        i.relationships.participants.map(p => ({
          results: { ...omit(p.attributes.stats, ['deathType', 'name', 'playerId']) },
          nickname: p.attributes.stats.name
        }))
      )
      .flat()
  });
};

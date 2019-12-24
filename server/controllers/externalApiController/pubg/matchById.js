import pubg from 'pubg.js';
import omit from 'lodash/omit';

import config from '../../../config';

const client = new pubg.Client(
  config.pubg.apiKey,
  config.pubg.apiRegion
);

export default async (req, res) => {
  const { id } = req.params;

  const match = await client.getMatch(id);

  res.json({
    summoners: match.relationships.rosters
      .map(roster =>
        roster.relationships.participants.map(player => ({
          results: { ...omit(player.attributes.stats, ['deathType', 'name', 'playerId']) },
          nickname: player.attributes.stats.name
        }))
      )
      .flat()
  });
};

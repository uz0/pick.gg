import fs from 'fs';
import cheerio from 'cheerio';

import Match from '../../../models/match';
import User from '../../../models/user';

import { withValidationHandler } from '../../helpers';

export const handler = withValidationHandler(async (req, res) => {
  const { matchId } = req.params;
  const parsedMatchResults = {};

  if(!req.file){
    res.send(null);
  }

  fs.readFile(req.file.buffer, 'utf8', async data => {
    const $ = cheerio.load(data.path);

    $('.classic.player').each((index, element) => {
      const name = $('.champion-nameplate-name', element).find('a').text();
      const [kills, deaths, assists] = $('.kda-kda', element).find('div').map((index, element) => +$(element).text()).get();

      parsedMatchResults[name] = { kills, deaths, assists };
    });
  });

  const usersQuery = await User
    .find({})
    .select('_id summonerName')
    .lean();
    
  const usersMap = usersQuery.reduce((users, user) => ({ ...users, [user.summonerName]: user._id }), {});

  const results = Object.keys(parsedMatchResults).reduce((results, username) => {
    if(!usersMap[username]){
      return results;
    }

    results.push({
      userId: usersMap[username],
      results: parsedMatchResults[username]
    });

    return results;
  }, []);

  const updatedMatch = await Match.findByIdAndUpdate(
    { _id: matchId },
    { $set: { playersResults: results }},
    { new: true, upsert: false }
  );

  res.send(updatedMatch);
});
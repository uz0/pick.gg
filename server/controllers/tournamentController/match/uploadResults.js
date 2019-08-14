import fs from 'fs';
import cheerio from 'cheerio';
import isEmpty from 'lodash/isEmpty';

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

    if(isEmpty(parsedMatchResults)){
      res.send({
        error: 'В html файле отстутствуют результаты'
      });

      return;
    }

    const usersQuery = await User
      .find({})
      .select('_id summonerName')
      .lean();

    const usersMap = usersQuery.reduce((users, user) => ({ ...users, [user.summonerName]: user._id }), {});
    const userNamesMap = Object.entries(usersMap).reduce((users, [ name, id ]) => ({ ...users, [id]: name }), {});

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

    const updatedResultsUsernames = results.map(item => userNamesMap[item.userId]);

    const updatedMatch = await Match.findByIdAndUpdate(
      { _id: matchId },
      { $set: { playersResults: results }},
      { new: true, upsert: false }
    );

    res.send({
      updatedMatch,
      users: updatedResultsUsernames,
    });
  });
});
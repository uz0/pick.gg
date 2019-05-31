import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import FantasyTournament from "../models/fantasy-tournament";

export default async (req, res) => {
  const tournaments = await FantasyTournament
    .find({ winner: null })
    .populate({ path: 'users.players', select: '_id id name photo' })
    .populate({ path: 'users.user', select: '_id username' })
    .populate({ path: 'rules.rule' })
    .populate({ path: 'winner', select: 'id username' })
    .populate({ path: 'creator', select: 'id username' })
    .populate('tournament')
    .populate({
      path: 'tournament',
      populate: {
        path: 'champions',
      }
    })
    .populate({
      path: 'tournament',
      populate: {
        path: 'matches',
        populate: {
          path: 'results'
        }
      }
    });
  const calculateChampionsPoints = params => {
    const { rules, results } = params;
    const normalizedRules = rules.map(({ rule, score }) => ({
      rule: rule._id,
      score
    }));
    return results.reduce((sum, { rule, score }) => {
      const initialRule = find(normalizedRules, { rule });
      return initialRule ? sum + initialRule.score * score : sum;
    }, 0);
  };
  for (const tournament of tournaments) {
    const { matches } = tournament.tournament;
    const { rules, users } = tournament;
    if (isEmpty(matches) || isEmpty(users))
      continue;
    let isAllMatchesCompleted = matches.every(match => match.completed);
    if (!isAllMatchesCompleted)
      continue;
    // TODO: залить в reduce
    const championsPoints = tournament.tournament.champions_ids.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
    for (const match of matches) {
      match.results.playersResults.forEach(({ results, playerId }) => {
        const points = calculateChampionsPoints({ results, rules });
        championsPoints[playerId] += points;
      });
    }
    let winner = {
      points: 0,
      user: null,
    };
    const winner = users.reduce((acc, user) => {
      const ;
    }, {
        points: 0,
        user: null,
      });
    for (let j = 0; j < users.length; j++) {
      let sum = 0;
      users[j].players_ids = users[j].players.map(player => player._id);
      users[j].players_ids.forEach(id => {
        sum += championsPoints[id];
      });
      if (sum > winner.points) {
        winner = {
          points: sum,
          user: users[j].user._id,
        };
      }
    }
    await FantasyTournament.findByIdAndUpdate({ _id: tournament._id }, { winner: winner.user });

  }
  const updateTournamentsNames = tournaments.map(tournament => tournament.name).join(', ');
  const message = updateTournamentsNames.length > 0 ? updateTournamentsNames : 'All tournaments already finalized';
  res.send({
    success: 'Success',
    message,
  });
}
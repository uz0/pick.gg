import find from 'lodash/find';
import pick from 'lodash/pick';
import {
  calcSummonersPoints,
  calcViewerPoints,
} from '../../helpers';

export default (tournaments, users) => {
  const userIds = users.map(user => user._id);

  const tournamentsList = userIds.reduce((list, user) => {
    const userTournaments = tournaments.filter(item => find(item.viewers, { userId: String(user) }));
    const normalizedTournaments = userTournaments.map(tournament => pick(tournament, ['rules', 'summoners', 'viewers', 'matches']));

    list[user] = normalizedTournaments;
    return list;
  }, {});

  const rating = userIds.map(user => {
    const { summonerName, username } = users.find(item => String(item._id) === String(user));

    const rating = tournamentsList[user].reduce((points, tournament) => {
      const { summoners, matches, viewers, rules } = tournament;
      const viewer = viewers.find(item => String(item.userId) === String(user));

      const summonersPoints = calcSummonersPoints(summoners, matches, rules);
      const viewersPoints = calcViewerPoints(viewer, summonersPoints);

      points.points += viewersPoints;

      return points;
    }, {
        summonerName,
        username,
        points: 0
      });

    return rating;
  })
  .sort((prev, next) => next.points - prev.points);

  return rating;
};
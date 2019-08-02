import find from 'lodash/find';
import {
  calcSummonersPoints,
  calcViewersPoints,
} from '../..helpers';

export default (tournaments, users) => {
  const userIds = users.map(user => user._id);

  const tournamentsList = userIds.reduce((list, user) => {
    const userTournaments = tournaments.filter(item => find(item.viewers, { userId: String(user) }));

    list[user] = userTournaments;
    return list;
  },{});

  const rating = userIds.reduce((rating, user) => {
    const { _id, summonerName, username } = users.find(item => String(item._id) === String(user));

      const points = tournamentsList[streamer].reduce((points, tournament) => {
        const { summoners, matches, rules } = tournament;

        const summoners = calcSummonersPoints(summoners, matches, rules);
        const viewerRating = calcViewersPoints();

        viewersCounter += tournament.viewers.length;

        return viewersCounter;

      }, 0);

      rating.push({
        _id,
        username,
        summonerName,
        points
      });

      return rating;
    }, [])
    .sort((prev, next) => next.points - prev.points);

  return rating;
};
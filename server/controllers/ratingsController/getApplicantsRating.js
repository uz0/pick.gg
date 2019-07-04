import find from 'lodash/find';

export default (tournaments, users) => {
  const userIds = users.map(user => user._id);

  const tournamentsList = userIds.reduce((list, user) => {
    const userTournaments = tournaments.filter(item => find(item.applicants, { userId: String(user) }));
    list[user] = userTournaments;

    return list;
  },{});

  return tournamentsList;
};
export default (tournaments, users) => {
  const streamers = users.filter(user => user.canProvideTournaments);
  const streamersIds = streamers.map(streamer => streamer._id);

  const tournamentsList = streamersIds.reduce((list, streamer) => {
    const streamerTournaments = tournaments.filter(item => {
      return String(item.creator._id) === String(streamer);
    });
    list[streamer] = streamerTournaments;

    return list;
  }, {});

  const rating = streamersIds.reduce((rating, streamer) => {
    const { _id, summonerName, username, imageUrl } = streamers.find(item => String(item._id) === String(streamer));

    const totalViewers = tournamentsList[streamer].reduce((viewersCounter, tournament) => {
      viewersCounter += tournament.viewers.length;
      return viewersCounter;
    }, 0);

    rating.push({
      _id,
      imageUrl,
      username,
      summonerName,
      points: totalViewers
    });

    return rating;
  }, [])
    .sort((prev, next) => next.points - prev.points);

  return rating;
};

export default (summoners, matches = [], rules = {}) => {
  if (matches.length === 0) {
    return summoners.map(summoner => ({ ...summoner, points: 0 }));
  }

  if (summoners.includes(undefined)) {
    return;
  }

  const points = summoners.reduce((points, item) => ({ ...points, [item._id]: 0 }), {});

  for (const match of matches) {
    if (match.playersResults.length === 0) {
      break;
    }

    for (const result of match.playersResults) {
      const summonerPoints = Object.entries(result.results).reduce((points, [key, value]) => {
        points += rules[key] * value;
        return points;
      }, 0);

      points[result.userId] += summonerPoints;
    }
  }

  const summonersWithPoints = summoners
    .map(summoner => ({ ...summoner, points: points[summoner._id] }))
    .sort((prev, next) => next.points - prev.points);

  return summonersWithPoints;
};

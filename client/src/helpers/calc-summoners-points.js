export const calcRule = (ruleString, { match, player }) => {
  // eslint-disable-next-line no-eval
  return eval(`({ match, player }) => ${ruleString}`)({ match, player });
};

export default (summoners, matches = [], rules = '') => {
  if (matches.length === 0) {
    return summoners.map(summoner => ({ ...summoner, points: 0 }));
  }

  if (summoners.includes(undefined)) {
    return;
  }

  const points = summoners.reduce((points, item) => ({ ...points, [item._id]: 0 }), {});

  for (const match of matches) {
    if (match.playersResults.length === 0) {
      continue;
    }

    for (const playerResult of match.playersResults) {
      const summonerPoints = calcRule(rules, { match, player: playerResult.results });
      points[playerResult.userId] += summonerPoints;
    }
  }

  const summonersWithPoints = summoners
    .map(summoner => ({ ...summoner, points: points[summoner._id] }))
    .sort((prev, next) => next.points - prev.points);

  return summonersWithPoints;
};

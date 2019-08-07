export default (viewers, summonersResults = []) => {
  const summonersResultsMap = summonersResults
    .reduce((map, result) => ({ ...map, [result.summoner]: result.points }), {});

  const viewersResults = viewers.reduce((results, viewer) => {
    const result = viewer.summoners.reduce((result, summoner) => result += summonersResultsMap[summoner], 0);

    results.push({
      viewerId: viewer.userId,
      points: result,
    });

    return results;
  }, [])
    .sort((prev, next) => next.points - prev.points);

  return viewersResults;
};
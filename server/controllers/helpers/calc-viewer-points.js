export default (viewer, summonersResults = []) => {
  const summonersResultsMap = summonersResults
    .reduce((map, result) => ({ ...map, [result.summoner]: result.points }), {});

  return viewer.summoners.reduce((result, summoner) => result += summonersResultsMap[summoner], 0);;
};
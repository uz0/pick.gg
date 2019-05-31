import MatchResult from "../../models/match-result";
import MockService from "../../mockService";

export default async (req, res) => {
  const players = MockService.getChampions();
  let tournaments = MockService.getTournaments();
  let matches = [];
  let matchIndex = 1;
  const rules = await RuleModel.find();
  for (let i = 0; i < tournaments.length; i++) {
    const tournamentChampions = MockService.getRandomTournamentChampions();
    const tournamentMatches = MockService.generateTournamentMatches(tournaments[i].id);
    tournaments[i].champions_ids = map(tournamentChampions, champion => champion.id);
    for (let j = 0; j < tournamentMatches.length; j++) {
      tournamentMatches[j].id = matchIndex;
      const results = MockService.generatePlayersResults({
        match_id: matchIndex,
        tournament: tournaments[i],
        rules,
      });
      const createdResult = await MatchResult.create({
        matchId: matchIndex,
        playersResults: tournamentMatches[j].completed ? results : [],
      });
      tournamentMatches[j].results = createdResult._id;
      matchIndex++;
    }
    tournaments[i].matches_ids = map(tournamentMatches, match => match.id);
    matches = matches.concat(tournamentMatches);
  }
  await PlayerModel.create(players);
  await MatchModel.create(matches);
  await TournamentModel.create(tournaments);
  res.send({
    success: 'Success',
  });
}
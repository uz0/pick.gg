import moment from 'moment';
import fetch from 'node-fetch';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';
import groupBy from 'lodash/groupBy';


import TournamentModel from "../../models/tournament";
import RuleModel from "../../models/rule";
import MatchResult from "../../models/match-result";
import MatchModel from "../../models/match";
import PlayerModel from "../../models/player";

export default async (req, res) => {
  console.log('matches loading');
  let data = await fetch('https://esports-api.thescore.com/lol/matches?start_date_from=2019-03-23T21:00:00Z');
  data = await data.json();
  console.log('matches loaded');
  console.log('rules loading');
  const rulesQuery = await RuleModel.find();
  const rules = rulesQuery.reduce((obj, rule) => {
    obj[rule.name] = rule._id;
    return obj;
  }, {});
  console.log('rules loaded');
  let formattedTournaments = [];
  let formattedTournamentsChunks = [];
  let formattedMatches = [];
  let formattedMatchResults = [];
  let formattedPlayers = [];
  data.competitions.forEach(competition => {
    formattedTournaments.push({
      id: competition.id,
      name: competition.full_name,
      date: null,
      matches_ids: [],
      champions_ids: [],
      syncAt: new Date().toISOString(),
      syncType: 'auto',
      origin: 'escore',
    });
  });
  data.matches.forEach(match => {
    formattedMatches.push({
      id: match.id,
      name: '',
      tournament_id: parseInt(match.competition_url.replace('/lol/competitions/', ''), 10),
      startDate: match.start_date,
      results: null,
      completed: false,
      syncAt: new Date().toISOString(),
      syncType: 'auto',
      origin: 'escore',
    });
  });
  const groupedMatches = groupBy(formattedMatches, 'tournament_id');
  Object.keys(groupedMatches).forEach(id => {
    const tournamentIndex = findIndex(formattedTournaments, { id: groupedMatches[id][0].tournament_id });
    formattedTournaments[tournamentIndex].matches_ids = map(groupedMatches[id], match => match.id);
    formattedTournaments[tournamentIndex].matches = map(groupedMatches[id], match => ({ id: match.id, date: match.startDate, tournamentId: match.tournament_id }));
    formattedTournaments[tournamentIndex].date = groupedMatches[id][0].startDate;
  });
  // Переменная чтобы получить правильный индекс созданного чанка
  let tournamentChunkOffset = 0;
  // Нужно красиво разбить турниры на чанки
  for (let i = 0; i < formattedTournaments.length - 1; i++) {
    const formattedTournament = formattedTournaments[i];
    const formattedTournamentMatches = formattedTournaments[i].matches.sort((prev, next) => moment(prev.date).format('YYYYMMDD') - moment(next.date).format('YYYYMMDD'));
    let tournamentChunkNamePrefix = 1;
    let tournamentChunkIdPrefix = 1;
    formattedTournamentsChunks.push({
      id: `${formattedTournament.id}`,
      name: `${formattedTournament.name} #1`,
      date: formattedTournament.date,
      matches_ids: [],
      champions_ids: [],
      syncAt: new Date().toISOString(),
      syncType: 'auto',
      origin: 'escore',
    });
    for (let j = 0; j < formattedTournamentMatches.length - 1; j++) {
      const currentMatchDate = moment(formattedTournamentMatches[j].date);
      const nextMatchDate = moment(formattedTournamentMatches[j + 1].date);
      if (currentMatchDate.isSame(nextMatchDate, 'day') && formattedTournamentMatches[j].tournamentId === formattedTournament.id) {
        formattedTournamentsChunks[i + tournamentChunkOffset].matches_ids = [...formattedTournamentsChunks[i + tournamentChunkOffset].matches_ids, formattedTournamentMatches[j].id];
        continue;
      }
      formattedTournamentsChunks[i + tournamentChunkOffset].matches_ids = [...formattedTournamentsChunks[i + tournamentChunkOffset].matches_ids, formattedTournamentMatches[j].id];
      // Нам нужно выходить из цикла при последней итерации, иначе создастся пустой турнир без матчей
      if (j + 1 === formattedTournamentMatches.length - 1) {
        break;
      }
      tournamentChunkNamePrefix++;
      tournamentChunkOffset++;
      formattedTournamentsChunks.push({
        id: `${formattedTournament.id}_${tournamentChunkIdPrefix}`,
        name: `${formattedTournament.name} #${tournamentChunkNamePrefix}`,
        date: nextMatchDate,
        matches_ids: [],
        champions_ids: [],
        syncAt: new Date().toISOString(),
        syncType: 'auto',
        origin: 'escore',
      });
      tournamentChunkIdPrefix++;
    }
  }
  const wait = time => new Promise(resolve => setTimeout(() => resolve(), time));
  console.log('matches details loading');
  for (let i = 0; i < formattedMatches.length; i++) {
    await wait(400);
    let response = await fetch(`https://esports-api.thescore.com/lol/matches/${formattedMatches[i].id}`);
    response = await response.json();
    if (response.teams[0] && response.teams[1]) {
      formattedMatches[i].name = `${response.teams[0].full_name} vs ${response.teams[1].full_name}`;
    }
    response.players.forEach(player => {
      if (!find(formattedPlayers, { id: player.id })) {
        formattedPlayers.push({
          id: player.id,
          name: player.in_game_name,
          photo: player.headshot ? player.headshot.w192xh192 : null,
          syncAt: new Date().toISOString(),
          syncType: 'auto',
          origin: 'escore',
          position: player.position,
          stats: [],
        });
      }
      const tournamentChunk = findIndex(formattedTournamentsChunks, chunk => chunk.matches_ids.includes(formattedMatches[i].id));
      if (formattedTournamentsChunks[tournamentChunk]) {
        if (formattedTournamentsChunks[tournamentChunk].champions_ids.indexOf(player.id) === -1) {
          formattedTournamentsChunks[tournamentChunk].champions_ids.push(player.id);
        }
      }
    });
    response.match_lineups.forEach(lineup => {
      const playerId = parseInt(lineup.player_url.replace('/lol/players/', ''));
      const formatterPlayerIndex = findIndex(formattedPlayers, { id: playerId });
      lineup.leader_urls.forEach(url => {
        const stat = find(response.leaders, { api_uri: url });
        if (!find(formattedPlayers[formatterPlayerIndex].stats, { category: stat.category })) {
          formattedPlayers[formatterPlayerIndex].stats.push({
            category: stat.category,
            value: stat.formatted_stat,
          });
        }
      });
    });
    formattedMatches[i].completed = response.matches.status === 'post-match';
    if (formattedMatches[i].completed) {
      let object = {
        resultsId: formattedMatches[i].id,
        playersResults: [],
        syncAt: new Date().toISOString(),
        syncType: 'auto',
      };
      response.player_game_records.forEach(record => {
        object.playersResults.push({
          id: parseInt(record.player_url.replace('/lol/players/', ''), 10),
          results: [
            {
              rule: rules['kills'],
              score: record.kills,
            },
            {
              rule: rules['deaths'],
              score: record.deaths,
            },
            {
              rule: rules['assists'],
              score: record.assists,
            },
          ],
        });
      });
      formattedMatchResults.push(object);
      const match = await MatchModel.find({ id: object.id });
      if (match.length === 0) {
        const resultsResponse = await MatchResult.create(object);
        formattedMatches[i].resultsId = resultsResponse._id;
        formattedMatchResults[i].resultsId = resultsResponse._id;
        console.log(`MatchResult was created`);
        continue;
      }
      if (match.length > 0) {
        const resultsResponse = await MatchResult.findOneAndUpdate({ matchId: match[0]._id }, object, { new: true });
        if (!resultsResponse) {
          const newResults = await MatchResult.create(object);
          formattedMatches[i].resultsId = newResults._id;
          formattedMatchResults[i].resultsId = newResults._id;
          console.log(`MatchResult was updated`);
          continue;
        }
        console.log(`MatchResult was updated`);
        formattedMatches[i].resultsId = resultsResponse._id;
        formattedMatchResults[i].resultsId = resultsResponse._id;
      }
    }
    console.log(`${i} of ${formattedMatches.length} matches loaded`);
  }
  // Если матчей нет в нашей базе - то добавляем, если есть - обновляем
  console.log('Begin matches sync');
  const formattedMatchesIds = formattedMatches.map(matches => matches.id);
  const matchesInBase = await MatchModel.find({ id: { $in: formattedMatchesIds } });
  const matchesInBaseIds = matchesInBase.map(match => match.id);
  const matchesNotAddedToBase = formattedMatches.filter(item => !matchesInBaseIds.includes(item.id));
  const matchesToUpdate = formattedMatches.filter(item => matchesInBaseIds.includes(item.id));
  for (let i = 0; i < matchesNotAddedToBase.length; i++) {
    await MatchModel.create(matchesNotAddedToBase[i]);
    console.log(`Match ${i} of ${matchesNotAddedToBase.length - 1} has been created`);
  }
  for (let i = 0; i < matchesToUpdate.length; i++) {
    const matchId = matchesToUpdate[i].id;
    await MatchModel.update({ id: matchId }, matchesToUpdate[i]);
    console.log(`Match ${i} of ${matchesToUpdate.length} has been updated`);
  }
  console.log('End matches sync');
  // Если игроков нет в нашей базе - то добавляем, если есть - обновляем
  console.log('Begin players sync');
  const formattedPlayersIds = formattedPlayers.map(player => player.id);
  const playersInBase = await PlayerModel.find({ id: { $in: formattedPlayersIds } });
  const playersInBaseIds = playersInBase.map(player => player.id);
  const playersNotAddedToBase = formattedPlayers.filter(item => !playersInBaseIds.includes(item.id));
  const playersToUpdate = formattedPlayers.filter(item => playersInBaseIds.includes(item.id));
  for (let i = 0; i < playersNotAddedToBase.length; i++) {
    const player = await PlayerModel.create(playersNotAddedToBase[i]);
    console.log(`Player with id ${player.id} has been created`);
  }
  for (let i = 0; i < playersToUpdate.length; i++) {
    const playerId = playersToUpdate[i].id;
    await PlayerModel.update({ id: playerId }, playersToUpdate[i]);
    console.log(`Player with id ${playerId} was updated`);
  }
  console.log('End players sync');
  // Маппим результаты к матчам
  console.log('Begin matches results sync');
  // Нужно заменить player id из escore на _id player из базы
  const allPlayers = await PlayerModel.find({ id: { $exists: true } });
  const allPlayersIdsMap = allPlayers.reduce((obj, item) => {
    obj[item.id] = item._id;
    return obj;
  }, {});
  for (let i = 0; i < formattedMatchResults.length; i++) {
    formattedMatchResults[i].playersResults.forEach(item => {
      item.playerId = allPlayersIdsMap[item.id];
    });
    await MatchResult.update({ _id: formattedMatchResults[i].resultsId }, { playersResults: formattedMatchResults[i].playersResults });
  }
  for (let i = 0; i < formattedMatchResults.length; i++) {
    const matchId = formattedMatchResults[i].matchId;
    const resultsId = formattedMatchResults[i].resultsId;
    await MatchModel.update({ id: matchId }, { resultsId });
    console.log(`Mapped ${i} results from ${formattedMatchResults.length - 1}`);
  }
  console.log('End matches results sync');
  // Если турниров нет в нашей базе - то добавляем, если есть - обновляем
  console.log('begin tournaments sync');
  // Нужно заменить id с escore на _id из Монги, иначе всё сломается и я снова отхвачу...
  for (let i = 0; i < formattedTournamentsChunks.length; i++) {
    const chunkEscoreMatchesIds = formattedTournamentsChunks[i].matches_ids;
    const chunkEscorePlayersIds = formattedTournamentsChunks[i].champions_ids;
    const matches = await MatchModel.find({ id: { $in: chunkEscoreMatchesIds } });
    const players = await PlayerModel.find({ id: { $in: chunkEscorePlayersIds } });
    const matchesIds = matches.map(match => match._id);
    const playersIds = players.map(player => player._id);
    formattedTournamentsChunks[i].matches_ids = [...matchesIds];
    formattedTournamentsChunks[i].champions_ids = [...playersIds];
  }
  const formattedTournamentsChunksIds = formattedTournamentsChunks.map(tournament => tournament.id);
  const tournamentsInBase = await TournamentModel.find({ id: { $in: formattedTournamentsChunksIds } });
  const tournamentsInBaseIds = tournamentsInBase.map(tournament => tournament.id);
  const tournamentsNotAddedToBase = formattedTournamentsChunks.filter(item => !tournamentsInBaseIds.includes(item.id));
  const tournamentsToUpdate = formattedTournamentsChunks.filter(item => tournamentsInBaseIds.includes(item.id));

  await Promise.all(
    tournamentsNotAddedToBase.map(tournament =>
      TournamentModel.create(notAddedTournament).then(
        val =>
          console.log(`Tournament with id ${tournament.id} has been created`) ||
          val
      )
    )
  );
  

  const updatedTournaments = await Promise.all(
    tournamentsToUpdate.map(tournament =>
      TournamentModel.findOneAndUpdate({ id: tournament.id }, tournament).then(
        val =>
          console.log(`Tournament with id ${tournament.id} was updated`) || val
      )
    )
  );  
  console.log('end tournaments sync');
  res.send({
    formattedTournamentsChunks,
    formattedTournaments,
    formattedMatches,
    formattedMatchResults,
    formattedPlayers,
  });
};
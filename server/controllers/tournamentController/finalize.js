import { param } from 'express-validator/check';
import isEmpty from 'lodash/isEmpty';

import User from '../../models/user';
import Reward from '../../models/reward';
import Tournament from '../../models/tournament';
import { isEntityExists } from '../validators';
import {
  withValidationHandler,
  calcSummonersPoints,
  calcViewersPoints,
} from '../helpers';

export const validator = [
  param('id').custom(id => isEntityExists(id, Tournament)),
  param('id').custom(async id => {
    const { isFinalized } = await Tournament.findById(id);

    if (isFinalized) throw new Error('Tournament is already finalized');

    return true;
  })
];

export const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  const tournament = await Tournament
    .findById(id)
    .populate('matches')
    .populate('teams')
    .lean();

  const {
    rules,
    matches,
    summoners,
    rewards,
    viewers,
    game,
  } = tournament;

  const summonersResults = calcSummonersPoints(summoners, matches, rules);
  const viewersResults = calcViewersPoints(viewers, summonersResults);

  const topSummonersResults = summonersResults.slice(0, 3);
  const topViewersResults = viewersResults.slice(0, 3);

  const placesMap = {
    'first': 1,
    'second': 2,
    'third': 3,
  };

  const normalizedRewards = Object.entries(rewards);
  const tournamentWinners = [];

  for(const [ rewardId, roleAndPlace ] of normalizedRewards){
    const [ role, placeId ] = roleAndPlace.split('_');
    const place = placesMap[placeId];

    const winnerId = (() => {
      if (role === 'summoner') {
        return !isEmpty(topSummonersResults) && topSummonersResults[place - 1] ? topSummonersResults[place - 1].summoner : null;
      }
      if (role === 'viewer') {
        return !isEmpty(topViewersResults) && topViewersResults[place - 1] ? topViewersResults[place - 1].viewerId : null
      }
    })();

    if (!winnerId) {
      continue;
    }

    await Reward.findByIdAndUpdate(rewardId, { $set: { userId: winnerId } });

    tournamentWinners.push({
      id: winnerId,
      position: role,
      place,
    });
  }

  await Tournament.findByIdAndUpdate(id, { $set: { winners: tournamentWinners, isFinalized: true } });

  const finalizedTournament = await Tournament
    .findById(id)
    .populate('creatorId')
    .populate('applicants')
    .populate('matches')
    .populate('teams')
    .populate('creator', '_id username summonerName')
    .exec();

  res.send(finalizedTournament);
});
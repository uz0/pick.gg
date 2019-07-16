import TournamentModel from '../../models/tournament';
import UserModel from '../../models/user';
import MatchModel from '../../models/match';

import getApplicantsRating from './getApplicantsRating';
import getStreamersRating from './getStreamersRating';
import getViewersRating from './getViewersRating';

export default async (req, res) => {
  const tournaments = await TournamentModel
    .find({})
    .populate('winner')
    .populate('creatorId')
    .populate('summoners')
    .populate('applicants')
    .populate('matches')
    .exec();

  const users = await UserModel.find({}, 'username summonerName canProvideTournaments');

  const rating = {
    streamers: getStreamersRating(tournaments, users),
    applicants: getApplicantsRating(tournaments, users),
    viewers: getViewersRating(tournaments, users),
  }

  res.json(rating);
}
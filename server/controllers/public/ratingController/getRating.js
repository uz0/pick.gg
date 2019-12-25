import TournamentModel from '../../../models/tournament';
import UserModel from '../../../models/user';

import getApplicantsRating from './getApplicantsRating';
import getStreamersRating from './getStreamersRating';
import getViewersRating from './getViewersRating';

export default async (req, res) => {
  const tournaments = await TournamentModel
    .find({ isFinalized: true })
    .populate('applicants')
    .populate('matches')
    .populate('creator', '_id username summonerName')
    .lean();

  const users = await UserModel.find();

  const rating = {
    streamersRating: getStreamersRating(tournaments, users),
    viewersRating: getViewersRating(tournaments, users),
    applicantsRating: getApplicantsRating(tournaments, users)
  };

  res.json(rating);
};

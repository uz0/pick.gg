import RewardModel from '../../models/reward';
import TournamentModel from '../../models/tournament';

export default async (req, res) => {
  const { _id } = req.decoded;
  const isClaimedFilter = req.query.isClaimed;

  let rewards;

  const tournaments = await TournamentModel
    .find({ isFinalized: false })
    .select('rewards')
    .lean();

  const tournamentsRewards = tournaments.reduce((rewards, item) => ({ ...rewards, ...item.rewards }), {});
  const tournamentsRewardsIds = Object.keys(tournamentsRewards);

  if (isClaimedFilter) {
    rewards = await RewardModel
      .find({ userId: _id, isClaimed: isClaimedFilter })
      .lean();
  } else {
    rewards = await RewardModel
      .find({ userId: _id })
      .lean();
  }

  rewards = rewards.filter(item => !tournamentsRewardsIds.includes(String(item._id)));

  res.json({ rewards });
};

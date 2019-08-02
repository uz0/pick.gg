import RewardModel from '../../models/reward';

export default async (req, res) => {
  const { _id } = req.decoded;
  const isClaimedFilter = req.query.isClaimed;

  let rewards;

  if(isClaimedFilter){
    rewards = await RewardModel.find({ userId: _id, isClaimed: isClaimedFilter });
  } else {
    rewards = await RewardModel.find({ userId: _id });
  }

  res.json({ rewards });
}
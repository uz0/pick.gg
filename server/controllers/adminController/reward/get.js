import RewardModel from '../../../models/reward';

export default async (req, res) => {
    const rewards = await RewardModel
      .find();
    res.json({ rewards });
}
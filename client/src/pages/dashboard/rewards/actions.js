import { createAction } from 'redux-starter-kit';

const loadRewards = createAction('loadRewards');
const updateReward = createAction('updateReward');
const createReward = createAction('createReward');
const deleteReward = createAction('deleteReward');
const filterRewardsByUser = createAction('filterRewardsByUser');
const filterRewardsByClaim = createAction('filterRewardsByClaim');

export default {
  loadRewards,
  updateReward,
  createReward,
  deleteReward,
  filterRewardsByUser,
  filterRewardsByClaim,
};

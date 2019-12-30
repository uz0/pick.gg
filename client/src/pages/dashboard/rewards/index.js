import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import RewardCard from 'components/reward-card';
import Button from 'components/button';
import Preloader from 'components/preloader';
import modalActions from 'components/modal-container/actions';

import { http } from 'helpers';

import i18n from 'i18n';

import UserFilter from './filters/user-filter';
import ClaimFilter from './filters/claim-filter';
import actions from './actions';
import style from './style.module.css';

class Rewards extends Component {
  state = {
    isLoading: false,
    userFilter: null,
    claimFilter: null,
  };

  async componentDidMount() {
    this.loadRewards();
  }

  openRewardModal = (isEditing = false, reward = {}) => this.props.toggleModal({
    id: 'reward-modal',
    options: {
      isEditing,
      reward,
    },
  });

  loadRewards = async () => {
    this.setState({ isLoading: true });
    const response = await http('/api/admin/reward');
    const { rewards } = await response.json();
    this.props.loadRewards(rewards);
    this.setState({ isLoading: false });
  };

  filterRewardsByUser = async userId => {
    await this.setState({ userFilter: userId });
    this.filter();
  }

  filterRewardsByClaim = async option => {
    await this.setState({ claimFilter: option ? option.value : null });
    this.filter();
  }

  filter = async () => {
    const { userFilter, claimFilter } = this.state;

    await this.loadRewards();

    if (userFilter) {
      this.props.filterRewardsByUser(userFilter);
    }

    if (claimFilter !== null) {
      this.props.filterRewardsByClaim(claimFilter);
    }
  }

  render() {
    const isRewardsExist = this.props.rewardsIds && this.props.rewardsIds.length > 0;

    return (
      <>
        <div className={style.controls}>
          <Button
            text={i18n.t('create_reward')}
            appearance="_basic-accent"
            onClick={() => this.openRewardModal()}
          />

          <div className={style.filters}>
            <div className={style.filter}>
              <UserFilter
                test="test"
                onChange={this.filterRewardsByUser}
              />
            </div>
            <div className={style.filter}>
              <ClaimFilter
                onChange={this.filterRewardsByClaim}
              />
            </div>
          </div>

        </div>
        <div className={style.rewards}>
          {!isRewardsExist &&
            <p>There is no any reward</p>
          }

          {isRewardsExist && this.props.rewardsIds.map(id => {
            const reward = this.props.rewardsList[id];

            const { _id, userId, key, description, image, isClaimed } = reward;

            return (
              <RewardCard
                key={_id}
                rewardKey={key}
                description={description}
                isClaimed={isClaimed}
                onClick={() => this.openRewardModal(true, { _id, key, userId, description, image, isClaimed })}
              />
            );
          })}
        </div>
        {this.state.isLoading &&
          <Preloader/>
        }
      </>
    );
  }
}

export default compose(
  connect(
    state => ({
      rewardsIds: state.rewards.ids,
      rewardsList: state.rewards.list,
      isLoaded: state.rewards.isLoaded,
    }),

    {
      loadRewards: actions.loadRewards,
      filterRewardsByClaim: actions.filterRewardsByClaim,
      filterRewardsByUser: actions.filterRewardsByUser,
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Rewards);

export { default as actions } from './actions';
export { default as reducers } from './reducers';

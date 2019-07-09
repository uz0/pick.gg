import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import RewardCard from 'components/reward-card';
import Button from 'components/button';
import Preloader from 'components/preloader';
import modalActions from 'components/modal-container/actions';
import UserFilter from './filters/user-filter';
import ClaimFilter from './filters/claim-filter';
import { http } from 'helpers';
import actions from './actions';
import i18n from 'i18n';

import style from './style.module.css';

class Rewards extends Component {
  state = {
    isLoading: false,
  };

  async componentDidMount() {
    if (!this.props.isLoaded) {
      this.loadRewards();
    }
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

  filterRewardsByUser = userId => {
    if (!userId) {
      this.loadRewards();
      return;
    }

    this.props.filterRewardsByUser(userId);
  }

  filterRewardsByClaim = option => {
    if (!option) {
      this.loadRewards();
      return;
    }

    if (!option.value) {
      this.props.filterRewardsByClaim(false);
      return;
    }

    this.props.filterRewardsByClaim(true);
  }

  render() {
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
          {this.props.rewardsIds.length === 0 &&
            <p>There is no any rewards</p>
          }

          {this.props.rewardsIds.map(id => {
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

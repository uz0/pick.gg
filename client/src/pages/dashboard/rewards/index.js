import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import RewardCard from 'components/reward-card';
import Button from 'components/button';
import Preloader from 'components/preloader';
import { http } from 'helpers';
import { actions as modalActions } from 'components/modal-container';
import actions from './actions';

import style from './style.module.css';

class Rewards extends Component {
  state = {
    isLoading: false,
  };

  openRewardModal = (isEditing, reward) => this.props.toggleModal({
    id: 'reward-modal',
    options: {
      isEditing,
      reward: {
        ...reward,
      },
    },
  });

  loadRewards = async () => {
    this.setState({ isLoading: true });
    const response = await http('/api/admin/reward');
    const { rewards } = await response.json();
    this.props.loadRewards(rewards);
    this.setState({ isLoading: false });
  };

  async componentDidMount() {
    if (!this.props.isLoaded) {
      this.loadRewards();
    }
  }

  render() {
    return (
      <>
        <div className={style.controls}>
          <Button
            text="Создать награду"
            appearance="_basic-accent"
            onClick={() => this.openRewardModal(false, {})}
          />
        </div>
        <div className={style.rewards}>
          {this.props.rewardsList.map(({ _id, key, description, image, isClaimed }) => (
            <RewardCard
              key={_id}
              rewardKey={key}
              description={description}
              isClaimed={isClaimed}
              onClick={() => this.openRewardModal(true, { _id, key, description, image, isClaimed })}
            />
          ))}
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
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Rewards);

export { default as actions } from './actions';
export { default as reducers } from './reducers';

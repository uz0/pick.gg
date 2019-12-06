import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { actions as rewardsActions } from 'pages/dashboard/rewards';

import modalActions from 'components/modal-container/actions';
import RewardCard from 'components/reward-card';
import Preloader from 'components/preloader';

import { http } from 'helpers';

import i18n from 'i18next';

import style from './style.module.css';

class Rewards extends Component {
  state = {
    isLoading: false,
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const response = await http('/api/rewards/reward');
    const { rewards } = await response.json();
    this.props.loadRewards(rewards);
    this.setState({ isLoading: false });
  }

  render() {
    return (
      <div className="container">
        <div className={style.rewards}>
          {this.state.isLoading && (
            <Preloader/>
          )}
          {
            this.props.rewardsIds.length === 0 ? (
              <p className={style.no_rewards}>
                {i18n.t('no_rewards')}
              </p>
            ) : (
              this.props.rewardsIds.map(id => {
                const reward = this.props.rewardsList[id];
                const { key, description, isClaimed } = reward;

                return (
                  <RewardCard
                    key={key}
                    rewardKey={key}
                    description={description}
                    isClaimed={isClaimed}
                  />
                );
              }))
          }
        </div>
      </div>
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
      loadRewards: rewardsActions.loadRewards,
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Rewards);

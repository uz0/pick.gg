import React, { Component } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import modalActions from 'components/modal-container/actions';
import actions from './actions';
import { http } from 'helpers';

import RewardCard from 'components/reward-card';
import Preloader from 'components/preloader';

import style from './style.module.css';
import i18n from 'i18next';

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
            this.props.tournamentsIds.length === 0 ? (
              <p className={style.no_rewards}>
                {i18n.t('no_rewards')}
              </p>
            ) : (
              this.props.tournamentsIds.map(id => {
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
      tournamentsIds: state.rewards.ids,
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

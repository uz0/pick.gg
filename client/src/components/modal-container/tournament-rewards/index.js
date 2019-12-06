import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import { actions as rewardsActions } from 'pages/dashboard/rewards';
import { actions as tournamentsActions } from 'pages/tournaments';
import classnames from 'classnames';

import { actions as notificationActions } from 'components/notification';
import Modal from 'components/modal';
import Table from 'components/table';
import Select from 'components/filters/select';
import Button from 'components/button';

import { http } from 'helpers';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = {
  rewardDescription: {
    text: 'Reward',
    width: window.innerWidth < 480 ? 120 : 150,
  },

  place: {
    text: 'Place',
    width: window.innerWidth < 480 ? 75 : 100,
  },

  role: {
    text: 'Role',
    width: window.innerWidth < 480 ? 75 : 100,
  },
};

const roleOptions = [
  { id: 'summoner', name: 'summoner' },
  { id: 'viewer', name: 'viewer' },
];

const placeOptions = [
  { id: 'first', name: 'first' },
  { id: 'second', name: 'second' },
  { id: 'third', name: 'third' },
];

class AddRewards extends Component {
  constructor(props) {
    super(props);

    const { isEditing } = this.props.options;
    this.state = {
      tournamentRewards: {},
      userRewards: {},
      isEditing,
    };
  }

  componentDidMount() {
    const { isEditing } = this.state;

    if (isEditing) {
      const { rewards, unfoldedRewards } = this.props.tournament;

      const normalizedRewards = Object.entries(rewards).reduce((rewards, [key, value]) => {
        const [role, place] = value.split('_');
        rewards[key] = { role, place };
        return rewards;
      }, {});

      const unfoldedNormalizedRewards = Object.entries(unfoldedRewards).reduce((rewards, [_, value]) => {
        const { _id, description } = value;
        rewards[_id] = { description };
        return rewards;
      }, {});

      this.setState({ tournamentRewards: merge(normalizedRewards, unfoldedNormalizedRewards) });
    }

    this.loadUserRewards();
  }

  getCurrentRewards() {
    const { isEditing, userRewards, tournamentRewards } = this.state;

    if (isEditing) {
      return tournamentRewards;
    }

    if (!isEditing) {
      return userRewards;
    }
  }

  loadUserRewards = async () => {
    const response = await http('/api/rewards/reward/streamer?isClaimed=false');
    const { rewards } = await response.json();
    this.props.loadRewards(rewards);

    const normalizedRewards = rewards.reduce((map, reward) => {
      map[reward._id] = {
        role: null,
        place: null,
        description: reward.description,
      };

      return map;
    }, {});

    this.setState({
      userRewards: normalizedRewards,
    });
  };

  addRewards = async rewards => {
    const { tournamentId } = this.props.options;

    try {
      const rewardsUpdateRequest = await http(`/api/tournaments/${tournamentId}/rewards`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ rewards }),
      });

      const updatedTournament = await rewardsUpdateRequest.json();

      const rewardsRequest = await http(`/public/tournaments/${tournamentId}/rewards`);
      const unfoldedRewards = await rewardsRequest.json();

      this.props.updateTournament({
        ...updatedTournament,
        unfoldedRewards,
        rewards,
      });

      this.props.close();
    } catch (error) {
      console.log(error);
    }
  };

  onEditSubmit = () => {
    let rewards = this.getCurrentRewards();

    if (!isEmpty(this.state.tournamentRewards)) {
      rewards = this.state.tournamentRewards;
    }

    const choosedRewards = Object
      .entries(rewards)
      .filter(([_, values]) => !Object.values(values).some(item => item === null));

    if (isEmpty(choosedRewards)) {
      this.props.showNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: 'Вы не выбрали ни одной награды',
      });

      return;
    }

    const normalizedRewards = choosedRewards.reduce((rewards, [rewardKey, values]) => {
      rewards[rewardKey] = `${values.role}_${values.place}`;
      return rewards;
    }, {});

    this.addRewards(normalizedRewards);
  };

  onAddSubmit = () => {
    const { isEditing, tournamentRewards, userRewards } = this.state;

    const choosedRewards = Object
      .entries(userRewards)
      .filter(([_, values]) => !Object.values(values).some(item => item === null));

    const normalizedRewards = choosedRewards.reduce((rewards, [rewardKey, values]) => {
      rewards[rewardKey] = values;
      return rewards;
    }, {});

    this.setState({
      tournamentRewards: merge(tournamentRewards, normalizedRewards),
      userRewards: omit(userRewards, Object.keys(normalizedRewards)),
      isEditing: !isEditing,
    });
  }

  onSelectChange = (event, field) => {
    const rewards = this.getCurrentRewards();
    const { value, name } = event.target;

    const mergeRewardWithProp = reward => {
      reward[name] = {
        ...reward[name],
        [field]: value,
      };
      return reward;
    };

    this.setState({ [rewards]: mergeRewardWithProp(rewards) });
  };

  onRewardRemove = rewardId => {
    const { isEditing, userRewards } = this.state;
    if (isEditing) {
      const rewards = this.getCurrentRewards();

      const removedReward = rewards[rewardId];
      removedReward.place = null;
      removedReward.role = null;

      this.setState({
        tournamentRewards: omit(rewards, rewardId),
        userRewards: merge(userRewards, { [rewardId]: removedReward }),
      });
    }
  };

  renderRow = ({ className, itemClass, textClass, item, captions }) => {
    const { isEditing } = this.state;
    const [rewardId, rewardProps] = item;

    const rewardDescription = { '--width': captions.rewardDescription.width };
    const role = { '--width': captions.role.width };
    const place = { '--width': captions.place.width };

    const defaultPlace = get(rewardProps, 'place');
    const defaultRole = get(rewardProps, 'role');
    const placeholderPlace = 'choose place';
    const placeholderRole = 'choose role';

    return (
      <div key={rewardId} className={cx(className, 'row')}>
        <div className={itemClass} style={rewardDescription}>
          <span className={textClass}>{rewardProps.description}</span>
        </div>

        <div className={itemClass} style={place}>
          <Select
            name={rewardId}
            className={style.select}
            value={defaultPlace}
            placeholder={placeholderPlace}
            options={placeOptions}
            onChange={event => this.onSelectChange(event, 'place')}
          />
        </div>

        <div className={itemClass} style={role}>
          <Select
            name={rewardId}
            className={style.select}
            value={defaultRole}
            placeholder={placeholderRole}
            options={roleOptions}
            onChange={event => this.onSelectChange(event, 'role')}
          />
        </div>

        {isEditing && (
          <Button
            appearance="danger"
            icon="close"
            className={style.button}
            onClick={() => this.onRewardRemove(rewardId)}
          />
        )}
      </div>
    );
  };

  render() {
    const { isEditing } = this.state;
    const rewards = Object.entries(this.getCurrentRewards());

    const modalTitle = isEditing ? i18n.t('tournament_page.edit_rewards') : i18n.t('tournament_page.add_rewards');
    const buttonText = isEditing ? i18n.t('add') : i18n.t('edit');

    const addButton = {
      text: buttonText,
      type: 'button',
      appearance: '_basic-accent',
      onClick: () => this.setState({ isEditing: !isEditing }),
    };

    const submitButton = {
      text: i18n.t('button.submit'),
      type: 'button',
      appearance: '_basic-accent',
      onClick: isEditing ? this.onEditSubmit : this.onAddSubmit,
    };

    const cancelButton = {
      text: i18n.t('button.cancel'),
      type: 'button',
      appearance: '_basic-accent',
      onClick: this.props.close,
    };

    const backButton = {
      text: i18n.t('button.back'),
      type: 'button',
      appearance: '_basic-accent',
      onClick: () => this.setState({ isEditing: !isEditing }),
    };

    const buttons = isEditing ?
      [addButton, submitButton, cancelButton] :
      [submitButton, backButton];

    return (
      <Modal
        title={modalTitle}
        close={this.props.close}
        className={style.modal_content}
        wrapClassName={style.wrapper}
        actions={buttons}
      >
        <div>
          <Table
            captions={tableCaptions}
            items={rewards}
            renderRow={this.renderRow}
            className={style.rewards}
            emptyMessage={i18n.t('empty_message.no_claimed_rewards')}
          />
        </div>
      </Modal>
    );
  }
}

const enhance = compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
      rewardsIds: state.rewards.ids,
      rewardsList: state.rewards.list,
      isLoaded: state.rewards.isLoaded,
    }),

    {
      loadRewards: rewardsActions.loadRewards,
      showNotification: notificationActions.showNotification,
      updateTournament: tournamentsActions.updateTournament,
    }
  )
);

export default enhance(AddRewards);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import { http } from 'helpers';
import { actions as rewardsActions } from 'pages/dashboard/rewards';
import { actions as notificationActions } from 'components/notification';
import { actions as tournamentsActions } from 'pages/tournaments';
import Modal from 'components/modal';
import Table from 'components/table';
import Select from 'components/filters/select';

import classnames from 'classnames';
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
  state = {
    rewards: {},
  }

  async componentDidMount() {
    const { rewards } = this.props.tournament;

    if (isEmpty(rewards)) {
      this.loadRewards();

      return;
    }

    const normalizedRewards = Object.entries(rewards).reduce((rewards, [key, values]) => {
      const [role, place] = values.split('_');
      rewards[key] = { role, place };

      return rewards;
    }, {});

    this.setState({ rewards: normalizedRewards });
  }

  loadRewards = async () => {
    const response = await http('/api/rewards/reward/streamer?isClaimed=false');
    const { rewards } = await response.json();
    this.props.loadRewards(rewards);

    const normalizedRewards = rewards.reduce((map, reward) => {
      map[reward._id] = {
        role: null,
        place: null,
      };

      return map;
    }, {});

    this.setState({
      rewards: normalizedRewards,
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
  }

  onRewardsSubmit = () => {
    const { rewards } = this.state;

    const choosedRewards = Object
      .entries(rewards)
      .filter(([_, values]) => !Object.values(values).some(item => item === null));

    if (choosedRewards.length === 0) {
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

  onSelectChange = (event, field) => {
    const { rewards } = this.state;
    const { value, name } = event.target;

    rewards[name] = {
      ...rewards[name],
      [field]: value,
    };

    this.setState({ rewards });
  };

  renderRow = ({ className, itemClass, textClass, item, captions }) => {
    const { isEditing } = this.props.options;
    const { rewards } = this.state;

    const rewardDescription = { '--width': captions.rewardDescription.width };
    const role = { '--width': captions.role.width };
    const place = { '--width': captions.place.width };

    const defaultPlace = (isEditing && !isEmpty(rewards)) ? rewards[item._id].place : 'choose place';
    const defaultRole = (isEditing && !isEmpty(rewards)) ? rewards[item._id].role : 'choose role';

    return (
      <div key={item._id} className={cx(className, 'row')}>
        <div className={itemClass} style={rewardDescription}>
          <span className={textClass}>{item.description}</span>
        </div>

        <div className={itemClass} style={place}>
          <Select
            name={item._id}
            className={style.select}
            defaultOption={defaultPlace}
            options={placeOptions}
            onChange={event => this.onSelectChange(event, 'place')}
          />
        </div>

        <div className={itemClass} style={role}>
          <Select
            name={item._id}
            className={style.select}
            defaultOption={defaultRole}
            options={roleOptions}
            onChange={event => this.onSelectChange(event, 'role')}
          />
        </div>
      </div>
    );
  }

  render() {
    const { isEditing } = this.props.options;

    const rewards = isEditing ? this.props.tournament.unfoldedRewards : Object.values(this.props.rewardsList);

    const modalTitle = isEditing ? 'Edit tournament rewards' : 'Add tournament rewards';
    const buttonText = isEditing ? 'Edit' : 'Add';

    return (
      <Modal
        title={modalTitle}
        close={this.props.close}
        className={style.modal_content}
        wrapClassName={style.wrapper}
        actions={[
          {
            text: buttonText,
            type: 'button',
            appearance: '_basic-accent',
            onClick: this.onRewardsSubmit,
          },
        ]}
      >
        <div>
          <Table
            captions={tableCaptions}
            items={rewards}
            renderRow={this.renderRow}
            className={style.rewards}
            emptyMessage="You don't have any not claimed rewards"
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

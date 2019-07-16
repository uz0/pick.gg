import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { http } from 'helpers';
import { actions as rewardsActions } from 'pages/dashboard/rewards';
import Modal from 'components/modal';
import Table from 'components/table';
import Preloader from 'components/preloader';
import Select from 'components/filters/select';

import classnames from 'classnames';
import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = {
  rewardDescription: {
    text: 'Reward',
    width: window.innerWidth < 480 ? 120 : 150,
  },

  role: {
    text: 'Role',
    width: window.innerWidth < 480 ? 75 : 100,
  },

  place: {
    text: 'Place',
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
    isLoading: false,
  }

  async componentDidMount() {
    this.loadRewards();
  }

  loadRewards = async () => {
    this.setState({ isLoading: true });
    const response = await http('/api/rewards/reward?isClaimed=false');
    const { rewards } = await response.json();
    this.props.loadRewards(rewards);
    this.setState({ isLoading: false });
  };

  renderRow = ({ className, itemClass, textClass, item, captions }) => {
    const rewardDescription = { '--width': captions.rewardDescription.width };
    const role = { '--width': captions.role.width };
    const place = { '--width': captions.place.width };

    return (
      <div key={item._id} className={cx(className, 'row')}>
        <div className={itemClass} style={rewardDescription}>
          <span className={textClass}>{item.description}</span>
        </div>

        <div className={itemClass} style={place}>
          <Select
            className={style.select}
            defaultOption="choose place"
            options={placeOptions}
          />
        </div>

        <div className={itemClass} style={role}>
          <Select
            className={style.select}
            defaultOption="choose role"
            options={roleOptions}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal
        title="Add tournament rewards"
        close={this.props.close}
        className={style.modal_content}
        wrapClassName={style.wrapper}
        actions={[
          {
            text: 'Add',
            type: 'button',
            appearance: '_basic-accent',
          },
        ]}
      >
        <div>
          {this.state.isLoading && (
            <Preloader/>
          )}
          <Table
            captions={tableCaptions}
            items={Object.values(this.props.rewardsList)}
            renderRow={this.renderRow}
            isLoading={false}
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
    state => ({
      rewardsIds: state.rewards.ids,
      rewardsList: state.rewards.list,
      isLoaded: state.rewards.isLoaded,
    }),
    {
      loadRewards: rewardsActions.loadRewards,
    }
  )
);

export default enhance(AddRewards);

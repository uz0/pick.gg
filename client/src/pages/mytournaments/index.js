import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Table from 'components/table';
import Preloader from 'components/preloader';

import { http } from 'helpers';

import i18n from 'i18n';

import actions from './actions';
import style from './style.module.css';

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 100 : 250,
  },

  date: {
    text: i18n.t('date'),
    width: window.innerWidth < 480 ? 75 : 75,
  },

  viewers: {
    text: i18n.t('viewers'),
    width: window.innerWidth < 480 ? 75 : 75,
  },
};

class MyTournaments extends Component {
  state = {
    tournaments: [],
    isLoading: false,
  };

  loadTournaments = async () => {
    this.setState({ isLoading: true });
    const response = await http(`/public/tournaments/user/${this.props.currentUser._id}`);
    const { tournaments } = await response.json();
    this.props.loadUserTournaments(tournaments);
    this.setState({ isLoading: false });
  };

  async componentDidMount() {
    if (!this.props.isLoaded) {
      await this.loadTournaments();
    }

    this.setState({ tournaments: Object.values(this.props.tournamentsList) });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.startAt).format('MMM DD');
    const viewersLength = item.viewers && item.viewers.length;

    return (
      <NavLink to={`/tournaments/${item._id}`} className={className}>
        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
          <span className={textClass}>{item.name}</span>
        </div>

        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
          <span className={textClass}>{formattedDate}</span>
        </div>

        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.viewers.width }}>
          <span className={textClass}>{viewersLength}</span>
        </div>
      </NavLink>
    );
  }

  render() {
    const { tournaments } = this.state;

    return (
      <div className="container">
        <div className={style.my_tournaments}>
          <div className={style.section}>
            <Table
              captions={tournamentsTableCaptions}
              items={tournaments}
              className={style.table}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
              emptyMessage={i18n.t('not_yet_tournaments')}
            />
          </div>

          {this.state.isLoading &&
            <Preloader isFullScreen/>
          }
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      currentUser: state.currentUser,
      tournamentsIds: state.userTournaments.ids,
      tournamentsList: state.userTournaments.list,
      isLoaded: state.userTournaments.isLoaded,
    }),

    {
      loadUserTournaments: actions.loadUserTournaments,
    },
  )
)(MyTournaments);

export { default as actions } from './actions';
export { default as reducers } from './reducers';

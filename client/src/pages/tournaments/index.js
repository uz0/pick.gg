import React, { Component } from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import Button from 'components/button';
import TournamentCard from 'components/tournament-card';
import moment from 'moment';
import { actions as modalActions } from 'components/modal-container';
import { http } from 'helpers';
import actions from './actions';
import style from './style.module.css';

const cx = classnames.bind(style);

const _tournaments = [
  {
    applicants: [],
    champions_ids: ['5cc6d0462911baa2e07c1ac0', '5cc6d0462911baa2e07c1ac5', '5cc6d0462911baa2e07c1aca', '5cc6d0462911baa2e07c1acf', '5cc6d0462911baa2e07c1ad4', '5cc6d0462911baa2e07c1ad9', '5cc6d0462911baa2e07c1ade', '5cc6d0472911baa2e07c1ae3', '5cc6d0472911baa2e07c1ae8', '5cc6d0472911baa2e07c1aed', '5cc6d04e2911baa2e07c1bc2', '5cc6d04e2911baa2e07c1bcc', '5cc6d04f2911baa2e07c1bd1', '5cc6d04f2911baa2e07c1bd6', '5cc6d04f2911baa2e07c1bdb', '5cc6d04f2911baa2e07c1be5', '5cc6d04f2911baa2e07c1bea', '5cc6d04f2911baa2e07c1bef', '5cc6d0502911baa2e07c1bf4', '5cc6d0502911baa2e07c1bf9', '5cc6d0522911baa2e07c1c3b', '5cc6d0522911baa2e07c1c40', '5cc6d0522911baa2e07c1c45', '5cc6d0522911baa2e07c1c4a', '5cc6d0522911baa2e07c1c4f', '5cc6d05d2911baa2e07c1d94', '5cc6d05d2911baa2e07c1d99', '5cc6d05d2911baa2e07c1d9e', '5cc6d05d2911baa2e07c1da3', '5cc6d05e2911baa2e07c1da8'],
    date: '2019-03-30T06:00:00.000Z',
    id: '4_5',
    isReady: false,
    matches_ids: ['5cc6d0382911baa2e07c19a1', '5cc6d0392911baa2e07c19a3', '5cc6d0392911baa2e07c19a4'],
    name: 'LPL #6',
    origin: 'escore',
    rewards: [],
    summoners: [],
    syncType: 'auto',
    viewers: [],
    __v: 0,
    _id: '5cc6d0802911baa2e07c3769',
  },

  {
    applicants: [],
    champions_ids: ['5cc6d0462911baa2e07c1ac0', '5cc6d0462911baa2e07c1ac5', '5cc6d0462911baa2e07c1aca', '5cc6d0462911baa2e07c1acf', '5cc6d0462911baa2e07c1ad4', '5cc6d0462911baa2e07c1ad9', '5cc6d0462911baa2e07c1ade', '5cc6d0472911baa2e07c1ae3', '5cc6d0472911baa2e07c1ae8', '5cc6d0472911baa2e07c1aed', '5cc6d04e2911baa2e07c1bc2', '5cc6d04e2911baa2e07c1bcc', '5cc6d04f2911baa2e07c1bd1', '5cc6d04f2911baa2e07c1bd6', '5cc6d04f2911baa2e07c1bdb', '5cc6d04f2911baa2e07c1be5', '5cc6d04f2911baa2e07c1bea', '5cc6d04f2911baa2e07c1bef', '5cc6d0502911baa2e07c1bf4', '5cc6d0502911baa2e07c1bf9', '5cc6d0522911baa2e07c1c3b', '5cc6d0522911baa2e07c1c40', '5cc6d0522911baa2e07c1c45', '5cc6d0522911baa2e07c1c4a', '5cc6d0522911baa2e07c1c4f', '5cc6d05d2911baa2e07c1d94', '5cc6d05d2911baa2e07c1d99', '5cc6d05d2911baa2e07c1d9e', '5cc6d05d2911baa2e07c1da3', '5cc6d05e2911baa2e07c1da8'],
    date: '2019-03-30T06:00:00.000Z',
    id: '4_5',
    isReady: false,
    matches_ids: ['5cc6d0382911baa2e07c19a1', '5cc6d0392911baa2e07c19a3', '5cc6d0392911baa2e07c19a4'],
    name: 'LPL #6',
    origin: 'escore',
    rewards: [],
    summoners: [],
    syncType: 'auto',
    viewers: [],
    __v: 0,
    _id: '5cc6fd0802911baa2e07c3769',
  },

  {
    applicants: [],
    champions_ids: ['5cc6d0462911baa2e07c1ac0', '5cc6d0462911baa2e07c1ac5', '5cc6d0462911baa2e07c1aca', '5cc6d0462911baa2e07c1acf', '5cc6d0462911baa2e07c1ad4', '5cc6d0462911baa2e07c1ad9', '5cc6d0462911baa2e07c1ade', '5cc6d0472911baa2e07c1ae3', '5cc6d0472911baa2e07c1ae8', '5cc6d0472911baa2e07c1aed', '5cc6d04e2911baa2e07c1bc2', '5cc6d04e2911baa2e07c1bcc', '5cc6d04f2911baa2e07c1bd1', '5cc6d04f2911baa2e07c1bd6', '5cc6d04f2911baa2e07c1bdb', '5cc6d04f2911baa2e07c1be5', '5cc6d04f2911baa2e07c1bea', '5cc6d04f2911baa2e07c1bef', '5cc6d0502911baa2e07c1bf4', '5cc6d0502911baa2e07c1bf9', '5cc6d0522911baa2e07c1c3b', '5cc6d0522911baa2e07c1c40', '5cc6d0522911baa2e07c1c45', '5cc6d0522911baa2e07c1c4a', '5cc6d0522911baa2e07c1c4f', '5cc6d05d2911baa2e07c1d94', '5cc6d05d2911baa2e07c1d99', '5cc6d05d2911baa2e07c1d9e', '5cc6d05d2911baa2e07c1da3', '5cc6d05e2911baa2e07c1da8'],
    date: '2019-03-30T06:00:00.000Z',
    id: '4_5',
    isReady: false,
    matches_ids: ['5cc6d0382911baa2e07c19a1', '5cc6d0392911baa2e07c19a3', '5cc6d0392911baa2e07c19a4'],
    name: 'LPL #6',
    origin: 'escore',
    rewards: [],
    summoners: [],
    syncType: 'auto',
    viewers: [],
    __v: 0,
    _id: '5cc6d0802911baa2e0g7c3769',
  },
];

class Tournaments extends Component {
  state = {
    isLoading: false,
  };

  openNewTournamentModal = () => this.props.toggleModal({ id: 'new-tournament-modal' });

  loadTournaments = () => {
    this.setState({ isLoading: true });
    console.log(http);
    // Const response = await http('api/tournaments');
    // const { tournaments } = await response.json();
    const tournaments = _tournaments;
    console.log(tournaments);
    this.props.loadTournaments(tournaments);
    this.setState({ isLoading: false });
  };

  async componentWillMount() {
    if (!this.props.isLoaded) {
      this.loadTournaments();
    }
  }

  render() {
    return (
      <div className={style.tournaments}>
        <div className={cx('container', { '_is-loading': this.state.isLoading })}>
          {this.props.tournamentsIds.map(id => {
            const tournament = this.props.tournamentsList[id];
            const date = moment(tournament.date).format('DD MMM YYYY');
            const championsLength = tournament.champions_ids && tournament.champions_ids.length;
            const tournamentName = tournament.name || 'No name';

            return (
              <Link key={tournament._id} to={`/tournaments/${tournament._id}`} className={style.item}>
                <h2 className={style.name}>{tournamentName}</h2>

                <TournamentCard
                  name={tournamentName}
                  date={date}
                  people={championsLength || 0}
                  className={style.card}
                />
              </Link>
            );
          })}
        </div>

        <Button
          appearance="_icon-accent"
          icon="plus"
          className={style.button}
          onClick={this.openNewTournamentModal}
        />
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      tournamentsIds: state.tournaments.ids,
      tournamentsList: state.tournaments.list,
      isLoaded: state.tournaments.isLoaded,
    }),

    {
      loadTournaments: actions.loadTournaments,
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Tournaments);

export { default as actions } from './actions';
export { default as reducers } from './reducers';

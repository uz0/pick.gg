import React, { Component } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import classnames from 'classnames/bind';
import Button from 'components/button';
import TournamentCard from 'components/tournament-card';
import Preloader from 'components/preloader';
import moment from 'moment';
import modalActions from 'components/modal-container/actions';
import { http } from 'helpers';
import actions from './actions';
import style from './style.module.css';
import i18n from 'i18next';

const cx = classnames.bind(style);

class Tournaments extends Component {
  state = {
    isLoading: false,
  };

  loadTournaments = async () => {
    this.setState({ isLoading: true });
    const response = await http('/public/tournaments');
    const { tournaments } = await response.json();
    this.props.loadTournaments(tournaments);
    this.setState({ isLoading: false });
  };

  async componentDidMount() {
    if (!this.props.isLoaded) {
      this.loadTournaments();
    }
  }

  render() {
    const isTounaments = this.props.tournamentsIds.length === 0;

    const isCurrentUserAdmin = get(this.props, 'currentUser.isAdmin');
    const isCurrentUserStreamer = get(this.props, 'currentUser.canProvideTournaments');
    const isCurrentUserAdminOrStreamer = isCurrentUserStreamer || isCurrentUserAdmin;
    const tournamentList = sortBy(this.props.tournamentsList, tournament => tournament.startAt);
    const filterTournamentList = tournamentList.filter(tournament => !tournament.isFinalized);

    return (
      <div className={cx('tournaments', 'container')}>
        <div className={style.wrap_tournaments}>
          <div className={cx('list', { '_is-loading': this.state.isLoading })}>
            {isTounaments && <span className={style.no_tournaments}>{i18n.t('not_yet_tournaments')}</span>}

            {filterTournamentList.map(tournament => {
              // const tournament = this.props.tournamentsList[id];
              const dateMonth = moment(tournament.startAt).format('MMM');
              const dateDay = moment(tournament.startAt).format('DD');
              const championsLength = tournament.viewers && tournament.viewers.length;
              const tournamentName = tournament.name || i18n.t('no_name');
              const price = tournament.price === 0 ? i18n.t('free') : `$${tournament.price}`;

              return (
                <Link key={tournament._id} to={`/tournaments/${tournament._id}`} className={style.item}>
                  <TournamentCard
                    name={tournamentName}
                    dateDay={dateDay}
                    dateMonth={dateMonth}
                    price={price}
                    people={championsLength || 0}
                    imageUrl={tournament.imageUrl}
                    className={style.card}
                  />
                </Link>
              );
            })}

          </div>

          {isCurrentUserAdminOrStreamer && (
            <Button
              appearance="_icon-accent"
              icon="plus"
              className={style.button}
              onClick={this.props.openNewTournamentModal}
            />
          )}

          {this.state.isLoading && (
            <Preloader isFullScreen/>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      currentUser: state.currentUser,
      tournamentsIds: state.tournaments.ids,
      tournamentsList: state.tournaments.list,
      isLoaded: state.tournaments.isLoaded,
    }),

    {
      loadTournaments: actions.loadTournaments,
      toggleModal: modalActions.toggleModal,
    },
  ),
  withHandlers({
    openNewTournamentModal: props => () => props.toggleModal({ id: 'new-tournament-modal' }),
  })
)(Tournaments);

export { default as actions } from './actions';
export { default as reducers } from './reducers';

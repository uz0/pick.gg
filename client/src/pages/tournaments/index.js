import React, { Component } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import classnames from 'classnames/bind';
import moment from 'moment';
import querystring from 'querystring';

import Button from 'components/button';
import TournamentCard from 'components/tournament-card';
import Preloader from 'components/preloader';
import modalActions from 'components/modal-container/actions';

import { http, getTournamentStatus } from 'helpers';

import i18n from 'i18next';

import actions from './actions';
import style from './style.module.css';

const cx = classnames.bind(style);

class Tournaments extends Component {
  state = {
    isLoading: false,
    filter: 'now',
  };

  componentDidMount() {
    if (!this.props.isLoaded) {
      this.loadTournaments();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.loadTournaments();
    }
  }

  loadTournaments = async () => {
    // Querystring doesnt trim '?'
    const { game } = querystring.parse(this.props.location.search.slice(1));

    this.setState({ isLoading: true });
    const response = await http(
      game ? `/public/tournaments/game/${game}` : '/public/tournaments'
    );
    const { tournaments } = await response.json();
    try {
      this.props.loadTournaments(tournaments);
    } catch (error) {
      console.log(error);
    }

    this.setState({ isLoading: false });
  };

  setGame = async game => {
    await this.props.history.push(`/tournaments${game ? '?game=' + game : ''}`);
    await this.loadTournaments();
  };

  setFilterGame = text => {
    this.setState({ filter: text });
  };

  render() {
    const isTournaments = this.props.tournamentsIds.length === 0;
    const filterGame = this.state.filter;

    const isCurrentUserAdmin = get(this.props, 'currentUser.isAdmin');
    const isCurrentUserStreamer = get(
      this.props,
      'currentUser.canProvideTournaments'
    );
    const isCurrentUserAdminOrStreamer =
      isCurrentUserStreamer || isCurrentUserAdmin;
    let tournamentList = sortBy(
      this.props.tournamentsList,
      tournament => tournament.startAt
    );

    if (filterGame === 'now') {
      tournamentList = filter(
        tournamentList,
        tournament =>
          moment(tournament.startAt).format('DD-MM') ===
          moment().format('DD-MM')
      );
    }

    if (filterGame === 'past') {
      tournamentList = filter(
        tournamentList,
        tournament =>
          moment(tournament.startAt).format('DD-MM') < moment().format('DD-MM')
      );
    }

    if (filterGame === 'upcoming') {
      tournamentList = filter(
        tournamentList,
        tournament =>
          moment(tournament.startAt).format('DD-MM') > moment().format('DD-MM')
      );
    }

    const nowTournaments = tournamentList.length === 0;
    console.log(tournamentList);


    return (
      <div className={cx('tournaments', 'container')}>
        <div className={cx('tournaments_sidebar')}>
          <Button className={cx({'active': filterGame === 'now'})} text="Now!" onClick={() => this.setFilterGame('now')}/>
          <Button className={cx({'active': filterGame === 'upcoming'})} text="Upcoming" onClick={() => this.setFilterGame('upcoming')}/>
          <Button className={cx({'active': filterGame === 'past'})} text="Past" onClick={() => this.setFilterGame('past')}/>
        </div>

        <div className={style.wrap_tournaments}>
          {/* <div className={style.game}>
            <Button
              text="Clear filter"
              className={style.game_button}
              onClick={() => this.setGame('')}
            />
            <Button
              text="PUBG"
              className={style.game_button}
              onClick={() => this.setGame('PUBG')}
            />
            <Button
              text="LOL"
              className={style.game_button}
              onClick={() => this.setGame('LOL')}
            />
          </div> */}
          <div className={cx('list', { '_is-loading': this.state.isLoading })}>
            {(isTournaments || nowTournaments) && (
              <span className={style.no_tournaments}>
                {i18n.t('not_yet_tournaments')}
              </span>
            )}

            {tournamentList.map(tournament => {
              // Const tournament = this.props.tournamentsList[id];
              const dateMonth = moment(tournament.startAt).format('MMM');
              const dateDay = moment(tournament.startAt).format('DD');
              const championsLength =
                tournament.viewers && tournament.viewers.length;
              const tournamentName = tournament.name || i18n.t('no_name');
              const price =
                tournament.price === 0 ? i18n.t('free') : `$${tournament.price}`;
              console.log(getTournamentStatus(tournament))
              return (
                <Link
                  key={tournament._id}
                  to={`/tournaments/${tournament._id}`}
                  className={style.item}
                >
                  <TournamentCard
                    name={tournamentName}
                    dateDay={dateDay}
                    dateMonth={dateMonth}
                    price={price}
                    people={championsLength || 0}
                    imageUrl={tournament.imageUrl}
                    description={tournament.description}
                    className={style.card}
                    status={getTournamentStatus(tournament)}
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

          {this.state.isLoading && <Preloader isFullScreen/>}
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
    }
  ),
  withHandlers({
    openNewTournamentModal: props => () =>
      props.toggleModal({ id: 'new-tournament-modal' }),
  })
)(Tournaments);

export { default as actions } from './actions';
export { default as reducers } from './reducers';

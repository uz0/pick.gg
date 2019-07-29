import React, { Component } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames/bind';
import Button from 'components/button';
import TournamentCard from 'components/tournament-card';
import moment from 'moment';
import modalActions from 'components/modal-container/actions';
import { http } from 'helpers';
import actions from './actions';
import style from './style.module.css';

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
    return (
      <div className={cx('tournaments', 'container')}>
        <div className={cx('list', { '_is-loading': this.state.isLoading })}>
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

          <Button
            appearance="_icon-accent"
            icon="plus"
            className={style.button}
            onClick={this.props.openNewTournamentModal}
          />
        </div>
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
  withHandlers({
    openNewTournamentModal: props => () => props.toggleModal({ id: 'new-tournament-modal' }),
  })
)(Tournaments);

export { default as actions } from './actions';
export { default as reducers } from './reducers';

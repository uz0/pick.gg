import React, { Component } from 'react';
import compose from 'recompose/compose';
import moment from 'moment';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { http } from 'helpers';
import i18n from 'i18n';
import Button from 'components/button';
import Icon from 'components/icon';
import TournamentMatches from 'components/tournament-matches';
import TournamentSummoners from 'components/tournament-summoners';
import TournamentViewers from 'components/tournament-viewers';
import TournamentApplicants from 'components/tournament-applicants';
import { actions as tournamentsActions } from 'pages/tournaments';
import { actions as modalActions } from 'components/modal-container';
import style from './style.module.css';

const cx = classnames.bind(style);

class Tournament extends Component {
  loadTournament = async () => {
    const response = await http(`/api/tournaments/${this.props.match.params.id}`);
    const tournament = await response.json();

    if (tournament) {
      this.props.addTournament(tournament);
    }
  };

  editTournament = () => this.props.toggleModal({
    id: 'edit-tournament-modal',

    options: {
      tournamentId: this.props.match.params.id,
    },
  });

  joinTournament = () => this.props.toggleModal({ id: 'join-tournament-players-modal' });

  attendTournament = async () => {
    const response = await http(`/api/tournaments/${this.props.match.params.id}/attend`, { method: 'PATCH' });
    const tournament = await response.json();
    this.props.updateTournament(tournament);
  };

  componentWillMount() {
    if (!this.props.tournament) {
      this.loadTournament();
    }
  }

  render() {
    const name = get(this.props, 'tournament.name');
    const description = get(this.props, 'tournament.description');
    const price = get(this.props, 'tournament.price');
    const date = moment(get(this.props, 'tournament.date', '')).format('MMM DD, h:mm');

    const isCurrentUserCreator = get(this.props, 'tournament.creator') === get(this.props, 'currentUser._id');

    return (
      <div className={cx('tournament', 'container')}>
        <div className={style.inner_container}>
          <div className={style.tournament_section}>
            <div className={style.main}>
              <h2 className={style.title}>{name}</h2>

              <div className={style.info}>
                <p className={style.text}>{date}</p>

                <p className={style.text}>
                Created By <Link to="/">efim1382 <Icon name="star"/></Link>
                </p>
              </div>

              <p className={style.tournament_status}>tournament_started</p>
            </div>

            <div className={style.actions}>
              {isCurrentUserCreator && (
                <Button
                  text={i18n.t('edit')}
                  appearance="_basic-accent"
                  className={style.button}
                  onClick={this.editTournament}
                />
              )}

              <Button
                text={i18n.t('join_tournament')}
                appearance="_basic-accent"
                className={style.button}
                onClick={this.joinTournament}
              />

              <Button
                text={i18n.t('suggest_yourself')}
                appearance="_basic-accent"
                className={style.button}
                onClick={this.attendTournament}
              />
            </div>
          </div>

          <h3 className={style.subtitle}>Information</h3>

          <div className={style.list}>
            {description &&
              <div className={style.item}>
                <label className={style.title}>Description</label>
                <p className={style.value}>{description}</p>
              </div>
            }

            {price &&
              <div className={style.item}>
                <label className={style.title}>Price</label>
                <p className={style.value}>{price} $</p>
              </div>
            }
          </div>

          {this.props.tournament && (
            <div className={style.widgets}>
              <TournamentApplicants id={this.props.match.params.id}/>
              <TournamentSummoners id={this.props.match.params.id}/>
              <TournamentViewers id={this.props.match.params.id}/>
              <TournamentMatches id={this.props.match.params.id}/>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.match.params.id],
      currentUser: state.currentUser,
    }),

    {
      addTournament: tournamentsActions.addTournament,
      updateTournament: tournamentsActions.updateTournament,
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Tournament);

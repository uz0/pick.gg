import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import ym from 'react-yandex-metrika';
import pick from 'lodash/pick';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import debounce from 'lodash/debounce';
import classnames from 'classnames/bind';
import { actions as tournamentsActions } from 'pages/tournaments';

import notificationActions from 'components/notification/actions';
import { actions as modalActions } from 'components/modal-container';
import { check } from 'components/dropin-auth/check';
import Table from 'components/table';
import Button from 'components/button';

import { http, calcSummonersPoints } from 'helpers';

import { withCaptions } from 'hoc';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 60,
  },

  name: {
    text: t('name'),
    width: isMobile ? 100 : 300,
  },

  points: {
    text: t('points'),
    width: isMobile ? 80 : 80,
  },
});

const renderRow = ({ className, itemClass, textClass, items, item, props, captions }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };
  const pointsStyle = { '--width': captions.points.width };
  const colorStyle = { ...numberStyle, '--color': item.color };

  const isTeamExistUsers = item.users.length > 0;
  const isDeleteTeamButtonShown = !isTeamExistUsers && items.length !== 1;

  return (
    <Fragment key={item._id}>
      <div key={item._id} className={cx(className, style.row)}>
        <div className={cx(itemClass, style.cell)} style={colorStyle}/>

        <div className={itemClass} style={nameStyle}>
          <span className={textClass}>{item.name}</span>
        </div>

        <Button
          appearance="_icon-transparent"
          icon="edit"
          className={style.action}
          onClick={props.openEditTeamModal(item)}
        />

        {isDeleteTeamButtonShown && (
          <Button
            appearance="_icon-transparent"
            icon="delete"
            className={style.action}
            onClick={props.deleteTeam(item._id)}
          />
        )}
      </div>

      {isTeamExistUsers &&
      item.users.map((userId, userIndex) => {
        const summoner = find(props.summoners, { _id: userId });

        if (!summoner) {
          return null;
        }

        const isSummonerWinner = props.tournament.winners.find(user => user.id === summoner._id);

        return (
          <div key={summoner._id} className={cx(className, style.row)}>
            <div className={cx(itemClass, style.cell)} style={numberStyle}>
              <span className={textClass}>{userIndex + 1}</span>
            </div>

            <div className={itemClass} style={nameStyle}>
              <span className={textClass}>
                {summoner.nickname}
                {isSummonerWinner && <span className={style.is_winner}> {i18n.t('is_winner')}</span>}
              </span>
            </div>

            {summoner.points > 0 && (
              <div className={cx(itemClass, style.cell)} style={pointsStyle}>
                <span className={cx(textClass, style.points)}>{summoner.points}</span>
              </div>
            )}

            <Button
              appearance="_icon-transparent"
              icon="dots"
              className={style.action}
              onClick={props.openChooseTeamModal(summoner._id)}
            />
          </div>
        );
      })
      }
    </Fragment>
  );
};

const Summoners = ({
  tournament,
  captions,
  teams,
  summoners,
  className,
  isUserCanApply,
  openEditTeamModal,
  isEditingAvailable,
  isApplicationsAvailable,
  isCurrentUserCanEdit,
  isApplicantRejected,
  isAlreadyApplicant,
  isAlreadySummoner,
  addSummoners,
  applyTournament,
  deleteTeam,
  randomizeUsers,
  openNewTeamModal,
  usersList,
  openChooseTeamModal,
}) => {
  return (
    <div className={cx(style.summoners, className)}>
      <div className={style.header}>
        <h3 className={style.subtitle}>{i18n.t('summoners')}</h3>

        {isEditingAvailable && summoners.length > 0 && (
          <button
            type="button"
            className={style.button}
            onClick={openNewTeamModal}
          >
            {i18n.t('new_team')}
          </button>
        )}

        {isEditingAvailable && summoners.length > 0 && (
          <Button
            appearance="_icon-transparent"
            icon="refresh"
            title={i18n.t('redistribution_players_by_teams')}
            className={style.button}
            onClick={randomizeUsers}
          />
        )}

        {isEditingAvailable && summoners.length > 0 && (
          <Button
            appearance="_icon-transparent"
            icon="edit"
            className={style.button}
            onClick={addSummoners}
          />
        )}
      </div>

      {isCurrentUserCanEdit && summoners.length === 0 && (
        <p className={style.empty}>{i18n.t('can_choose_summoners')}</p>
      )}

      {isUserCanApply && (
        <p className={style.empty}>{i18n.t('can_apply_summoner')}</p>
      )}

      {isAlreadyApplicant && !isAlreadySummoner && !isApplicantRejected && summoners.length === 0 && (
        <p className={style.empty}>{i18n.t('you_applied_summoner')}</p>
      )}

      <div className={style.content}>
        {isCurrentUserCanEdit && summoners.length === 0 && (
          <Button
            appearance="_circle-accent"
            icon="plus"
            className={style.button}
            onClick={addSummoners}
          />
        )}

        {!isCurrentUserCanEdit && !isAlreadySummoner && !isAlreadyApplicant && isApplicationsAvailable && (
          <Button
            appearance="_basic-accent"
            text={i18n.t('apply_summoner')}
            className={style.button}
            onClick={debounce(check(applyTournament, {
              title: 'Apply as summoner',
              action: applyTournament,
            }), 400)}
          />
        )}

        {summoners && summoners.length > 0 && (
          <Table
            noCaptions
            captions={captions}
            items={teams}
            withProps={{
              tournament,
              summoners,
              openChooseTeamModal,
              openEditTeamModal,
              deleteTeam,
              usersList,
            }}
            renderRow={renderRow}
            isLoading={false}
            className={style.table}
          />
        )}
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      currentUser: state.currentUser,
      users: state.users.list,
      tournament: state.tournaments.list[props.id],
      usersList: state.users.list,
    }),

    {
      showNotification: notificationActions.showNotification,
      updateTournament: tournamentsActions.updateTournament,
      toggleModal: modalActions.toggleModal,
    }
  ),

  withCaptions(tableCaptions),

  withHandlers({
    openNewTeamModal: props => () => props.toggleModal({
      id: 'edit-team-modal',

      options: {
        tournamentId: props.id,
      },
    }),

    openEditTeamModal: props => team => () => props.toggleModal({
      id: 'edit-team-modal',

      options: {
        tournamentId: props.id,
        team,
      },
    }),

    openChooseTeamModal: props => userId => () => props.toggleModal({
      id: 'choose-team-modal',

      options: {
        userId,
        teams: props.tournament.teams,
        tournamentId: props.id,
      },
    }),

    randomizeUsers: props => async () => {
      try {
        const response = await http(`/api/tournaments/${props.id}/teams/random`, {
          method: 'PATCH',
        });

        const { tournament } = await response.json();

        if (tournament) {
          props.updateTournament({
            _id: props.id,
            teams: tournament.teams,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    deleteTeam: props => teamId => async () => {
      try {
        const response = await http(`/api/tournaments/${props.id}/teams/${teamId}`, {
          method: 'DELETE',
        });

        const { success } = await response.json();

        if (success) {
          const teams = filter(props.tournament.teams, team => team._id !== teamId);

          props.updateTournament({
            _id: props.id,
            teams,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    applyTournament: props => async () => {
      const tournamentId = props.id;
      const currentUserId = props.currentUser._id;

      if (props.isAlreadyApplicantOrSummoner) {
        props.showNotification({
          type: 'error',
          shouldBeAddedToSidebar: false,
          message: i18n.t('you_send_join'),
        });

        return;
      }

      try {
        await http(`/api/tournaments/${tournamentId}/attend`, {
          method: 'PATCH',
        });

        ym('reachGoal', 'applied_as_summoner');

        props.updateTournament({
          _id: tournamentId,
          applicants: [...props.tournament.applicants, { user: currentUserId, status: 'PENDING' }],
        });
      } catch (error) {
        console.log(error);
      }
    },
  }),
  withProps(props => {
    const { _id: tournamentId, game, creator, matches, rules, teams, winners, isApplicationsAvailable } = props.tournament;
    const users = Object.values(props.users);
    const currentUserId = props.currentUser && props.currentUser._id;

    const isCurrentUserCreator = (props.currentUser && creator) && props.currentUser._id === creator._id;
    const isCurrentUserAdmin = props.currentUser && props.currentUser.isAdmin;
    const isCurrentUserModerator = includes(props.tournament.moderators, currentUserId);

    const isCurrentUserCanEdit = isCurrentUserCreator || isCurrentUserAdmin || isCurrentUserModerator;

    const isEditingAvailable = isCurrentUserCanEdit && !props.tournament.isStarted;

    const isAlreadyApplicant = find(props.tournament.applicants, { user: currentUserId });
    const isAlreadySummoner = props.tournament.summoners.includes(currentUserId);
    const isAlreadySummonerOrApplicant = isAlreadyApplicant || isAlreadySummoner;
    const isApplicantRejected = find(props.tournament.applicants, { user: currentUserId, status: 'REJECTED' });

    const isUserCanApply = !isCurrentUserCanEdit && !isAlreadySummonerOrApplicant && !isApplicantRejected && isApplicationsAvailable;

    let summoners = props.tournament.summoners.map(summonerId => {
      const summoner = users.find(user => user._id === summonerId);

      const normalizedSummoner = pick(summoner, ['_id', 'gameSpecificName']);

      // There is no summoner data until loadUsers redux
      return isEmpty(normalizedSummoner) ? {} : {
        _id: normalizedSummoner._id,
        nickname: normalizedSummoner.gameSpecificName[game],
      };
    });

    if (!isApplicationsAvailable) {
      summoners = calcSummonersPoints(summoners, matches, rules);
    }

    return {
      ...props,
      tournamentId,
      winners,
      isCurrentUserCreator,
      isEditingAvailable,
      isApplicationsAvailable,
      isCurrentUserCanEdit,
      isUserCanApply,
      isApplicantRejected,
      isAlreadyApplicant,
      isAlreadySummoner,
      teams,
      summoners: summoners || [],
    };
  }),
)(Summoners);

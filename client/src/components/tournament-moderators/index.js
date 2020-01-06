import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames/bind';
import { actions as tournamentsActions } from 'pages/tournaments';

import notificationActions from 'components/notification/actions';
import Table from 'components/table';
import Button from 'components/button';

import { http } from 'helpers';

import { withCaptions } from 'hoc';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  name: {
    text: t('name'),
    width: isMobile ? 180 : 380,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, captions }) => {
  const nameStyle = { '--width': captions.name.width };

  return (
    <div key={`${index}_${item.nickname}`} className={cx(className, style.row)}>
      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{`${index + 1}. ${item.nickname}`}</span>
      </div>
    </div>
  );
};

const Moderators = ({
  captions,
  moderators,
  className,
  isEditingAvailable,
  isCurrentUserCreatorOrAdmin,
  addModerators,
}) => {
  return (
    <div className={cx(style.moderators, className)}>
      <div className={style.header}>
        {isEditingAvailable && moderators.length > 0 && (
          <button
            type="button"
            className={style.button}
            onClick={addModerators}
          >
            {i18n.t('edit')}
          </button>
        )}
      </div>

      {isCurrentUserCreatorOrAdmin && moderators.length === 0 && (
        <p className={style.empty}>{i18n.t('can_choose_moderators')}</p>
      )}

      <div className={style.content}>
        {isCurrentUserCreatorOrAdmin && moderators.length === 0 && (
          <Button
            appearance="_small-accent"
            text={i18n.t('add_moderators')}
            className={style.button}
            onClick={addModerators}
          />
        )}

        {moderators && moderators.length > 0 && (
          <Table
            noCaptions
            captions={captions}
            items={moderators}
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
    }),

    {
      showNotification: notificationActions.showNotification,
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withCaptions(tableCaptions),
  withHandlers({
    applyTournament: props => async () => {
      const tournamentId = props.id;
      const currentUserId = props.currentUser._id;

      try {
        await http(`/api/tournaments/${tournamentId}/attend`, {
          method: 'PATCH',
        });

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
    const { _id: tournamentId, game, creator } = props.tournament;
    const users = Object.values(props.users);

    const isCurrentUserCreator = (props.currentUser && creator) && props.currentUser._id === creator._id;
    const isCurrentUserAdmin = props.currentUser && props.currentUser.isAdmin;

    const isCurrentUserCreatorOrAdmin = isCurrentUserCreator || isCurrentUserAdmin;

    const isEditingAvailable = isCurrentUserCreatorOrAdmin && !props.tournament.isStarted;

    const moderators = props.tournament.moderators.map(moderatorId => {
      const moderator = users.find(user => user._id === moderatorId);

      const normalizedModerator = pick(moderator, ['_id', 'gameSpecificFields']);

      // There is no moderator data until loadUsers redux
      return isEmpty(normalizedModerator) ? {} : {
        _id: normalizedModerator._id,
        nickname: normalizedModerator.gameSpecificFields[game].displayName,
      };
    });

    return {
      ...props,
      tournamentId,
      isCurrentUserCreator,
      isEditingAvailable,
      isCurrentUserCreatorOrAdmin,
      moderators: moderators || [],
    };
  }),
)(Moderators);

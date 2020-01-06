import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import ym from 'react-yandex-metrika';
import classnames from 'classnames/bind';
import pick from 'lodash/pick';
import debounce from 'lodash/debounce';
import { actions as tournamentsActions } from 'pages/tournaments';

import notificationActions from 'components/notification/actions';
import Button from 'components/button';
import Table from 'components/table';

import { http } from 'helpers';

import { withCaptions } from 'hoc';

import i18n from 'i18next';

import widgetStyle from '../style.module.css';
import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 55,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 200,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, captions, props }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };
  const isActionsAreVisible = props.isCurrentUserCreator && item.status === 'PENDING';

  return (
    <div key={item._id} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.number)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>
          {item.nickname}
          <span className={cx(style.status, { [style.accepted]: item.status === 'ACCEPTED' }, { [style.rejected]: item.status === 'REJECTED' })}>{` (${item.status})`}</span>
        </span>
      </div>

      {isActionsAreVisible && (
        <>
          <Button
            appearance="_icon-transparent"
            icon="plus"
            className={style.action}
            onClick={debounce(props.acceptApplicant(item), 400)}
          />

          <Button
            appearance="_icon-transparent"
            icon="close"
            className={style.action}
            onClick={props.rejectApplicant(item)}
          />
        </>
      )}
    </div>
  );
};

const Applicants = ({
  applicants,
  captions,
  className,
  isCurrentUserCreator,
  acceptApplicant,
  rejectApplicant,
}) => (
  <div className={cx(widgetStyle.widget, style.applicants, className)}>
    <div className={widgetStyle.header}>
      <h3 className={widgetStyle.title}>{i18n.t('tournament_page.applicants')}</h3>
    </div>

    <div className={cx(widgetStyle.content, style.content)}>
      <Table
        noCaptions
        captions={captions}
        isCurrentUserCreator={isCurrentUserCreator}
        items={applicants}
        renderRow={renderRow}
        className={style.table}
        withProps={{
          isCurrentUserCreator,
          acceptApplicant,
          rejectApplicant,
        }}
        emptyMessage={i18n.t('tournament_page.no_applicants')}
      />
    </div>
  </div>
);

export default compose(
  connect(
    (state, props) => ({
      users: state.users.list,
      currentUser: state.currentUser,
      tournament: state.tournaments.list[props.id],
    }),

    {
      showNotification: notificationActions.showNotification,
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withCaptions(tableCaptions),
  withProps(props => {
    const users = Object.values(props.users);
    const currentUserId = props.currentUser._id;
    const { game } = props.tournament;

    const isCurrentUserCreator = props.tournament.creator._id === currentUserId;

    if (props.tournament.applicants.length === 0) {
      return {
        ...props,
        applicants: [],
      };
    }

    const applicants = props.tournament.applicants.map(({ user, status }) => {
      const applicant = users.find(item => item._id === user);

      const normalizedApplicant = pick(applicant, ['_id', 'gameSpecificName']);

      return {
        _id: normalizedApplicant._id,
        nickname: normalizedApplicant.gameSpecificName && normalizedApplicant.gameSpecificName[game],
        status,
      };
    });

    return {
      ...props,
      applicants,
      isCurrentUserCreator,
    };
  }),
  withHandlers({
    acceptApplicant: props => item => async () => {
      const tournamentId = props.id;
      const applicantId = item._id;

      if (item.status === 'ACCEPTED') {
        props.showNotification({
          type: 'error',
          shouldBeAddedToSidebar: false,
          message: `${item.summonerName} ${i18n.t('tournament_page.accepted_summoner')}`,
        });
      }

      try {
        const request = await http(`/api/tournaments/${tournamentId}/applicantStatus`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ userId: applicantId, newStatus: 'ACCEPTED' }),
        });

        const tournament = await request.json();

        props.updateTournament(tournament);
      } catch (error) {
        console.log(error);
      }
    },
    rejectApplicant: props => item => async () => {
      const tournamentId = props.id;
      const applicantId = item._id;

      try {
        await http(`/api/tournaments/${tournamentId}/applicantStatus`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ userId: applicantId, newStatus: 'REJECTED' }),
        });

        const applicants = props.tournament.applicants.map(item => {
          if (item.user === applicantId) {
            item.status = 'REJECTED';
          }

          return item;
        });

        ym('reachGoal', 'rejected_as_summoner');

        props.updateTournament({
          ...props.tournament,
          applicants,
        });
      } catch (error) {
        console.log(error);
      }
    },
  }),
)(Applicants);

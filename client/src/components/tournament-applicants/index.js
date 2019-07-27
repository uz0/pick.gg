import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import pick from 'lodash/pick';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import { http } from 'helpers';
import { actions as tournamentsActions } from 'pages/tournaments';
import Button from 'components/button';
import Table from 'components/table';
import { withCaptions } from 'hoc';
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

  return (
    <div key={item._id} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.number)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{item.summonerName}{` ${item.status}`}</span>
      </div>

      {props.isCurrentUserCreator && (
        <>
          <Button
            appearance="_icon-transparent"
            icon="plus"
            className={style.action}
            onClick={props.acceptApplicant(item)}
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
  applyTournament,
  isCurrentUserCreator,
  isAlreadyApplicantOrSummoner,
  acceptApplicant,
  rejectApplicant,
}) => (
  <div className={cx(style.applicants, className)}>
    <div className={style.header}>
      <h3 className={style.subtitle}>Applicants</h3>
      {!isAlreadyApplicantOrSummoner && (
        <button type="button" className={style.button} onClick={debounce(applyTournament, 400)}>Apply as summoner</button>
      )}
      {isCurrentUserCreator && (
        <button type="button" className={style.button}>Stop</button>
      )}
    </div>

    <div className={style.content}>
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
        emptyMessage="There is no applicants yet"
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
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withCaptions(tableCaptions),
  withProps(props => {
    const users = Object.values(props.users);
    const currentUserId = props.currentUser._id;
    const isAlreadyApplicantOrSummoner = find(props.tournament.applicants, { user: currentUserId }) || props.tournament.summoners.includes(currentUserId);
    const isCurrentUserCreator = props.tournament.creator._id === currentUserId;

    if (props.tournament.applicants.length === 0) {
      return {
        ...props,
        applicants: [],
      };
    }

    const applicants = props.tournament.applicants.map(({ user, status }) => {
      const applicant = users.find(item => item._id === user);

      return {
        ...pick(applicant, ['_id', 'summonerName']),
        status,
      };
    });

    return {
      ...props,
      applicants,
      isAlreadyApplicantOrSummoner,
      isCurrentUserCreator,
    };
  }),
  withHandlers({
    applyTournament: props => async () => {
      const tournamentId = props.id;
      const currentUserId = props.currentUser._id;

      if (props.isAlreadyApplicantOrSummoner) {
        alert('Вы уже подали заявку на участие в турнире');

        return;
      }

      try {
        await http(`/api/tournaments/${tournamentId}/attend`, { method: 'PATCH' });

        props.updateTournament({
          _id: tournamentId,
          applicants: [...props.tournament.applicants, { user: currentUserId, status: 'PENDING' }],
        });
      } catch (error) {
        console.log(error);
      }
    },
    acceptApplicant: props => item => async event => {
      const tournamentId = props.id;
      const applicantId = item._id;

      if (item.status === 'ACCEPTED') {
        alert(`${item.summonerName} is already accepted as summoner`);
      }

      try {
        const acceptRequest = await http(`/api/tournaments/${tournamentId}/applicantStatus`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ userId: applicantId, newStatus: 'ACCEPTED' }),
        });

      } catch (error) {
        console.log(error);
      }
    },
    rejectApplicant: props => async () => {

    },
  }),
)(Applicants);
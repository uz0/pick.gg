import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import pick from 'lodash/pick';
import find from 'lodash/find';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { http, calcSummonersPoints } from 'helpers';
import { actions as tournamentsActions } from 'pages/tournaments';
import { withCaptions } from 'hoc';
import Table from 'components/table';
import Button from 'components/button';
import style from './style.module.css';
import { withHandlers } from 'recompose';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 40 : 60,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 300,
  },

  points: {
    text: t('points'),
    width: isMobile ? 50 : 80,
  },
});

const renderRow = ({ className, itemClass, textClass, index, item, captions }) => {
  const numberStyle = { '--width': captions.number.width };
  const nameStyle = { '--width': captions.name.width };
  const pointsStyle = { '--width': captions.points.width };

  return (
    <div key={item._id} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.cell)} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>{item.summonerName}</span>
      </div>

      {item.points > 0 && (
        <div className={cx(itemClass, style.cell)} style={pointsStyle}>
          <span className={cx(textClass, style.points)}>{item.points}</span>
        </div>
      )}
    </div>
  );
};

const Summoners = ({
  captions,
  summoners,
  className,
  isCurrentUserCreator,
  isApplicationsAvailable,
  isAlreadyApplicantOrSummoner,
  addSummoners,
  applyTournament,
}) => (
  <div className={cx(style.summoners, className)}>
    <div className={style.header}>
      <h3 className={style.subtitle}>Summoners</h3>
      {summoners && summoners.length > 0 && (
        <button
          type="button"
          className={style.button}
          onClick={addSummoners}
        >
          Edit
        </button>
      )}
    </div>

    {isCurrentUserCreator && summoners && (
      <p className={style.empty}>You can choose summoners</p>
    )}

    {!isCurrentUserCreator && !isAlreadyApplicantOrSummoner && (
      <p className={style.empty}>You can apply as summoner</p>
    )}

    {isAlreadyApplicantOrSummoner && summoners && (
      <p className={style.empty}>You already applied as summoner</p>
    )}

    <div className={style.content}>
      {isCurrentUserCreator && summoners && (
        <Button
          appearance="_circle-accent"
          icon="plus"
          className={style.button}
          onClick={addSummoners}
        />
      )}

      {!isCurrentUserCreator && !isAlreadyApplicantOrSummoner && isApplicationsAvailable && (
        <Button
          appearance="_basic-accent"
          text="Apply as summoner"
          className={style.button}
          onClick={applyTournament}
        />
      )}

      {summoners && summoners.length > 0 && (
        <Table
          noCaptions
          captions={captions}
          items={summoners}
          renderRow={renderRow}
          isLoading={false}
          className={style.table}
        />
      )}
    </div>
  </div>
);

export default compose(
  connect(
    (state, props) => ({
      currentUser: state.currentUser,
      users: state.users.list,
      tournament: state.tournaments.list[props.id],
    }),

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  ),
  withCaptions(tableCaptions),
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
  }),
  withProps(props => {
    const { creator, matches, rules, isApplicationsAvailable } = props.tournament;
    const users = Object.values(props.users);
    const currentUserId = props.currentUser && props.currentUser._id;

    const isCurrentUserCreator = (props.currentUser && creator) && props.currentUser._id === creator._id;
    const isAlreadyApplicantOrSummoner = find(props.tournament.applicants, { user: currentUserId }) || props.tournament.summoners.includes(currentUserId);

    if (props.tournament.summoners.length === 0) {
      return {
        ...props,
        isCurrentUserCreator,
        isApplicationsAvailable,
        isAlreadyApplicantOrSummoner,
        summoners: [],
      };
    }

    let summoners = props.tournament.summoners.map(summonerId => {
      const summoner = users.find(user => user._id === summonerId);

      return pick(summoner, ['_id', 'summonerName']);
    });

    if (!isApplicationsAvailable) {
      summoners = calcSummonersPoints(summoners, matches, rules);
    }

    return {
      ...props,
      isCurrentUserCreator,
      isApplicationsAvailable,
      isAlreadyApplicantOrSummoner,
      summoners,
    };
  }),
)(Summoners);

import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import classnames from 'classnames';

import RewardPlaceholder from 'assets/trophy.svg';

import { REWARD_POSITIONS } from 'constants/index';

import { withCaptions } from 'hoc';

import i18n from 'i18next';

import style from './style.module.css';

const cx = classnames.bind(style);

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('number'),
    width: isMobile ? 55 : 35,
  },

  name: {
    text: t('name'),
    width: isMobile ? 150 : 300,
  },
});

const Rewards = ({
  tournament,
  className,
}) => (
  <div className={cx(style.rewards, className)}>
    <div className={cx(style.content)}>

      {tournament.unfoldedRewards && tournament.unfoldedRewards.length !== 0 && (
        <div className={style.prizes}>
          <div className={style.list}>
            {tournament.unfoldedRewards.map(reward => {
              return (
                <div key={reward._id} className={style.item}>
                  <div className={style.avatar}>
                    <img
                      src={reward.image}
                      alt="reward"
                      onError={e => {
                        e.currentTarget.src = RewardPlaceholder;
                      }}
                    />
                  </div>
                  <div className={style.info}>
                    <div className={style.name}>
                      {reward.description}
                    </div>
                    <div className={style.position}>
                      {
                        `${i18n.t('for')} ${REWARD_POSITIONS[tournament.rewards[reward._id]].role} ${i18n.t('and')}
                        ${REWARD_POSITIONS[tournament.rewards[reward._id]].place} ${i18n.t('place')}`
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
  ),
  withCaptions(tableCaptions),
)(Rewards);

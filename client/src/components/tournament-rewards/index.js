import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Button from 'components/button';
import { withCaptions } from 'hoc';
import style from './style.module.css';
import { REWARD_POSITIONS } from '../../constants';

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

const Rewards = ({ tournament, addRewards }) => (
  <div className={style.rewards}>
    <div className={style.header}>
      <h3 className={style.subtitle}>Rewards</h3>
      {tournament.unfoldedRewards.length > 0 && (
        <button
          type="button"
          className={style.button}
        >
          Edit
        </button>
      )}
    </div>

    {tournament.unfoldedRewards.length === 0 && (
      <p className={style.empty}>Add rewards</p>
    )}

    <div className={style.content}>
      {tournament.unfoldedRewards.length === 0 && (
        <Button
          appearance="_circle-accent"
          icon="plus"
          className={style.button}
          onClick={addRewards}
        />
      )}

      {tournament.unfoldedRewards.length !== 0 && (
        <div className={style.prizes}>
          <div className={style.list}>
            {tournament.unfoldedRewards.map(reward => {
              return (
                <div key={reward._id} className={style.item}>
                  <div className={style.avatar}>
                    <img src={reward.image}/>
                  </div>
                  <div className={style.info}>
                    <div className={style.name}>
                      {reward.description}
                    </div>
                    <div className={style.position}>
                      {
                        `For ${REWARD_POSITIONS[tournament.rewards[reward._id]].role} and
                        ${REWARD_POSITIONS[tournament.rewards[reward._id]].place} place`
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
      tournament: state.tournaments.list[props.id],
    }),
  ),
  withCaptions(tableCaptions),
)(Rewards);
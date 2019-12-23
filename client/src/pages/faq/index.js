/* eslint-disable camelcase */
import React from 'react';
import classnames from 'classnames/bind';

import StatusControl from 'components/tournament-information/controls/status-control';

import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

const FAQ = () => {
  const statusList = {
    waiting_applicants: 'Ждём аппликантов',
    add_rules_matches_rewards: 'Турнир создаётся',
    let_viewers_make_forecasts: 'Зрители могут сделать прогноз',
    tournament_go: 'Турнир начался',
    is_over: 'Турнир завершен',
  };

  return (
    <div className={cx('container', 'faq')}>

      <main className={style.main_block}>
        <section>
          <h2>Статусы</h2>
          <div className={style.statusList}>
            {Object.keys(statusList).map(status => (
              <div key={status} className={style.status}>
                <StatusControl status={status}/>
                <p>{i18n.t(`faq.${status}`)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQ;

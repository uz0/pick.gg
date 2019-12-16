import React, { Component } from 'react';
import classnames from 'classnames/bind';

import style from './style.module.css';

const cx = classnames.bind(style);

class TournamentTabs extends Component {
  state = {
    activeTabIndex: 0,
  }

  setTab(index) {
    this.setState({ activeTabIndex: index });
  }

  render() {
    const { activeTabIndex } = this.state;

    return (
      <div className={style.tabs}>
        <div className={style.header}>
          <button
            type="button"
            className={cx({ [style.active]: activeTabIndex === 0 })}
            onClick={() => this.setTab(0)}
          >
            Матчи
          </button>

          <button
            type="button"
            className={cx({ [style.active]: activeTabIndex === 1 })}
            onClick={() => this.setTab(1)}
          >
            Игроки
          </button>
        </div>
        <div className={style.content}>
          {activeTabIndex === 0 && (
            <div>
              {this.props.matchesTab}
            </div>
          )}

          {activeTabIndex === 1 && (
            <div>
              {this.props.playersTab}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TournamentTabs;

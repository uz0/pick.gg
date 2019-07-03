import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import Table from 'components/table';
import Preloader from 'components/preloader';

import style from './style.module.css';
import i18n from 'i18n';

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 100,
  },

  date: {
    text: i18n.t('date'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  users: {
    text: i18n.t('users'),
    width: window.innerWidth < 480 ? 75 : 100,
  },
};

class App extends Component {
  state = {
    tournaments: [],
    isLoading: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });

    this.setState({ isLoading: false });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.tournament.date).format('MMM DD');

    return (
      <NavLink to={`/tournaments/${item._id}`} className={className}>
        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
          <span className={textClass}>{item.name}</span>
        </div>

        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
          <span className={textClass}>{formattedDate}</span>
        </div>

        <div className={itemClass} style={{ '--width': tournamentsTableCaptions.users.width }}>
          <span className={textClass}>{item.users.length}</span>
        </div>
      </NavLink>
    );
  }

  render() {
    const { tournaments } = this.state;

    return (
      <div className="container">
        <div className={style.my_tournaments}>
          <div className={style.section}>
            <Table
              captions={tournamentsTableCaptions}
              items={tournaments}
              className={style.table}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
              emptyMessage={i18n.t('not_yet_tournaments')}
            />
          </div>

          {this.state.isLoading &&
            <Preloader isFullScreen/>
          }
        </div>
      </div>
    );
  }
}

export default App;

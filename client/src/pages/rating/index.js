import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import i18n from 'i18n';

import Table from 'components/table';
import cardTwo from 'assets/card-2.png';
import cardThree from 'assets/card-3.png';
import cardFour from 'assets/card-4.png';
import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';

import style from './style.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

const streamers = [
  { name: 'hyperRun', points: '1900' },
  { name: 'dcversus', points: '3333' },
  { name: 'Rocketman', points: '1340' },
  { name: 'rabbit', points: '1700' },
  { name: 'SpiceFox', points: '1000' },
];

const ratingTableCaptions = {

  avatar: {
    text: '',
    width: window.innerWidth < 480 ? 55 : 50,
  },

  name: {
    text: '',
    width: window.innerWidth < 480 ? 210 : 300,
  },

};

const sordStreamers = streamers.sort((a, b) => b.points - a.points);

class Rating extends Component {
  state = {
    playersList: [],
    isLoading: true,
  };

  renderRow = ({ className, itemClass, textClass, item }) => {
    const Avatar = () => item.photo ? <img src={item.photo} alt="userpic"/> : <AvatarPlaceholder/>;
    return (
      <NavLink key={item._id} to={`/user/${item._id}`} className={cx(className)}>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.avatar.width }}>
          <span className={cx(textClass, style.avatar_table)}><Avatar/></span>
        </div>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.name.width }}>
          <span className={textClass}>{item.name}</span>
        </div>
      </NavLink>
    );
  }

  render() {
    console.log(sordStreamers);
    const topUsers = sordStreamers.slice(0, 3);
    const sliceUsers = sordStreamers.slice(3);
    console.log('3:', topUsers);
    console.log('others:', sliceUsers);
    return (
      <div className={cx('container', 'rating')}>

        <main className={style.main_block}>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardTwo}/>
            </div>

            <h2>{i18n.t('Best streamers')}</h2>
            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={streamers}
              className={style.card}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />
          </div>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardThree}/>
            </div>

            <h2>{i18n.t('Best users')}</h2>
            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={streamers}
              className={style.card}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />
          </div>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardFour}/>
            </div>

            <h2>{i18n.t('Best summoners')}</h2>
            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={streamers}
              className={style.card}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />
          </div>

        </main>
      </div>
    );
  }
}

export default Rating;

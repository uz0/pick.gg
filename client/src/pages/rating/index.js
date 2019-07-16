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
  { name: 'Rox', points: '2' },
  { name: 'Ata', points: '550' },
  { name: 'agata', points: '17' },
  { name: 'Rif', points: '250' },
  { name: 'Wot oh my got cho proishodit skolko eche nado dobavit dannuh ', points: '234' },
];

const ratingTableCaptions = {

  avatar: {
    text: '',
    width: window.innerWidth < 480 ? 40 : 70,
  },

  name: {
    text: '',
    width: window.innerWidth < 480 ? 210 : 300,
  },

};

const sordStreamers = streamers.sort((a, b) => b.points - a.points);

class Rating extends Component {
  state = {
    isLoading: true,
    columnStreamers: false,
  };

  showStreamers = () => this.setState(prevState => ({ columnStreamers: !prevState.columnStreamers }));

  showUsers = () => this.setState(prevState => ({ columnUsers: !prevState.columnUsers }));

  showSummoners = () => this.setState(prevState => ({ columnSummoners: !prevState.columnSummoners }));

  renderRow = ({ className, itemClass, textClass, item }) => {
    const Avatar = () => item.photo ? <img src={item.photo} alt="userpic"/> : <AvatarPlaceholder/>;
    return (
      <NavLink key={item._id} to={`/user/${item._id}`} className={cx(className, style.row_column)}>

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
    const sliceUsers = sordStreamers.slice(3, 97);

    const textStreamers = this.state.columnStreamers ? i18n.t('hide_streamers') : i18n.t('show_streamers');
    const textUsers = this.state.columnUsers ? i18n.t('hide_users') : i18n.t('show_users');
    const textSummoners = this.state.columnSummoners ? i18n.t('hide_summoners') : i18n.t('show_summoners');

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
              items={topUsers}
              className={style.column}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={sliceUsers}
              className={cx(style.hidden, { show: this.state.columnStreamers })}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <div className={style.see_all} onClick={this.showStreamers}>{textStreamers}</div>
          </div>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardThree}/>
            </div>

            <h2>{i18n.t('Best users')}</h2>
            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={topUsers}
              className={style.column}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={sliceUsers}
              className={cx(style.hidden, { show: this.state.columnUsers })}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <div className={style.see_all} onClick={this.showUsers}>{textUsers}</div>
          </div>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardFour}/>
            </div>

            <h2>{i18n.t('Best summoners')}</h2>

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={topUsers}
              className={style.column}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={sliceUsers}
              className={cx(style.hidden, { show: this.state.columnSummoners })}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <div className={style.see_all} onClick={this.showSummoners}>{textSummoners}</div>
          </div>

        </main>
      </div>
    );
  }
}

export default Rating;

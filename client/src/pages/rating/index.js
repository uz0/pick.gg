import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import i18n from 'i18n';
import { http } from 'helpers';

import Table from 'components/table';
import cardTwo from 'assets/card-2.png';
import cardThree from 'assets/card-3.png';
import cardFour from 'assets/card-4.png';
import AvatarPlaceholder from 'assets/avatar-placeholder.svg';

import style from './style.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(style);

const ratingTableCaptions = {
  avatar: {
    text: '',
    width: window.innerWidth < 480 ? 40 : 70,
  },

  name: {
    text: '',
    width: window.innerWidth < 480 ? 210 : 220,
  },
};

class Rating extends Component {
  state = {
    isLoading: true,
    columnStreamers: false,

    topApplicants: '',
    topStreamers: '',
    topViewers: '',

    wholeApplicantsList: '',
    wholeStreamersList: '',
    wholeViewersList: '',
  };

  async componentDidMount() {
    const ratingRequest = await http('/public/rating');
    const { ...allRating } = await ratingRequest.json();

    const applicants = allRating.applicantsRating;
    const streamers = allRating.streamersRating;
    const viewers = allRating.viewersRating;

    const topApplicants = applicants.slice(0, 3);
    const wholeApplicantsList = applicants.slice(3, 97);

    const topStreamers = streamers.slice(0, 3);
    const wholeStreamersList = streamers.slice(3, 97);

    const topViewers = viewers.slice(0, 3);
    const wholeViewersList = viewers.slice(3, 97);

    this.setState({
      topStreamers,
      topApplicants,
      topViewers,
      wholeApplicantsList,
      wholeStreamersList,
      wholeViewersList,
    });
  }

  showStreamers = () => this.setState(prevState => ({ columnStreamers: !prevState.columnStreamers }));

  showUsers = () => this.setState(prevState => ({ columnUsers: !prevState.columnUsers }));

  showSummoners = () => this.setState(prevState => ({ columnSummoners: !prevState.columnSummoners }));

  renderRow = ({ className, itemClass, textClass, item }) => {
    return (
      <NavLink key={item._id} to={`/user/${item._id}`} className={cx(className, style.row_column)}>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.avatar.width }}>
          <span className={cx(textClass, style.avatar_table)}>
            <img
              src={item.imageUrl}
              alt="userpic"
              onError={e => {
                e.currentTarget.src = AvatarPlaceholder;
              }}
            />
          </span>
        </div>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.name.width }}>
          <span className={textClass}>{item.username}</span>
        </div>
      </NavLink>
    );
  }

  renderApplicants = ({ className, itemClass, textClass, item }) => {
    const isSummonerName = item.summonerName ? item.summonerName : item.username;
    return (
      <NavLink key={item._id} to={`/user/${item._id}`} className={cx(className, style.row_column)}>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.avatar.width }}>
          <span className={cx(textClass, style.avatar_table)}>
            <img
              src={item.imageUrl}
              alt="userpic"
              onError={e => {
                e.currentTarget.src = AvatarPlaceholder;
              }}
            />
          </span>
        </div>

        <div className={itemClass} style={{ '--width': ratingTableCaptions.name.width }}>
          <span className={textClass}>{isSummonerName}</span>
        </div>
      </NavLink>
    );
  }

  render() {
    const {
      topStreamers,
      topApplicants,
      topViewers,
      wholeApplicantsList,
      wholeStreamersList,
      wholeViewersList,
    } = this.state;

    const textStreamers = this.state.columnStreamers ? i18n.t('hide_streamers') : i18n.t('show_streamers');
    const textUsers = this.state.columnUsers ? i18n.t('hide_viewers') : i18n.t('show_viewers');
    const textSummoners = this.state.columnSummoners ? i18n.t('hide_summoners') : i18n.t('show_summoners');

    return (
      <div className={cx('container', 'rating')}>

        <main className={style.main_block}>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardTwo} alt="streamers rating logo"/>
            </div>

            <h2>{i18n.t('best_streamers')}</h2>
            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={topStreamers}
              className={style.column}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={wholeStreamersList}
              className={cx(style.hidden, { show: this.state.columnStreamers })}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <div className={style.see_all} onClick={this.showStreamers}>{textStreamers}</div>
          </div>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardThree} alt="viewers rating logo"/>
            </div>

            <h2>{i18n.t('best_users')}</h2>
            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={topViewers}
              className={style.column}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={wholeViewersList}
              className={cx(style.hidden, { show: this.state.columnUsers })}
              renderRow={this.renderRow}
              isLoading={this.state.isLoading}
            />

            <div className={style.see_all} onClick={this.showUsers}>{textUsers}</div>
          </div>

          <div className={cx(style.section)}>
            <div className={style.best_icon}>
              <img src={cardFour} alt="appllicants rating logo"/>
            </div>

            <h2>{i18n.t('best_summoners')}</h2>

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={topApplicants}
              className={style.column}
              renderRow={this.renderApplicants}
              isLoading={this.state.isLoading}
            />

            <Table
              captions={ratingTableCaptions}
              defaultSorting={this.tournamentsDefaultSorting}
              items={wholeApplicantsList}
              className={cx(style.hidden, { show: this.state.columnSummoners })}
              renderRow={this.renderApplicants}
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

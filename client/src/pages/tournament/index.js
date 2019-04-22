import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import Button from 'components/button';
import Modal from 'components/dashboard-modal';
import ChooseChampionModal from 'components/choose-champion';
import Preloader from 'components/preloader';
import Table from 'components/table';

import io from "socket.io-client";

import UserService from 'services/userService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import moment from 'moment';
import find from 'lodash/find';
import { ReactComponent as TrophyIcon } from 'assets/trophy.svg';
import Avatar from 'assets/avatar-placeholder.svg';
import classnames from 'classnames/bind';
import i18n from 'i18n';

import _ from 'lodash';

import style from './style.module.css';

const cx = classnames.bind(style);

const matchInfoTableCaptions = {
  player: {
    text: 'Player',
    width: 120,
  },

  kill: {
    text: 'Kills',
    width: window.innerWidth < 480 ? 50 : 75,
  },

  death: {
    text: 'Deaths',
    width: window.innerWidth < 480 ? 50 : 75,
  },

  assists: {
    text: 'Assists',
    width: window.innerWidth < 480 ? 50 : 75,
  },
};

const leadersTableCaptions = {
  position: {
    text: i18n.t('position'),
    width: 65,
  },

  name: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 100 : 200,
  },

  points: {
    text: i18n.t('points'),
    width: window.innerWidth < 480 ? 100 : 250,
  },
};

const matchesTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 100 : 300,
  },

  points: {
    text: i18n.t('points'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  date: {
    text: i18n.t('date'),
    width: window.innerWidth < 480 ? 75 : 100,
  },
};

class Tournament extends Component {
  constructor() {
    super();
    this.tournamentService = new TournamentService();
    this.notificationService = new NotificationService();
    this.userService = new UserService();
  }

  state = {
    fantasyTournament: null,
    matches: [],
    users: [],
    rulesNames: [],
    isLoading: true,
    isChooseChampionModalShown: false,
    username: '',
  };

  async componentDidMount() {
    const { user } = await this.userService.getMyProfile();

    this.setState({
      currentUser: user,
      username: user.username,
    });

    this.socket = io();

    this.socket.on('tournamentParticipantsUpdate', ({ user }) => {

      if (this.state.currentUser.username !== user.username) {
        this.notificationService.showSingleNotification({
          type: 'match',
          shouldBeAddedToSidebar: false,
          message: `${user.username} has been registered to the tournament`,
        });
      }

      this.loadTournamentData();
    });

    this.loadTournamentData();
  }

  loadTournamentData = () => new Promise(async resolve => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
    }

    this.tournamentId = this.props.match.params.id;

    if (!this.tournamentId) {
      return;
    }

    const { tournament } = await this.tournamentService.getTournamentById(this.tournamentId);

    if (!tournament) {
      return;
    }

    const realTournament = tournament.tournament;
    const users = tournament.users;
    const currentUserParticipant = find(tournament.users, item => item.user._id === this.state.currentUser._id);
    const matches = realTournament.matches;

    users && users.forEach(item => {
      item.totalResults = this.getTotalUserScore(tournament, item.user._id);
    });

    currentUserParticipant && currentUserParticipant.players.forEach(item => {
      item.championScore = this.getUserPlayerScore(tournament, item._id);
    });

    this.setState({
      isLoading: false,
      fantasyTournament: tournament,
      isChooseChampionModalShown: false,
      matches,
      users,
    });

    resolve();
  });

  toggleChampionModal = () => this.setState({ isChooseChampionModalShown: !this.state.isChooseChampionModalShown });

  getTournamentStatus = () => {

    if (!this.state.fantasyTournament) {
      return '';
    }

    if (this.state.fantasyTournament.winner !== null) {
      return i18n.t('is_over');
    }

    const tournamentDate = this.state.fantasyTournament.tournament.date;

    if (moment().isSame(moment(tournamentDate), 'd')) {
      return i18n.t('is_going_on');
    }

    if (moment(tournamentDate).add(16, 'hours').isBefore(moment())) {
      return i18n.t('archive');
    }

    if (moment(tournamentDate).isAfter(moment())) {
      return i18n.t('will_be_soon');
    }
  }

  getFantasyTournamentStatus = () => {
    const currentUserParticipant = this.state.fantasyTournament && find(this.state.fantasyTournament.users, item => item.user._id === this.state.currentUser._id);
    const tournamentWinner = this.state.fantasyTournament && this.state.fantasyTournament.winner !== null;
    const champions = (currentUserParticipant && currentUserParticipant.players) || [];

    if (tournamentWinner) {
      return i18n.t('is_over');
    }
    if (champions.length > 0) {
      return i18n.t('wait_matches');
    }
    if (champions.length === 0) {
      return i18n.t('join_tournament_and');
    }
  }

  getTournamentPrize = () => this.state.fantasyTournament.users.length * this.state.fantasyTournament.entry;

  getCountMatchPoints = (fantasyTournament, matchId, userId) => {
    const userPlayers = this.getUserPlayers(fantasyTournament, userId);
    const ruleSet = this.getRulesSet(fantasyTournament);
    const rulesIds = fantasyTournament.rules.map(item => item.rule._id);

    const userPlayersIds = userPlayers.map(player => player._id);

    const match = find(fantasyTournament.tournament.matches, { _id: matchId });

    if (!match.completed) {
      return 0;
    }

    const results = match.results.playersResults;

    const userPlayersWithResults = results.filter(item => userPlayersIds.includes(item.playerId) ? item : false);
    const userPlayersResults = userPlayersWithResults.reduce((arr, item) => {
      arr.push(...item.results);
      return arr;
    }, []);

    const userPlayersResultsSum = userPlayersResults.reduce((sum, item) => {
      if (rulesIds.includes(item.rule)) {
        sum += item.score * ruleSet[item.rule];
      }
      return sum;
    }, 0);

    return userPlayersResultsSum;
  };

  getTotalUserScore = (fantasyTournament, userId) => {
    
    const matches = fantasyTournament.tournament.matches;
    const userMatchResults = matches.map(match => this.getCountMatchPoints(fantasyTournament, match._id, userId));
    const totalUserScore = userMatchResults.reduce((sum, score) => sum += score);

    return totalUserScore;
  };

  getUserPlayers = (fantasyTournament, userId) => {
    const user = find(fantasyTournament.users, (item) => item.user._id === userId);

    return user.players;
  };

  getUserPlayerScore = (fantasyTournament, playerId) => {
    const ruleSet = this.getRulesSet(fantasyTournament);
    const rulesIds = fantasyTournament.rules.map(item => item.rule._id);

    const tournamentMatches = fantasyTournament.tournament.matches;
    const tournamentMatchesWithResults = tournamentMatches.filter(match => match.results !== null);

    const playerResults = tournamentMatchesWithResults.map(item => item.results.playersResults.filter(item => item.playerId === playerId).map(item => item.results));
    const playerResultsWithdata = playerResults.filter(item => item.length > 0).reduce((arr, item) => {
      item.forEach(element => arr.push(...element));
      return arr;
    }, []);

    const aggregatedPlayerResultsSum = playerResultsWithdata.reduce((sum, item) => {
      if (rulesIds.includes(item.rule)) {
        sum += item.score * ruleSet[item.rule];
      }
      return sum;
    }, 0);

    return aggregatedPlayerResultsSum;
  };

  getCalcUserProgress = (fantasyTournament, userId) => {
    const usersResults = this.state.users.map(item => this.getTotalUserScore(fantasyTournament, item.user._id));
    const currentUserResult = this.getTotalUserScore(fantasyTournament, userId);

    const maxResult = Math.max(...usersResults);

    return currentUserResult / maxResult * 100;
  };

  leadersDefaultSorting = (prev, next) => {
    return next.totalResults - prev.totalResults;
  };

  getRulesSet = (fantasyTournament) => fantasyTournament.rules.reduce((set, item) => {
    set[`${item.rule._id}`] = item.score;
    return set;
  }, {});


  getRulesNames = () => {
    if (!this.state.fantasyTournament) {
      return;
    }

    const rules = this.state.fantasyTournament.rules;
    let str = '';

    rules.forEach(rule => {
      if (!str) {
        str = rule.rule.name[0] + rule.score;
        return;
      }

      str += ` / ${rule.rule.name[0] + rule.score}`;
    });

    return str;
  };

  addPlayers = async ids => {
    this.setState({ isLoading: true });

    const payload = {
      players: ids,
    };

    await this.tournamentService.participateInTournament(this.tournamentId, payload);
    await this.loadTournamentData();

    this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: i18n.t('youve_been_registered_for_the_tournament'),
    });
  };

  openMatchResults = (event, item) => {
    event.preventDefault();

    const fantasyTournamentChampions = this.state.fantasyTournament.tournament.champions;
    const fantasyTournamentRules = this.state.fantasyTournament.rules.map(item => item.rule);

    const playersResults = item.results.playersResults;
    const groupedMatchResults = Object.values(Object.freeze(_.groupBy(playersResults, 'id')));
    let matchResults = [];

    for (let i = 0; i < groupedMatchResults.length; i++) {
      let matchResult = _.cloneDeep(groupedMatchResults[i][0]);

      for (let j = 1; j < groupedMatchResults[i].length; j++) {
        matchResult.results[0].score += groupedMatchResults[i][j].results[0].score;
        matchResult.results[1].score += groupedMatchResults[i][j].results[1].score;
        matchResult.results[2].score += groupedMatchResults[i][j].results[2].score;
      }

      matchResults.push(matchResult);
    }

    matchResults.forEach(match => {
      match.playerName = _.find(fantasyTournamentChampions, { _id: match.playerId }).name;

      match.results.forEach(item => {
        item.ruleName = _.find(fantasyTournamentRules, { _id: item.rule }).name;
      });
    });

    this.setState({
      isMatchInfoActive: true,
      matchInfo: matchResults,
      matchTitle: item.name,
    });
  }

  closeMatchInfo = () => {
    this.setState({
      isMatchInfoActive: false,
      matchInfo: [],
      matchTitle: '',
    });
  }

  renderLeaderRow = ({ className, itemClass, textClass, index, item }) => {
    const { fantasyTournament } = this.state;
    const summonerName = this.state.username;
    const summonerArr = item.user.username === summonerName;
    const totalScore = this.getTotalUserScore(fantasyTournament, item.user._id);
    const progressPercents = this.getCalcUserProgress(fantasyTournament, item.user._id);

    return <div className={cx(className, { 'active_summoner': summonerArr })} key={item.user._id}>
      <div className={cx('leader_num_cell', itemClass)} style={{ '--width': leadersTableCaptions.position.width }}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={cx('leader_name_cell', itemClass)} style={{ '--width': leadersTableCaptions.name.width }}>
        <span className={textClass}>{item.user.username}</span>
      </div>

      {totalScore > 0 &&
        <div className={itemClass} style={{ '--width': leadersTableCaptions.points.width }}>
          <div className={style.leader_progress} style={{ '--width': progressPercents }}>{totalScore}</div>
        </div>
      }
    </div>;
  };

  isUsername = (item) => {
    const summonerName = this.state.username;

    return item.user.username === summonerName;
  }

  renderSummonerLeaderRow = ({ className, itemClass, textClass, item }) => {
    const { fantasyTournament } = this.state;
    const users = this.state.users;
    const sortUsers = users.sort(this.leadersDefaultSorting);
    const indexUser = sortUsers.findIndex(this.isUsername);

    const totalScore = this.getTotalUserScore(fantasyTournament, item.user._id);
    const progressPercents = this.getCalcUserProgress(fantasyTournament, item.user._id);

    return <div className={cx(className, 'summoner_arr')} key={item.user._id}>
      <div className={cx('leader_num_cell', itemClass)} style={{ '--width': leadersTableCaptions.position.width }}>
        <span className={textClass}>{indexUser + 1}</span>
      </div>

      <div className={cx('leader_name_cell', itemClass)} style={{ '--width': leadersTableCaptions.name.width }}>
        <span className={textClass}>{item.user.username}</span>
      </div>

      {totalScore > 0 &&
        <div className={itemClass} style={{ '--width': leadersTableCaptions.points.width }}>
          <div className={style.leader_progress} style={{ '--width': progressPercents }}>{totalScore}</div>
        </div>
      }
    </div>;
  };

  renderMatchRow = ({ className, itemClass, textClass, item }) => {
    const { fantasyTournament } = this.state;
    const currentUserParticipant = this.state.fantasyTournament && find(this.state.fantasyTournament.users, item => item.user._id === this.state.currentUser._id);

    const points = currentUserParticipant && this.getCountMatchPoints(fantasyTournament, item._id, this.state.currentUser._id);
    const matchPoints = points > 0 ? points : 0;

    const isMatchCompleted = item.completed;
    const time = moment(item.startDate).format('HH:mm');
    const url = '';
    const urlMatch = url === '' ? '' : url;
    const timeMatch = moment(item.startDate).format('MMM DD HH:mm');
    const timeNow = moment().format('MMM DD HH:mm');
    const disableUrlStyle = moment(timeNow).isAfter(timeMatch);

    return <NavLink to={urlMatch} onClick={(event) => this.openMatchResults(event, item)} target="_blank" className={cx(className, { "disable_url": disableUrlStyle, "completed": isMatchCompleted })} key={item.id}>
      <div className={itemClass} style={{ '--width': matchesTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchesTableCaptions.points.width }}>
        {isMatchCompleted && currentUserParticipant &&
          <div className={style.match_points}>{`+${matchPoints}`}</div>
        }
      </div>

      <div className={itemClass} style={{ '--width': matchesTableCaptions.date.width }}>
        <span className={textClass}>{time}</span>
      </div>
    </NavLink>;
  };

  renderMatchInfoRow = ({ className, itemClass, textClass, item }) => {
    const currentUserParticipant = this.state.fantasyTournament && find(this.state.fantasyTournament.users, item => item.user._id === this.state.currentUser._id);
    const champions = (currentUserParticipant && currentUserParticipant.players) || [];
    const isPlayerChoosedByUser = _.find(champions, { _id: item.playerId }) ? true : false;

    return <div className={cx(className, style.row_dark, { [style.row_choosed]: isPlayerChoosedByUser })}>
      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.player.width }}>
        <span className={textClass}>{item.playerName}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.kill.width }}>
        <span className={textClass}>{item.results[0].score}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.death.width }}>
        <span className={textClass}>{item.results[1].score}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.assists.width }}>
        <span className={textClass}>{item.results[2].score}</span>
      </div>

    </div>;
  };

  render() {
    const currentUserParticipant = this.state.fantasyTournament && find(this.state.fantasyTournament.users, item => item.user._id === this.state.currentUser._id);
    const champions = (currentUserParticipant && currentUserParticipant.players) || [];
    const isTournamentNotFree = this.state.fantasyTournament && this.state.fantasyTournament.entry > 0;
    const prize = isTournamentNotFree ? this.getTournamentPrize() : i18n.t('free');
    const entry = isTournamentNotFree ? this.state.fantasyTournament.entry : i18n.t('free');
    const tournamentName = this.state.fantasyTournament && this.state.fantasyTournament.tournament.name;
    const fantasyTournamentName = this.state.fantasyTournament && this.state.fantasyTournament.name;
    const tournamentDate = this.state.fantasyTournament && moment(this.state.fantasyTournament.tournament.date).format('MMM DD, h:mm');
    const tournamentCreator = this.state.fantasyTournament && this.state.fantasyTournament.creator.username;
    const tournamentCreatorLink = this.state.fantasyTournament && this.state.fantasyTournament.creator._id;
    const status = this.getTournamentStatus();
    const tournamentStatus = this.getFantasyTournamentStatus();
    const winner = this.state.fantasyTournament && this.state.fantasyTournament.winner;
    // const firstMatchDate = this.state.matches.length > 0 ? this.state.matches[0].startDate : '';
    const isJoinButtonShown = !currentUserParticipant && !winner;
    // const isJoinButtonShown = !currentUserParticipant && !winner && moment().isBefore(firstMatchDate);
    const tournamentChampions = this.state.fantasyTournament && this.state.fantasyTournament.tournament.champions;
    const rules = this.getRulesNames();
    const topTen = this.state.users.slice(0, 9);
    const summonerName = this.state.username;
    const summonerArr = topTen.filter(item => item.user.username === summonerName);
    const renderSummonerArr = summonerArr ? '' : summonerArr;
    const matchInfo = this.state.matchInfo && this.state.matchInfo;

    return <div className={style.tournament}>
      <div className={style.tournament_section}>
        <div className={style.main}>
          <h2 className={style.title}>{fantasyTournamentName}</h2>

          <div className={style.info}>
            <span>{tournamentDate}</span>

            <span>
              {i18n.t('created_by')} <Link to={`/user/${tournamentCreatorLink}`}>{tournamentCreator}</Link>
            </span>

            {status && <div className={style.status}>{status}</div>}
          </div>

          <span className={style.fantasy_status}>{tournamentStatus}</span>
        </div>

        {isJoinButtonShown &&
          <Button
            text={i18n.t('join_tournament')}
            appearance="_basic-accent"
            onClick={this.toggleChampionModal}
            className={cx(style.button)}
          />
        }
      </div>

      {winner &&
        <div className={style.winner}>
          <TrophyIcon />

          <div className={style.text}>
            <p>
              {i18n.t('tournament_over', { winner: winner.username })}

              {isTournamentNotFree &&
                <span> {i18n.t('he_got_prize', { prize: `$${prize}` })}</span>
              }
            </p>
          </div>
        </div>
      }

      <h3 className={style.subtitle}>{i18n.t('information')}</h3>

      <div className={style.list}>
        <div className={style.item}>
          <label className={style.title}>{i18n.t('prize_pool')}</label>
          <p className={style.value}>{isTournamentNotFree ? `$${prize}` : prize}</p>
        </div>

        <div className={style.item}>
          <label className={style.title}>{i18n.t('entry_cost')}</label>
          <p className={style.value}>{isTournamentNotFree ? `$${entry}` : entry}</p>
        </div>

        <div className={style.item}>
          <label className={style.title}>{i18n.t('original_tournament')}</label>
          <p className={style.value}>{moment(tournamentDate).format('DD MMM')} – {tournamentName}</p>
        </div>

        <div className={style.item}>
          <label className={style.title}>{i18n.t('rules')}</label>
          <p className={style.value}>{rules}</p>
        </div>
      </div>

      {currentUserParticipant &&
        <h3 className={style.subtitle}>{i18n.t('my_team')}</h3>
      }

      {currentUserParticipant && champions.length > 0 &&
        <div className={style.team}>
          {champions.map(champion => <div className={style.champion} key={champion._id}>
            <div className={style.image}>
              <img src={champion.photo === null ? Avatar : champion.photo} alt={i18n.t('champion_avatar')} />
            </div>

            <span className={style.name}>{champion.name}</span>
            {champion.championScore !== null &&
              <div className={style.scores}>Score: {champion.championScore}</div>
            }
          </div>)}
        </div>
      }

      <div className={style.section}>
        <div className={style.matches}>
          <h3 className={style.subtitle}>{i18n.t('matches')}</h3>

          <Table
            noCaptions
            captions={matchesTableCaptions}
            items={this.state.matches}
            renderRow={this.renderMatchRow}
            isLoading={this.state.isLoading}
            className={style.table}
            emptyMessage="There is no matches yet"
          />
        </div>

        <div className={style.leaders}>
          <h3 className={style.subtitle}>{i18n.t('leaderboard')}</h3>

          <Table
            noCaptions
            captions={leadersTableCaptions}
            items={topTen}
            renderRow={this.renderLeaderRow}
            isLoading={this.state.isLoading}
            defaultSorting={this.leadersDefaultSorting}
            className={style.table}
            emptyMessage="There is no participants yet"
          />
          {renderSummonerArr &&
            <Table
              noCaptions
              items={summonerArr}
              renderRow={this.renderSummonerLeaderRow}
              isLoading={this.state.isLoading}
              className={style.table}
            />}
        </div>
      </div>

      {this.state.isLoading &&
        <Preloader />
      }

      {this.state.isMatchInfoActive && <Modal
        title={this.state.matchTitle}
        close={this.closeMatchInfo}
        wrapClassName={style.match_info_modal}
      >
        <Table
          captions={matchInfoTableCaptions}
          items={matchInfo}
          renderRow={this.renderMatchInfoRow}
          className={style.table}
          emptyMessage="There is no results yet"
        />
      </Modal>
      }

      {this.state.isChooseChampionModalShown &&
        <ChooseChampionModal
          champions={tournamentChampions}
          onClose={this.toggleChampionModal}
          action={this.addPlayers}
        />
      }
    </div>;
  }
}

export default Tournament;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/button';
import Preloader from 'components/preloader';
import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import DialogWindow from 'components/dialog-window';
import MatchModal from 'components/match-modal-tournament';
import ChooseChampionModal from 'components/choose-champion';

import i18n from 'i18n';
import io from 'socket.io-client';
import moment from 'moment';
import uuid from 'uuid';

import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';
import every from 'lodash/every';

import UserService from 'services/userService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';

import { ReactComponent as TrophyIcon } from 'assets/trophy.svg';
import Avatar from 'assets/avatar-placeholder.svg';

import classnames from 'classnames/bind';
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
    width: 55,
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
    this.streamerService = new StreamerService();
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
    isMatchEditModalShown: false,
    isSignInDialogShown: false,
    editingMatchId: '',
    username: '',
  };

  async componentDidMount() {
    const { user } = await this.userService.getMyProfile();

    this.setState({
      currentUser: user,
      username: user && user.username,
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

  finalizeStreamerTournament = async () => {
    const { fantasyTournament } = this.state;
    const isAllMatchesCompleted = every(this.state.matches, { completed: true });

    if (fantasyTournament.users.length === 0) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.finalization.no_participatns'),
      });

      return;
    }

    if (!isAllMatchesCompleted) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.finalization.uncompleted_matches'),
      });

      return;
    }

    try {
      await this.streamerService.finalizeTournament(fantasyTournament._id);
    } catch (error) {
      console.log(error);
    }
  }

  toggleChampionModal = () => this.setState({ isChooseChampionModalShown: !this.state.isChooseChampionModalShown });

  toggleSignInDialog = () => this.setState({ isSignInDialogShown: !this.state.isSignInDialogShown });

  redirectToLogin = () => this.props.history.replace(`/?tournamentId=${this.state.fantasyTournament._id}`);

  copyInput = () => {
    document.querySelector('#copyUrl').select();
    document.execCommand('copy');
    this.setState({
      animate: true,
    });
  }

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
      return i18n.t('');
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

  getCountUsers = () => 3;

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
    const groupedMatchResults = Object.values(Object.freeze(groupBy(playersResults, 'playerId')));
    let matchResults = [];

    for (let i = 0; i < groupedMatchResults.length; i++) {
      let matchResult = cloneDeep(groupedMatchResults[i][0]);

      for (let j = 1; j < groupedMatchResults[i].length; j++) {
        matchResult.results[0].score += groupedMatchResults[i][j].results[0].score;
        matchResult.results[1].score += groupedMatchResults[i][j].results[1].score;
        matchResult.results[2].score += groupedMatchResults[i][j].results[2].score;
      }

      matchResults.push(matchResult);
    }

    matchResults.forEach(match => {
      match.playerName = find(fantasyTournamentChampions, { _id: match.playerId }).name;

      match.results.forEach(item => {
        item.ruleName = find(fantasyTournamentRules, { _id: item.rule }).name;
      });
    });

    this.setState({
      isMatchInfoActive: true,
      matchInfo: matchResults,
      matchTitle: item.name,
    });
  }

  editMatchInit = (event, item) => {
    event.preventDefault();

    this.setState({
      isMatchEditModalShown: true,
      editingMatchId: item._id,
    });
  }

  closeMatchEditing = () => {
    this.setState({
      isMatchEditModalShown: false,
      editingMatchId: '',
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
    const isStreamer = item.user.isStreamer;

    return <div className={cx(className, { 'active_summoner': summonerArr })} key={item.user._id}>
      <div className={cx('leader_num_cell', itemClass)} style={{ '--width': leadersTableCaptions.position.width }}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={cx('leader_name_cell', itemClass)} style={{ '--width': leadersTableCaptions.name.width }}>
        <span className={cx(textClass, 'name_leader')}>{item.user.username}{isStreamer && <i title="Streamer" className="material-icons">star</i>}</span>
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
    const isUserStreamerAndCreator = this.state.currentUser && this.state.currentUser.isStreamer && this.state.currentUser._id === this.state.fantasyTournament.creator._id;

    const url = '';
    const urlMatch = url === '' ? '' : url;

    const time = moment(item.startDate).format('HH:mm');
    const timeMatch = moment(item.startDate).format('MMM DD HH:mm');
    const timeNow = moment().format('MMM DD HH:mm');

    const disableUrlStyle = moment(timeNow).isAfter(timeMatch);

    return <div key={uuid()} to={urlMatch} target="_blank" className={cx(className, { "disable_url": disableUrlStyle, "completed": isMatchCompleted })}>
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

      <button className={style.match_button} onClick={(event) => this.openMatchResults(event, item)}>
        <i className="material-icons">list</i>
      </button>

      {isUserStreamerAndCreator && <button className={style.match_button} onClick={(event) => this.editMatchInit(event, item)}>
        <i className="material-icons">info</i>
      </button>
      }
    </div>;
  };

  renderMatchInfoRow = ({ className, itemClass, textClass, item }) => {
    const currentUserParticipant = this.state.fantasyTournament && find(this.state.fantasyTournament.users, item => item.user._id === this.state.currentUser._id);
    const champions = (currentUserParticipant && currentUserParticipant.players) || [];
    const isPlayerChoosedByUser = find(champions, { _id: item.playerId }) ? true : false;

    const rules = this.state.fantasyTournament.rules;

    const killsScore = item.results[0].score === 0 ? 0 : <span className={style.score_block}>{item.results[0].score} <span className={style.rule_color}>x{rules[0].score}</span></span>;
    const deathScore = item.results[1].score === 0 ? 0 : <span className={style.score_block}>{item.results[1].score} <span className={style.rule_color}>x{rules[1].score}</span></span>;
    const assistsScore = item.results[2].score === 0 ? 0 : <span className={style.score_block}>{item.results[2].score} <span className={style.rule_color}>x{rules[2].score}</span></span>;

    return <div key={uuid()} className={cx(className, style.row_dark, { [style.row_choosed]: isPlayerChoosedByUser })}>
      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.player.width }}>
        <span className={textClass}>{item.playerName}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.kill.width }}>
        <span className={cx(textClass, { [style.grey_scores]: item.results[0].score === 0 })}>{killsScore}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.death.width }}>
        <span className={cx(textClass, { [style.grey_scores]: item.results[1].score === 0 })}>{deathScore}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchInfoTableCaptions.assists.width }}>
        <span className={cx(textClass, { [style.grey_scores]: item.results[2].score === 0 })}>{assistsScore}</span>
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
    const joinButtonAction = !currentUserParticipant && !this.state.currentUser ? this.toggleSignInDialog : this.toggleChampionModal;
    const isFinalizeButtonShown = this.state.fantasyTournament && !this.state.fantasyTournament.winner && this.state.fantasyTournament.creator.isStreamer && this.state.currentUser && this.state.currentUser._id === this.state.fantasyTournament.creator._id;
    // const isJoinButtonShown = !currentUserParticipant && !winner && moment().isBefore(firstMatchDate);
    const tournamentChampions = this.state.fantasyTournament && this.state.fantasyTournament.tournament.champions;
    const rules = this.getRulesNames();
    const topTen = this.state.users.slice(0, 9);
    const countUsers = this.state.users.length;
    const summonerName = this.state.username;
    const summonerArr = topTen.filter(item => item.user.username === summonerName);
    const renderSummonerArr = summonerArr ? '' : summonerArr;
    const matchInfo = this.state.matchInfo && this.state.matchInfo;
    const isStreamer = this.state.fantasyTournament && this.state.fantasyTournament.creator.isStreamer;
    const isMatchesUncompleted = every(this.state.matches, { completed: true });

    return <div className={style.tournament}>
      <div className={style.tournament_section}>
        <div className={style.main}>
          <h2 className={style.title}>{fantasyTournamentName}</h2>

          <div className={style.info}>
            <span>{tournamentDate}</span>

            <span className={style.creator_info}>
              {i18n.t('created_by')}
              <Link to={`/user/${tournamentCreatorLink}`}>
                {tournamentCreator}
              </Link>
              {isStreamer && <i title="Streamer" className="material-icons">star</i>}
            </span>

            {status && <div className={style.status}>{status}</div>}
          </div>

          <span className={style.fantasy_status}>{tournamentStatus}</span>
        </div>

        <div>
          {isJoinButtonShown &&
            <Button
              text={i18n.t('join_tournament')}
              appearance="_basic-accent"
              onClick={joinButtonAction}
              className={cx(style.button)}
            />
          }
        </div>
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
          <div className={style.matches_title}>
            <h3 className={style.subtitle}>{i18n.t('matches')}</h3>
            {isFinalizeButtonShown &&
              <Button
                text={i18n.t('finalize_tournament')}
                appearance="_basic-accent"
                onClick={this.finalizeStreamerTournament}
                className={cx(style.button)}
              />
            }
          </div>

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
          <h3 className={style.subtitle}>{isMatchesUncompleted ? i18n.t('leaderboard') : 'Invite a friend'}</h3>
          {!isMatchesUncompleted && <div className={cx(style.info_users, { [style.anim_teemo]: this.state.animate })}>

            <div className={style.copy_block}>
              <input
                id="copyUrl"
                className={style.input_href}
                defaultValue={window.location.href} />
              <button
                className={style.copy_button}
                onClick={this.copyInput}
              >
                <i className="material-icons">file_copy</i>
              </button>
            </div>
            <p>Users: {countUsers}</p>
          </div>}
          {isMatchesUncompleted && <Table
            noCaptions
            captions={leadersTableCaptions}
            items={topTen}
            renderRow={this.renderLeaderRow}
            isLoading={this.state.isLoading}
            defaultSorting={this.leadersDefaultSorting}
            className={style.table}
            emptyMessage="There is no participants yet"
          />}
          {renderSummonerArr && isMatchesUncompleted && <Table
            noCaptions
            items={summonerArr}
            renderRow={this.renderSummonerLeaderRow}
            isLoading={this.state.isLoading}
            className={style.table}
          />}
        </div>
      </div>

      {this.state.isLoading &&
        <Preloader
          isFullScreen={true}
        />
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

      {this.state.isSignInDialogShown && <DialogWindow
          text={i18n.t('unauthenticated_tournament_join')}
          onClose={this.toggleSignInDialog}
          onSubmit={this.redirectToLogin}
        />
      }

      {this.state.isChooseChampionModalShown &&
        <ChooseChampionModal
          champions={tournamentChampions}
          onClose={this.toggleChampionModal}
          action={this.addPlayers}
        />
      }

      {this.state.isMatchEditModalShown &&
        <MatchModal
          matchId={this.state.editingMatchId}
          closeMatchEditing={this.closeMatchEditing}
          matchChampions={tournamentChampions}
          onMatchUpdated={this.loadTournamentData}
        />
      }
    </div>;
  }
}

export default Tournament;
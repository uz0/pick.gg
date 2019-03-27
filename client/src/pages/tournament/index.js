import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Button from 'components/button';
import ChooseChampionModal from 'components/choose-champion';
import Preloader from 'components/preloader';
import Table from 'components/table';

import UserService from 'services/userService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import moment from 'moment';
import find from 'lodash/find';
import { ReactComponent as TrophyIcon } from 'assets/trophy.svg';
import classnames from 'classnames/bind';
import i18n from 'i18n';

import style from './style.module.css';

const cx = classnames.bind(style);

const leadersTableCaptions = {
  position: {
    text: i18n.t('position'),
    width: 50,
  },

  name: {
    text: i18n.t('name'),
    width: 190,
  },

  points: {
    text: i18n.t('points'),
    width: 300,
  },
};

const matchesTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 300,
  },

  points: {
    text: i18n.t('points'),
    width: 100,
  },

  date: {
    text: i18n.t('date'),
    width: 100,
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
    isLoading: true,
    isChooseChampionModalShown: false,
  };

  async componentDidMount() {
    const { user } = await this.userService.getMyProfile();

    this.setState({
      currentUser: user,
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

    const tournamentDate = this.state.fantasyTournament.tournament.date;

    if (moment().isSame(moment(tournamentDate), 'h')) {
      return i18n.t('is_going_on');
    }

    if (moment(tournamentDate).isBefore(moment())) {
      return i18n.t('archive');
    }

    if (moment(tournamentDate).isAfter(moment())) {
      return i18n.t('will_be_soon');
    }
  }

  getFantasyTournamentStatus = () => {
    const currentUserParticipant = this.state.fantasyTournament && find(this.state.fantasyTournament.users, item => item.user._id === this.state.currentUser._id);
    const champions = (currentUserParticipant && currentUserParticipant.players) || [];
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

    const userPlayersIds = userPlayers.map(player => player._id);

    const match = find(fantasyTournament.tournament.matches, { _id: matchId });
    const results = match.results.playersResults;

    const userPlayersWithResults = results.filter(item => userPlayersIds.includes(item.player_id) ? item : false);
    const userPlayersResults = userPlayersWithResults.reduce((arr, item) => {
      arr.push(...item.results)
      return arr;
    }, []);

    const userPlayersResultsSum = userPlayersResults.reduce((sum, item) => {
      sum += item.score * ruleSet[item.rule];
      return sum;
    }, 0);

    return userPlayersResultsSum;
  };

  getTotalUserScore = (fantasyTournament, userId) => {
    const userMatchResults = fantasyTournament.tournament.matches.map(match => this.getCountMatchPoints(fantasyTournament, match._id, userId));
    const totalUserScore = userMatchResults.reduce((sum, score) => sum += score);

    return totalUserScore;
  };

  getUserPlayers = (fantasyTournament, userId) => {
    const user = find(fantasyTournament.users, (item) => item.user._id === userId);

    return user.players;
  };

  getUserPlayerScore = (fantasyTournament, playerId) => {
    const ruleSet = this.getRulesSet(fantasyTournament);
    const tournamentMatches = fantasyTournament.tournament.matches;
    const playerResults = tournamentMatches.map(item => item.results.playersResults.filter(item => item.player_id === playerId).map(item => item.results));

    const aggregatedPlayerResults = playerResults.reduce((arr, item) => {
      arr.push(...item[0]);
      return arr;
    }, []);

    const aggregatedPlayerResultsSum = aggregatedPlayerResults.reduce((sum, item) => {
      sum += item.score * ruleSet[item.rule];
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
    set[item.rule._id] = item.score;
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
    await this.tournamentService.participateInTournament(this.tournamentId, ids);
    await this.loadTournamentData();
    this.toggleChampionModal();
    this.notificationService.show(i18n.t('youve_been_registered_for_the_tournament'));
  };

  renderLeaderRow = ({ className, itemClass, textClass, index, item }) => {
    const { fantasyTournament } = this.state;

    const totalScore = this.getTotalUserScore(fantasyTournament, item.user._id);
    const progressPercents = this.getCalcUserProgress(fantasyTournament, item.user._id);

    return <div className={className} key={item.user._id}>
      <div className={cx('leader_num_cell', itemClass)} style={{ '--width': leadersTableCaptions.position.width }}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={cx('leader_name_cell', itemClass)} style={{ '--width': leadersTableCaptions.name.width }}>
        <span className={textClass}>{item.user.username}</span>
      </div>

      <div className={itemClass} style={{ '--width': leadersTableCaptions.points.width }}>
        <div className={style.leader_progress} style={{ '--width': progressPercents }}>{totalScore}</div>
      </div>
    </div>;
  };

  renderMatchRow = ({ className, itemClass, textClass, index, item }) => {
    const { fantasyTournament } = this.state;
    const currentUserParticipant = this.state.fantasyTournament && find(this.state.fantasyTournament.users, item => item.user._id === this.state.currentUser._id);

    const time = moment(item.startDate).format('HH:mm');
    const points = currentUserParticipant && this.getCountMatchPoints(fantasyTournament, item._id, this.state.currentUser._id);
    const url = '';
    const disableUrl = url === '';
    const urlMatch = url === '' ? '' : url;

    return <NavLink to={urlMatch} target="_blank" className={cx(className, { "disable_url": disableUrl })} key={item.id}>
      <div className={itemClass} style={{ '--width': matchesTableCaptions.name.width }}>
        <span className={textClass}>{`${i18n.t('match')} ${index + 1}`}</span>
      </div>

      <div className={itemClass} style={{ '--width': matchesTableCaptions.points.width }}>
        {points &&
          <div className={style.match_points}>+{points}</div>
        }
      </div>

      <div className={itemClass} style={{ '--width': matchesTableCaptions.date.width }}>
        <span className={textClass}>{time}</span>
      </div>
    </NavLink>;
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
    const isJoinButtonShown = !currentUserParticipant && !winner;
    const tournamentChampions = this.state.fantasyTournament && this.state.fantasyTournament.tournament.champions;
    const rules = this.getRulesNames();

    console.log(currentUserParticipant);

    return <div className={style.tournament}>
      <div className={style.tournament_section}>
        <div className={style.main}>
          <h2 className={style.title}>{fantasyTournamentName}</h2>

          <div className={style.info}>
            <span>{tournamentDate}</span>

            <span>
              {i18n.t('created_by')}
              <NavLink to={`/user/${tournamentCreatorLink}`}> {tournamentCreator}</NavLink>
            </span>

            <div className={style.status}>{status}</div>
          </div>

          <span className={style.fantasy_status}>{tournamentStatus}</span>
        </div>

        {isJoinButtonShown &&
          <Button
            text={i18n.t('join_tournament')}
            appearance="_basic-accent"
            className={style.button}
            onClick={this.toggleChampionModal}
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
          <p className={style.value}>{tournamentName}</p>
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
              <img src={champion.photo} alt={i18n.t('champion_avatar')} />
            </div>

            <span className={style.name}>{champion.name}</span>
            <span className={style.scores}>Scores: +{champion.championScore}</span>
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
            items={this.state.users}
            renderRow={this.renderLeaderRow}
            isLoading={this.state.isLoading}
            defaultSorting={this.leadersDefaultSorting}
            className={style.table}
            emptyMessage="There is no participants yet"
          />
        </div>
      </div>

      {this.state.isLoading &&
        <Preloader />
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
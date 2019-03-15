import React, { Component } from 'react';

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
import defaultAvatar from 'assets/placeholder.png';
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
    isLoading: false,
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
    const { tournament } = await this.tournamentService.getTournamentById(this.tournamentId);

    const realTournament = tournament.tournament;
    const users = tournament.users;
    const matches = realTournament.matches;

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

  getTournamentPrize = () => this.state.fantasyTournament.users.length * this.state.fantasyTournament.entry;

  getCountMatchPoints = matchId => {
    console.log(matchId);
    return 800;
  };

  getTotalUserScore = userId => {
    console.log(userId);
    return 3423;
  };

  getCalcUserProgress = userId => {
    console.log(userId);
    return 70;
  };

  leadersDefaultSorting = (prev, next) => {
    console.log(prev);
    console.log(next);
  };

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
    const totalScore = this.getTotalUserScore(item.user._id);
    const progressPercents = this.getCalcUserProgress(item.user._id);

    return <div className={className} key={item.user._id}>
      <div className={cx('leader_num_cell', itemClass)} style={{'--width': leadersTableCaptions.position.width}}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={cx('leader_name_cell', itemClass)} style={{'--width': leadersTableCaptions.name.width}}>
        <span className={textClass}>{item.user.username}</span>
      </div>

      <div className={itemClass} style={{'--width': leadersTableCaptions.points.width}}>
        <div className={style.leader_progress} style={{'--width': progressPercents}}>{totalScore}</div>
      </div>
    </div>;
  };

  renderMatchRow = ({ className, itemClass, textClass, index, item }) => {
    const time = moment(item.startDate).format('HH:mm');
    const points = this.getCountMatchPoints(item.id);

    return <div className={className} key={item.id}>
      <div className={itemClass} style={{'--width': matchesTableCaptions.name.width}}>
        <span className={textClass}>{`${i18n.t('match')} ${index + 1}`}</span>
      </div>

      <div className={itemClass} style={{'--width': matchesTableCaptions.points.width}}>
        <div className={style.match_points}>+{points}</div>
      </div>

      <div className={itemClass} style={{'--width': matchesTableCaptions.date.width}}>
        <span className={textClass}>{time}</span>
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
    const status = this.getTournamentStatus();
    const winner = this.state.fantasyTournament && this.state.fantasyTournament.winner;
    const isJoinButtonShown = !currentUserParticipant && !winner;
    const tournamentChampions = this.state.fantasyTournament && this.state.fantasyTournament.tournament.champions;
    const rules = this.getRulesNames();

    return <div className={style.tournament}>
      <div className={style.tournament_section}>
        <div className={style.main}>
          <h2 className={style.title}>{fantasyTournamentName}</h2>

          <div className={style.info}>
            <span>{tournamentDate}</span>
            <span>{i18n.t('created_by')} {tournamentCreator}</span>
            <div className={style.status}>{status}</div>
          </div>
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
              <img src={defaultAvatar} alt={i18n.t('champion_avatar')}/>
            </div>

            <span className={style.name}>{champion.name}</span>
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

// class App extends Component {
//   constructor() {
//     super();
//     this.AuthService = new AuthService();
//     this.UserService = new UserService();
//     this.TournamentService = new TournamentService();
//     this.TransactionService = new TransactionService({
//       onUpdate: () => this.updateProfile(),
//     });
//     this.NotificationService = new NotificationService();
//     this.ChampionService = new ChampionService();
//     this.tournamentId = window.location.pathname.split('/')[2];
//     this.state = {
//       champions: [],
//       fantasyTournament: {
//         users: [],
//       },
//       leaders: [],
//       matches: [],
//       tournamentPrizePool: 0,
//       choosedChampions: [],
//       chooseChamp: false,
//       loader: true,
//       winner: null,
//       allMatchesArefinished: false,
//     };
//   }

//   preloader = () =>
//     this.setState({
//       loader: false,
//     })

//   updateProfile = async () => {
//     let profile = await this.UserService.getMyProfile();
//     this.setState({ profile });
//   }

//   showChoose = () => {
//     if (this.state.choosedChampions.length === 0) {
//       this.setState({
//         chooseChamp: true,
//       });
//     }
//     else {
//       this.NotificationService.show("Players already selected");
//     }
//   }

//   closeChoose = () => {
//     this.setState({
//       chooseChamp: false,
//     });
//   }

//   closeModalChoose = () => {
//     this.setState({
//       modalChoose: false,
//       chooseChamp: false,
//     });
//   }

//   chooseChampion = (champion) =>
//     this.setState({
//       choosedChampions: [...this.state.choosedChampions, champion],
//     })

//   setChoosedChampions = async (champions) => {
//     const ids = map(champions, champion => champion.id);
//     await this.TournamentService.participateInTournament(this.tournamentId, [...ids]);

//     // let tournament = await this.TournamentService.getTournamentById(this.tournamentId);
//     this.updateData()

//     this.NotificationService.show("You've been registered for the tournament")
//   }

//   calcWidth = item => {
//     const logs = this.state.leaders.map(item => item.totalScore);
//     const maxPoint = Math.max.apply(Math, logs);
//     return (item / maxPoint) * 100;
//   }

//   statusGame = (tournamentDate) => {
//     if (moment().isSame(moment(tournamentDate), 'h')) {
//       return "Is going on";
//     }
//     if (moment(tournamentDate).isBefore(moment())) {
//       return "Archive";
//     }
//     if (moment(tournamentDate).isAfter(moment())) {
//       return "Will be soon";
//     }
//   }

//   countUserScoreById = (userId, fantasyTournament, realTournament) => {
//     const user = fantasyTournament.users.filter(item => item.user._id === userId)[0];
//     const userPlayers = user.players.map(item => item.id);
//     const rules = fantasyTournament.rules.reduce((obj, rule) => {
//       obj[rule.rule._id] = rule.score
//       return obj;
//     }, {});

//     let usersResults = [];

//     realTournament.matches.forEach(item => {
//       const userPlayersResults = item.results.playersResults.filter(item => userPlayers.includes(item.playerId));
//       const playersMatchScore = userPlayersResults.map(item => {
//         return item.results.reduce((acc, item) => {
//           return acc + item.score * rules[item.rule]
//         }, 0)
//       })
//       const totalMatchScore = playersMatchScore.reduce((acc, item) => acc + item);

//       usersResults.push({
//         userId,
//         totalMatchScore,
//       });
//     });

//     return usersResults;
//   }

//   countLeadersTotalScore = (fantasyTournament, scores) => {
//     return fantasyTournament.users
//     .map(item => item.user)
//     .map(item => {
//       item.totalScore = scores
//         .filter(element => element.userId === item._id)
//         .reduce((acc, item) => {
//           return acc + item.totalMatchScore;
//         }, 0);
//       return item;
//     })
//     .sort((a, b) => b.totalScore - a.totalScore);
//   }

//   updateData = async() => {

//     const { tournament } = await this.TournamentService.getTournamentById(this.tournamentId);
//     const { userId } = this.state;

//     const fantasyTournament = tournament;
//     const realTournament = tournament.tournament;

//     const isUserRegistered = fantasyTournament.users.map(item => item.user._id).includes(userId);
//     const userPlayers = fantasyTournament.users.filter(item => item.user._id === userId)[0];
    
//     const tournamentPrizePool = fantasyTournament.entry * fantasyTournament.users.length;
//     let matches = realTournament.matches;
//     let usersResults = [];

//     fantasyTournament.users.forEach(user => {
//       return usersResults.push(...this.countUserScoreById(user.user._id, fantasyTournament, realTournament));
//     });

//     const leaders = this.countLeadersTotalScore(fantasyTournament, usersResults);

//     // map current users results to the matches
//     const currentUserResults = usersResults.filter(item => item.userId === userId);

//     if (currentUserResults.length > 0) {
//       matches.forEach((match, index) => {
//         match.currentUserScore = currentUserResults[index].totalMatchScore;
//       });
//     }

//     this.setState({
//       ...this.state,
//       matches,
//       realTournament,
//       fantasyTournament,
//       tournamentPrizePool,
//       choosedChampions: isUserRegistered ? userPlayers.players : [],
//       leaders: tournament.users.length > 0 ? leaders : [],
//       chooseChamp: false,
//     })

//   }

//   async componentDidMount() {
//     //server queries
//     const { tournament } = await this.TournamentService.getTournamentById(this.tournamentId);
//     const userId = await this.AuthService.getProfile()._id;

//     //tournaments aliases
//     const fantasyTournament = tournament;
//     const realTournament = tournament.tournament;
    
//     const isUserRegistered = fantasyTournament.users.map(item => item.user._id).includes(userId);
//     const isUserTournamentCreator = fantasyTournament.creator._id === userId;
//     const userPlayers = fantasyTournament.users.filter(item => item.user._id === userId)[0];

//     const champions = realTournament.champions;
//     const tournamentPrizePool = fantasyTournament.entry * fantasyTournament.users.length;

//     let matches = realTournament.matches;
//     let usersResults = [];

//     fantasyTournament.users.forEach(user => {
//       return usersResults.push(...this.countUserScoreById(user.user._id, fantasyTournament, realTournament));
//     });

//     const leaders = this.countLeadersTotalScore(fantasyTournament, usersResults);

//     // map current users results to the matches
//     const currentUserResults = usersResults.filter(item => item.userId === userId);

//     if (currentUserResults.length > 0) {
//       matches.forEach((match, index) => {
//         match.currentUserScore = currentUserResults[index].totalMatchScore;
//       });
//     }

//     this.setState({
//       userId,
//       matches,
//       champions,
//       realTournament,
//       fantasyTournament,
//       tournamentPrizePool,
//       winner: fantasyTournament.winner,
//       choosedChampions: isUserRegistered ? userPlayers.players : [],
//       leaders: tournament.users.length > 0 ? leaders : [],
//       chooseChamp: isUserTournamentCreator && !isUserRegistered ? true : false,
//     }, () => this.preloader());
//   }

//   render() {

//     let {
//       userId,
//       winner,
//       leaders,
//       matches,
//       champions,
//       fantasyTournament,
//       realTournament,
//       tournamentDate,
//       choosedChampions,
//       tournamentPrizePool,
//       allMatchesArefinished,
//     } = this.state;

//     const isUserRegistered = fantasyTournament.users.map(item => item.user._id).includes(userId);
//     const tournamentWinnings = leaders.length > 0 ? tournamentPrizePool : fantasyTournament.entry;

//     // eslint-disable-next-line no-unused-vars
//     const isFreeTournament = entry => entry === 0 ? 'Free' : `$${entry}`;
//     const isMatchFinished = (match) => moment().isAfter(match.endDate);
//     const isMatchGoingOn = (match) => moment().isBetween(moment(match.startDate), moment(match.endDate));
//     const tournamentDateFormat = moment(tournamentDate).format('MMM DD');

//     return (
//       <div className={style.home_page}>
//         {this.state.loader && <Preloader />}

//         <div className={style.tournament_content}>

//           <div className={style.tournament_header}>
//             <div>
//               <h2>{fantasyTournament.name}</h2>
//               <div className={style.tournament_info}>
//                 <p>{tournamentDateFormat}</p>
//                 <p>{isFreeTournament(fantasyTournament.entry)}</p>
//               </div>
//             </div>

//             <div>
//               <div className={style.statusGames}>
//                 Status: {this.statusGame(tournamentDate)}
//               </div>
//               <div className={style.statusGames}>
//                 {`Winner will get: $${tournamentPrizePool}`}
//               </div>
//             </div>
//           </div>

//           {winner && <div className={style.tournament_winner}>
//             <TrophyIcon />
//             {`Tournament is over! Winner is ${winner.username}. He got $${tournamentPrizePool} prize!`}
//           </div>}

//           {this.state.chooseChamp && <ChooseChamp
//             champions={champions}
//             tournamentEntry={fantasyTournament.entry}
//             closeChoose={this.closeChoose}
//             closeModalChoose={this.closeModalChoose}
//             setChoosedChampions={this.setChoosedChampions}
//           />}

//           {!winner && champions && champions.length > 0 && <div className={style.team_block}>
//             <h3>Team</h3>
//             <div className={style.tournament_team}>
//               {[0, 1, 2, 3, 4].map(index => <Fragment>
//                 {index < choosedChampions.length && <ChampionCard
//                   key={uuid()}
//                   className={cx(style.no_active, style.item_mobile)}
//                   name={choosedChampions[index].name}
//                   avatar={choosedChampions[index].photo}
//                 />}
//                 {index >= choosedChampions.length && <ChooseChampionCard
//                   key={uuid()}
//                   onClick={this.showChoose}
//                 />}
//               </Fragment>)}
//             </div>
//           </div>}

//           <div className={style.tournament_bottom}>
//             <div className={style.tournament_matches}>
//               <h3>Matches</h3>

//               {matches.length === 0 ? <p className={style.status_matches}>{"Matches will appear soon"}</p> : matches.map((item, index) => (
//                 <NavLink
//                   to="/"
//                   target="_blank"
//                   className={cx(
//                     // { [style.finished_match]: isMatchFinished(item) },
//                     // { [style.going_on_match]: isMatchGoingOn(item) },
//                   )}
//                   key={item._id}
//                 >
//                   <span className={style.match_title}>{`Match ${index + 1}`}</span>

//                   {isUserRegistered > 0 && item.completed &&
//                     <span className={style.user_score}>+{item.currentUserScore}</span>
//                   }

//                   <span>{moment(item.startDate).format('HH:mm')}</span>
//                 </NavLink>
//               ))}
//             </div>

//             <div className={style.tournament_leader}>
            
//               <div className={style.header_leader}>
//                 <h3>Leaderboard</h3>
//                 {fantasyTournament.users.length > 0 ? <p>{fantasyTournament.users.length} users</p> : ''}
//               </div>

//               <div className={style.table_leader}>

//                 {fantasyTournament.users.length <= 1 && <p className={style.status_leaders}>Waiting for new players</p>}

//                 {fantasyTournament.users.length >= 2 && <div className={style.top_five}>
//                   {leaders.map((item, index) => (
//                     <div key={uuid()} className={style.leader}>
//                       <p className={style.number}>{index + 1}</p>
//                       <p className={style.name_leader}>{item.username}</p>
//                       <div className={style.scale}>
//                         <span style={{ width: `${this.calcWidth(item.totalScore)}%` }}>{item.totalScore}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>}

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default App;

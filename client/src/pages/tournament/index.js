import React, { Component } from 'react';
import style from './tournament.module.css';

import ChooseChamp from '../../components/chooseChampion';
import ChampionCard from '../../components/ChampionCard';
import ChooseChampionCard from '../../components/ChooseChampionCard';
import Preloader from '../../components/preloader';

import AuthService from '../../services/authService';
import UserService from '../../services/userService';
import TournamentService from '../../services/tournamentService';
import NotificationService from '../../services/notificationService';
import ChampionService from '../../services/championService';
import TransactionService from '../../services/transactionService';
import moment from 'moment';
import uuid from 'uuid';
import { ReactComponent as TrophyIcon } from '../../assets/trophy.svg';

import classnames from 'classnames';

const cx = classnames.bind(style);

class App extends Component {
  constructor() {
    super();
    this.AuthService = new AuthService();
    this.UserService = new UserService();
    this.TournamentService = new TournamentService();
    this.TransactionService = new TransactionService({
      onUpdate: () => this.updateProfile(),
    });
    this.NotificationService = new NotificationService();
    this.ChampionService = new ChampionService();
    this.tournamentId = window.location.pathname.split('/')[2];
    this.state = {
      champions: [],
      tournament: {
        users: [],
      },
      leaders: [],
      matches: [],
      tournamentPrizePool: 0,
      choosedChampions: [],
      chooseChamp: false,
      loader: true,
      winner: null,
    };
  }

  preloader = () =>
    this.setState({
      loader: false,
    })

  updateProfile = async() => {
    let profile = await this.UserService.getMyProfile();
    this.setState({ profile });
  }

  showChoose = () =>{
    if (this.state.choosedChampions.length === 0){
      this.setState({
        chooseChamp: true,
      });
    }
    else {
      this.NotificationService.show("Players already selected");
    }
  }
    
  closeChoose = () =>{
    this.setState({
      chooseChamp: false,
    });}

  closeModalChoose = () => {
    this.setState({
      modalChoose: false,
      chooseChamp: false,
    });}

  chooseChampion = (champion) =>
    this.setState({
      choosedChampions: [...this.state.choosedChampions, champion],
    })

  setChoosedChampions = async(champions) => {

    await this.TournamentService.participateInTournament(this.tournamentId, [...champions]);

    let tournament = await this.TournamentService.getTournamentById(this.tournamentId);

    this.setState({
      tournament: tournament.tournament,
      choosedChampions: [...champions],
      chooseChamp: false,
    }, () => this.NotificationService.show("You've been registered for the tournament"));
    
  }
    
  calcWidth = item => {
    const logs = this.state.leaders.map(item => item.totalScore);
    const maxPoint = Math.max.apply(Math, logs);
    return (item / maxPoint) * 100;
  }

  statusGame = (tournamentDate) => {
    if (moment().isSame(moment(tournamentDate)), 'day'){
      return "Is going on";
    }
    else if (moment(tournamentDate).isBefore(moment())){
      return "Archive";
    } else {
      return "Will be soon";
    }
  }

  async componentDidMount(){

    const tournament = await this.TournamentService.getTournamentById(this.tournamentId);
    const userId = await this.AuthService.getProfile()._id;

    const champions = tournament.tournament.tournament.champions;

    const isUserRegistered = tournament.tournament.users.map(item => item.user._id).includes(userId);
    const userPlayers = tournament.tournament.users.filter(item => item.user._id === userId)[0];
    const tournamentPrizePool = tournament.tournament.entry * tournament.tournament.users.length;

    const isTournamentGoingToday = moment(tournament.tournament.tournament.date).isSame(moment(), 'day') ? true : false;
    const tournamentDate = tournament.tournament.tournament.date;

    const leaders = tournament.tournament.users.map(item => item.user);
    // eslint-disable-next-line no-unused-vars
    let sortedLeaders;

    const matches = tournament.tournament.tournament.matches.sort((a,b) => new Date(a.startDate) - new Date(b.endDate));
    const finishedMatches = matches.filter(item => item.completed === true);

    let usersResults = [];
    let rules = {};

    // if(tournament.tournament.users.length > 0){
    
    // normalize fantasy tournament rules
    tournament.tournament.rules.forEach(item => {
      if (item.rule){
        rules[item.rule.name] = item.score;
      }
    });
      
    // count users results in each match
    function countUserResultsById(userId) {

      const userChampions = tournament.tournament.users.filter(item => item.user._id === userId)[0];

      matches.forEach(item => {

        if(!item.completed){
          return false;
        }

        let totalScore = 0;

        const choosedPlayers = userChampions.players.map(item => item.name);
        const results = item.results.playersResults.filter(item => choosedPlayers.includes(item.name));

        const resultsScore = results.reduce((acc, item) => {
          let sum = 0;
          for (let rule in item){
            if (rule !== 'name'){
              sum += item[rule] * rules[rule];
            }
          }
          return acc + sum;
        }, 0);
    
        totalScore = resultsScore;

        usersResults.push({
          userId,
          item,
          totalScore,
        });
  
      });

    }

    tournament.tournament.users.forEach(user => {
      return countUserResultsById(user.user._id);
    });


    // map leaders to their results
    sortedLeaders = tournament.tournament.users
      .map(item => item.user)
      .map(item => {
        item.totalScore = usersResults
          .filter(element => element.userId === item._id)
          .reduce((acc, item) => {
            return acc + item.totalScore;
          }, 0);
        return item;
      })
      .sort((a,b) => b.totalScore - a.totalScore);

    // map current users results to the matches
    const currentUserResults = usersResults.filter(item => item.userId === userId);
    if (currentUserResults.length > 0){
      matches.forEach((match, index) => {
        if(match.completed){
          match.currentUserScore = currentUserResults[index].totalScore;
        }
      });
    }

    this.setState({
      userId,
      matches,
      champions,
      tournament: tournament.tournament,
      choosedChampions: isUserRegistered ? userPlayers.players : [],
      leaders: tournament.tournament.users.length > 0 ? sortedLeaders : leaders,
      tournamentPrizePool,
      isTournamentGoingToday,
      tournamentDate,
      winner: tournament.tournament.winner,
    });
    this.preloader();
  }

  render() {

    let {
      userId,
      winner,
      leaders,
      matches,
      champions,
      tournament,
      tournamentDate,
      choosedChampions,
      isTournamentGoingToday,
    } = this.state;

    const isUserRegistered = this.state.tournament.users.map(item => item.user._id).includes(userId);
    const tournamentWinner = leaders[0] ? leaders[0].username : '';
    // eslint-disable-next-line no-unused-vars
    const isTeamShown = isUserRegistered ? true : isTournamentGoingToday ? false : true;

    let ChampionsCardsList = () => {
      let cards = [];
      for (let i = 0; i < 5; i++){
        i < choosedChampions.length
          ? cards.push(<ChampionCard className={style.no_active} key={uuid()} name={choosedChampions[i].name} />)
          : cards.push(<ChooseChampionCard key={uuid()} onClick={this.showChoose} />);
      }
      return cards;
    };
    
    const isMatchFinished = (match) => moment().isAfter(match.endDate);
    const isMatchGoingOn = (match) => moment().isBetween(moment(match.startDate), moment(match.endDate));

    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />

        {this.state.loader && <Preloader />}

        <div className={style.tournament_content}>
        
          <div className={style.tournament_header}>
            <div>
              <h2>{tournament.name}</h2>
              <div className={style.tournament_info}>
                <p>{moment(tournamentDate).format('MMM DD')}</p>
                <p>$ {tournament.entry}</p>
              </div>
            </div>
            <div>
              <div>
                Status: {this.statusGame(tournamentDate)}
              </div>
              <div>
                {`Winner will get: ${this.state.tournamentPrizePool} $`}
              </div>
            </div>
          </div>

          {winner && <div className={style.tournament_winner}>
            <TrophyIcon />
            {`Tournament is over! Winner is ${tournamentWinner}. He got $${this.state.tournamentPrizePool} prize!`}
          </div>}

          {this.state.chooseChamp && <ChooseChamp
            champions={champions}
            tournamentEntry={tournament.entry}
            closeChoose={this.closeChoose}
            closeModalChoose={this.closeModalChoose}
            setChoosedChampions={this.setChoosedChampions}
          />}
          {/* {isTeamShown && <div className={style.team_block}> */}
          <div className={style.team_block}>
            <h3>Team</h3>
            <div className={style.tournament_team}>
              <ChampionsCardsList />
            </div>
          </div>
          <div className={style.tournament_bottom}>
            <div className={style.tournament_matches}>
              <h3>Matches</h3>
              {matches.map((item,index) => (
                <div className={cx(
                  {[style.finished_match]: isMatchFinished(item)},
                  {[style.going_on_match]: isMatchGoingOn(item)},
                )} key={item._id}>
                  <span className={style.match_title}>{`Match ${index + 1}`}</span>
                  {isUserRegistered > 0 && item.completed && <span className={style.user_score}>{item.currentUserScore}</span>}
                  <span>{moment(item.startDate).format('HH:mm')} – {moment(item.endDate).format('HH:mm')}</span>
                </div>
              ))}
            </div>
            <div className={style.tournament_leader}>
              <div className={style.header_leader}>
                <h3>Leaderboard</h3>
                <p>{tournament.users.length} users</p>
              </div>
              <div className={style.table_leader}>
                <div className={style.top_five}>
                  {this.state.leaders.map((item, index) => (
                    <div key={uuid()} className={style.leader}>
                      <p className={style.number}>{index + 1}</p>
                      <p className={style.name_leader}>{item.username}</p>
                      <div className={style.scale}>
                        <span style={{ width: `${this.calcWidth(item.totalScore)}%` }}>{item.totalScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

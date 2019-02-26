import React, { Component } from 'react'
import style from './tournament.module.css'
import ChooseChamp from '../../components/chooseChampion'

import ChampionCard from '../../components/ChampionCard'
import ChooseChampionCard from '../../components/ChooseChampionCard'

import AuthService from '../../services/authService'
import UserService from '../../services/userService'
import TournamentService from '../../services/tournamentService'
import NotificationService from '../../services/notificationService'
import http from '../../services/httpService'
import moment from 'moment'
import uuid from 'uuid'

class App extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.UserService = new UserService()
    this.TournamentService = new TournamentService()
    this.NotificationService = new NotificationService()
    this.tournamentId = window.location.pathname.split('/')[2];
    this.state = {
      champions: [],
      tournament: {
        users: [],
      },
      leaders: [],
      matches: [],
      earnings: 0,
      choosedChampions: [],
      chooseChamp: false,
    }
  }

  showChoose = () =>{
    let tournamentDate = moment(this.state.tournament.date).format("MMM DD")
    let today = moment(Date.now()).format("MMM DD")
    if(moment(tournamentDate).isBefore(today)){
      this.NotificationService.show("Tournament " + this.state.tournament.name + " end")
    } else if(this.state.choosedChampions.length === 0){
      this.setState({
        chooseChamp: true,
      })
    }
    else {
      this.NotificationService.show("Players already selected")
    }
  }
    
  chooseChampion = (champion) =>
    this.setState({
      choosedChampions: [...this.state.choosedChampions, champion],
    })

  closeChoose = () =>
    this.setState({
      chooseChamp: false,
    })
  
  setChoosedChampions = async(champions) => {
    await this.TournamentService.participateInTournament(this.tournamentId, [...champions])
    let tournament = await this.TournamentService.getTournamentById(this.tournamentId);
    this.setState({
      tournament: tournament.tournament,
      choosedChampions: [...champions],
      chooseChamp: false,
    }, () => this.NotificationService.show("You've been registered for the tournament"))
  }
    
  calcWidth = item => {
    const logs = this.state.leaders.map(item => item.points)
    const maxPoint = Math.max.apply(Math, logs)
    return (item / maxPoint) * 100
  }

  statusGame = () => {
    let dateNow = moment(Date.now()).format('MMM DD')
    let tournamentDate = moment(this.state.tournament.date).format('MMM DD')
    if(moment(tournamentDate).isBefore(dateNow)){
      return "Archive"
    }
    else if(moment(dateNow).isSame(tournamentDate)){
      return "Pendings"
    }
    else{
      return "Is going on"
    }
  }
  
  async componentDidMount(){

    let championsQuery = await http('/api/players');
    let champions = await championsQuery.json();

    let tournament = await this.TournamentService.getTournamentById(this.tournamentId);
    let leaders = tournament.tournament.users;
    let sortedLeaders;
    
    let user = await this.UserService.getMyProfile();
    let userId = await this.AuthService.getProfile()._id;

    let isUserRegistered = tournament.tournament.users.map(item => item.user._id).includes(userId);
    let userPlayers = tournament.tournament.users.filter(item => item.user._id === userId)[0];

    let earnings = tournament.tournament.entry * tournament.tournament.users.length;

    let rules = {};
    let matches = tournament.tournament.matches;
    let usersResults = [];

    if(tournament.tournament.users.length > 0){

      tournament.tournament.rules.forEach(item => {
        if(item.rule){
          rules[item.rule.name] = item.score;
        }
      })
      
      // count users results in each match
      function countUserResultsById(userId) {
        matches.forEach(item => {
          if(userPlayers){
            let totalScore = 0;

            let choosedPlayers = userPlayers.players.map(item => item.name);
            let results = item.results.playersResults.filter(item => choosedPlayers.includes(item.name));
      
            let resultsScore = results.reduce((acc, item) => {
              let sum = 0;
              for(let rule in item){
                if(rule !== 'name'){
                  sum += item[rule] * rules[rule]
                }
              }
              return acc + sum;
            }, 0)
      
            totalScore = resultsScore
  
            usersResults.push({
              userId,
              item,
              totalScore,
            })
  
          }
        });
      }

      tournament.tournament.users.forEach(user => {
        return countUserResultsById(user.user._id)
      })
    }

    // map leaders to their results
    sortedLeaders = tournament.tournament.users
      .map(item => item.user)
      .map(item => {
        item.totalScore = usersResults
          .filter(element => element.userId === item._id)
          .reduce((acc, item) => {
            return acc + item.totalScore;
          }, 0)
        return item;
      })
      .sort((a,b) => a-b)
    
    // map current users results to the matches
    let currentUserResults = usersResults.filter(item => item.userId === userId);
    if(currentUserResults.length > 0){
      matches.forEach((match, index) => {
        match.currentUserScore = currentUserResults[index].totalScore;
      })
    }

    this.setState({
      tournament: tournament.tournament,
      choosedChampions: isUserRegistered ? userPlayers.players : [],
      champions: champions.players,
      user: user.user,
      matches: tournament.tournament.matches,
      leaders: tournament.tournament.users.length > 0 ? sortedLeaders : leaders,
      earnings,
    });

  }

  render() {

    let { tournament, champions, choosedChampions, user, matches } = this.state;

    let ChampionsCardsList = () => {
      let cards = [];
      for(let i = 0; i < 5; i++){
        i < choosedChampions.length
          ? cards.push(<ChampionCard key={uuid()} name={choosedChampions[i].name} />)
          : cards.push(<ChooseChampionCard key={uuid()} onClick={this.showChoose} />)
      }
      return cards;
    }

    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <div className={style.tournament_content}>
          <div className={style.tournament_header}>
            <div>
              <h2>{tournament.name}</h2>
              <div className={style.tournament_info}>
                <p>{moment(tournament.date).format('MMM DD')}</p>
                <p>$ {tournament.entry}</p>
              </div>
            </div>
            <div>
              <div>
              Status: {this.statusGame()}
              </div>
              <div>
                {`Winner will get: ${this.state.earnings} $`}
              </div>
            </div>
          </div>
          {this.state.chooseChamp && <ChooseChamp
            champions={champions}
            userBalance={user.balance}
            tournamentEntry={tournament.entry}
            closeChoose={this.closeChoose}
            setChoosedChampions={this.setChoosedChampions}
          />}
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
                <p key={item._id}>
                  <span className={style.match_title}>{`Match ${index + 1}`}</span>
                  {this.state.leaders.length > 0 && <span className={style.user_score}>{item.currentUserScore}</span>}
                  <span>{moment(item.date).format('DD-MM-YYYY')}</span>
                </p>
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
    )
  }
}

export default App

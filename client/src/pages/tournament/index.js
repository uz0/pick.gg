import React, { Component } from 'react'
import style from './tournament.module.css'
import ChooseChamp from '../../components/chooseChampion'

import ChampionCard from '../../components/ChampionCard'
import ChooseChampionCard from '../../components/ChooseChampionCard'

import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import http from '../../services/httpService'
import moment from 'moment'
import uuid from 'uuid'

const matchesItems = [{ id: '1', time: '10:30', nameMatch: 'First Match' }, { id: '2', time: '12:40', nameMatch: 'Second Match' }, { id: '3', time: '15:00', nameMatch: 'Third Match' }, { id: '4', time: '18:20', nameMatch: 'Fourth Match' }, { id: '5', time: '20:00', nameMatch: 'Final Grand Match' }]
const leaders = [{ number: '1', name: 'DiscoBoy', points: 376 }, { number: '2', name: 'JonhWick', points: 323 }, { number: '3', name: 'Terminator', points: 290 }, { number: '4', name: 'MIB', points: 254 }, { number: '5', name: 'Wolverine', points: 206 }]

class App extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.TournamentService = new TournamentService()
    this.state = {
      champions: [],
      tournament: {},
      choosedChampions: [],
      chooseChamp: false,
    }
  }

  showChoose = () =>
    this.setState({
      chooseChamp: true,
    })
  
  chooseChampion = (champion) =>
    this.setState({
      choosedChampions: [...this.state.choosedChampions, champion],
    })

  closeChoose = () =>
    this.setState({
      chooseChamp: false,
    })

  setChoosedChampions = (champions) => {
    this.setState({
      choosedChampions: [...champions],
      chooseChamp: false,
    })  
  }
    
  calcWidth = item => {
    const logs = leaders.map(item => item.points)
    const maxPoint = Math.max.apply(Math, logs)
    return (item / maxPoint) * 100
  }

  async componentDidMount(){

    let championsQuery = await http('http://localhost:3000/api/players');
    let champions = await championsQuery.json();

    let tournamentId = window.location.pathname.split('/')[2];
    let tournament = await this.TournamentService.getTournamentById(tournamentId);

    this.setState({
      tournament: tournament.tournament,
      champions: champions.players,
    });

  }

  render() {

    let { tournament, champions, choosedChampions } = this.state;

    let ChampionsCardsList = () => {
      let cards = [];
      for(let i = 0; i < 5; i++){
        i < choosedChampions.length
          ? cards.push(<ChampionCard key={uuid()} champion={choosedChampions[i]} />)
          : cards.push(<ChooseChampionCard key={uuid()} onClick={this.showChoose} />)
      }
      return cards;
    }

    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <div className={style.tournament_content}>
          <div className={style.tournament_header}>
            <h2>{tournament.name}</h2>
            <div className={style.tournament_info}>
              <p>{moment(tournament.date).format('MMM DD')}</p>
              <p>$ {tournament.entry}</p>
            </div>
          </div>
          {this.state.chooseChamp && <ChooseChamp
            champions={champions}
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
              {matchesItems.map(item => (
                <p key={item.id}>
                  <span>{item.time}</span>
                  {item.nameMatch}
                </p>
              ))}
            </div>
            <div className={style.tournament_leader}>
              <div className={style.header_leader}>
                <h3>Leaderboard</h3>
                <p>2019 users</p>
              </div>
              <div className={style.table_leader}>
                <div className={style.top_five}>
                  {leaders.map(item => (
                    <div key={item.number} className={style.leader}>
                      <p className={style.number}>{item.number}</p>
                      <p className={style.name_leader}>{item.name}</p>
                      <div className={style.scale}>
                        <span style={{ width: `${this.calcWidth(item.points)}%` }}>{item.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={style.my_number}>
                  <p className={style.number}>211</p>
                  <p className={style.name_leader}>Me</p>
                  <div className={style.scale}>
                    <span style={{ width: `${(19 / 376) * 100}%` }}>19</span>
                  </div>
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

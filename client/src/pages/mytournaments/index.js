import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import style from './mytournaments.module.css'

class App extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.TournamentService = new TournamentService()
    this.state = {
      tournaments: [],
      zeroTournaments: true
    }
  }

  async componentDidMount() {
    let tournaments = await this.TournamentService.getMyTournaments()

    this.setState({
      tournaments: tournaments.tournaments,
    })
    this.zeroTournaments = () => {
      if (tournaments.tournaments.length !== 0) {
        this.setState({
          zeroTournaments: false
        })
      }
    }
  }

  render() {
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <div className={style.main_block}>
          <h2>My Tournaments</h2>
          <div className={style.tournaments_block}>
            {!this.state.zeroTournaments && <div className={style.zero_info}>This user has not yet participated in tournaments</div>}
            {console.log(this.state.tournaments)}
            {!this.state.zeroTournaments && <div className={style.header_tournaments}>
              <p>Tournament Name</p>
              <p>End Date</p>
              <p>Users</p>
              <p>Entry</p>
            </div>}

            {this.state.tournaments.map(item => (
              <NavLink key={item._id} to={`/tournaments/${item._id}`}>
                <div className={style.card_tournament}>
                  <p>{item.name}</p>
                  <p>{moment(item.date).format('MMM DD')}</p>
                  <p>{item.users.length}</p>
                  <p>$ {item.entry}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default App

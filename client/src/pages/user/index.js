import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import UserService from '../../services/userService'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import ProfileSidebar from '../../components/ProfileSidebar'
import style from './style.module.css'

class User extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.UserService = new UserService()
    this.TournamentService = new TournamentService()
    this.state = {
      tournaments: [],
      userData: {},
    }
  }

  async componentDidMount(){

    let tournaments = await this.TournamentService.getAllTournaments()
    let user = await this.UserService.getUserDataById(this.props.match.params.id)

    this.setState({
      tournaments: tournaments.tournaments,
      userData: user.user,
    })

  }

  render() {

    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main>
          <div className={style.content}>
            <ProfileSidebar
              withData={true}
              nickname={this.state.userData.username}
              description={this.state.userData.about} />
            <div className={style.user_statistics}>
              <div>
                <h2>Scores</h2>
                <div className={style.statistics_masonry}>
                  <div className={style.item}>
                    <div className={style.value}>678</div>
                    <div className={style.key}>tournaments</div>      
                  </div>
                  <div className={style.item}>
                    <div className={style.value}>$ 12.357</div>
                    <div className={style.key}>earned</div>      
                  </div>  
                  <div className={style.item}>
                    <div className={style.value}>21 <span>of 1290</span></div>
                    <div className={style.key}>place</div>
                  </div>   
                </div>
              </div>
              <div>
                <h2>Recent tournaments</h2>
                <div className={style.tournaments_block}>
                  <div className={style.header_tournaments}>
                    <p>Tournament Name</p>
                    <p>End Date</p>
                    <p>Users</p>
                    <p>Entry</p>
                  </div>
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
          </div>
        </main>
      </div>
    )
  }
}

export default User

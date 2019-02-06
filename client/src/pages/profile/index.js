import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import style from './profile.module.css'

class Profile extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.TournamentService = new TournamentService(); 
    this.state = {}
  }

  render() {
    return (
      <div className={style.home_page}>
        <aside>
          
        </aside>
      </div>
    )
  }
}

export default Profile

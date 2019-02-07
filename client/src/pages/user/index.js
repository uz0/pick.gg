import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import Button from '../../components/button'
import ProfileSidebar from '../../components/ProfileSidebar'
import style from './style.module.css'

class User extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.TournamentService = new TournamentService()
    this.state = {}
  }

  handleChange = () => {}

  render() {
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main>
          <div className={style.content}>
            <ProfileSidebar withData={true} nickname={"Bennett Foddy"} description={"Hello, my name is Bennet Foddy and I like to play videogames. Also I want to gather a dream team and participate in CSGO tournaments!"} />
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
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default User

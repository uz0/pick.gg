import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import Button from '../../components/button'
import ProfileSidebar from '../../components/ProfileSidebar'
import style from './profile.module.css'

class Profile extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.TournamentService = new TournamentService(); 
    this.state = {
      nick: "",
      email: "",
      about: "",
    }
  }

  handleChange = () => {}

  render() {
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main>
          <h1>Profile settings – Bennett Foddy</h1>
          <div className={style.content}>
            <ProfileSidebar withData={false} />
            <div className={style.form_container}>
              <form className={style.form}>
                <div>
                  <label>Nickname</label>
                  <input type="text" name="nickname" onChange={this.handleChange}  />
                </div>
                <div>
                  <label>Email</label>
                  <input type="text" name="email" onChange={this.handleChange}  />
                </div>
                <div>
                  <label>About</label>
                  <textarea></textarea>
                </div>
                <Button appearance={'_basic-accent'} text={'Save changes'} />
              </form>
              <div className={style.password_recovery}>
                <p>You can also change your password if needed</p>
                <a href="/">Change password</a>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default Profile
import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import UserService from '../../services/userService'
import Button from '../../components/button'
import ProfileSidebar from '../../components/ProfileSidebar'
import style from './profile.module.css'

class Profile extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.UserService = new UserService()
    this.TournamentService = new TournamentService(); 
    this.state = {
      username: "",
      email: "",
      about: "",

    }
  }

  handleChange = () => {}

  async componentDidMount(){
    let username = await this.UserService.getMyProfile()
    
    this.setState({ username: username.user })


  }
  
  render() {
    console.log(this.state.username)
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
                  <label>Username</label>
                  <input type="text" name="username" disabled value={this.state.username.username} />
                  
                </div>
                <div>
                  <label>Email</label>
                  <input type="text" name="email" value={this.state.username.email} onChange={this.handleChange}  />
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
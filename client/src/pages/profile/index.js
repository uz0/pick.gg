import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import UserService from '../../services/userService'
import http from '../../services/httpService'
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
      formValues: {}

    }
  }

 
  onChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  handleChange = (event) => {
    event.preventDefault();
    let formValues = this.state.formValues;
    let name = event.target.name;
    let value = event.target.value;

    formValues[name] = value;

    this.setState({formValues})
  }


  async componentDidMount(){
    let username = await this.UserService.getMyProfile()
    this.setState({ username: username.user })
  }
  
  handleSubmit = async e => {
    e.preventDefault()

    let { email, about } = this.state.formValues

    await http('/api/users/me', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        about
      }),
    })
  }
  
  render() {
    
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main>
          <h1>Profile settings – {this.state.username.username}</h1>
          <div className={style.content}>
            <ProfileSidebar withData={false} />
            <div className={style.form_container}>
              <form className={style.form} onSubmit={this.handleSubmit}>
                <div>
                  <label>Username</label>
                  <input type="text" name="username" disabled value={this.state.username.username} />
                  {console.log(this.state.username)}
                </div>
                <div>
                  <label>Email</label>
                  <input type="text" name="email" value={this.state.value} placeholder={this.state.username.email} onChange={this.handleChange}  />
                </div>
                <div>
                  <label>About</label>
                  <textarea name="about" placeholder={this.state.username.about} value={this.state.value} onChange={this.handleChange}></textarea>
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
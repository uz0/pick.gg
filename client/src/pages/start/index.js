import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import style from './style.module.css'
import AuthService from '../../services/authService'

class Start extends Component {
  constructor() {
    super()
    this.auth = new AuthService()

    this.state = {
      username: '',
      password: '',
    }
  }

  handleChange = e => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  handleLogin = async e => {
    e.preventDefault()
    let success = await this.auth.login(this.state.username, this.state.password)
    if (success) this.props.history.replace('/')
  }

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/')
  }

  render() {

    let startButtonLink = localStorage.getItem('JWS_TOKEN') ? "/tournaments" : "/login";

    return (
      <div className={style.login_page}>
        <div className={style.bg_wrap} />
        <div className={style.start_content}>
          <h1>Fantasy league</h1>
          <div className={style.start_btns}>
            <NavLink to={startButtonLink}>
              <button>Start</button>
            </NavLink>
            <div>
              <span>or </span>
              <NavLink to="/register">register</NavLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Start

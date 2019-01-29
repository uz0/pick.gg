import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import style from '../../components/style.module.css'
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
    return (
      <div className={style.loginPage}>
        <div className={style.bgWrap} />
        <div className={style.startContent}>
          <h1>Fantasy league</h1>
          <div className={style.startBtns}>
            <NavLink to="/login">
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

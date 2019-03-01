import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import AuthService from '../../services/authService'

import Input from '../../components/input'
import Button from '../../components/button'
import style from '../../components/style.module.css'

class Login extends Component {
  constructor() {
    super()

    this.auth = new AuthService()

    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.state = {
      username: '',
      password: '',
    }
  }

  handleChange(e) {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  handleLogin = async e => {
    e.preventDefault()
    let success = await this.auth.login(this.state.username, this.state.password)
    if (success) this.props.history.replace('/tournaments')
    
  }

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/')
    
  }

  render() {
    return (
      <div className={style.login_page}>
        <div className={style.bg_wrap} />

        <div className={style.form_block}>
          <div className={style.info_block}>Login</div>

          <form onSubmit={this.handleLogin}>
            <Input id="username" label="Email" name="username" placeholder="login" type="text" autofocus={true} value={this.state.username} action={this.handleChange} />
            <Input id="password" label="Password" name="password" placeholder="password" type="password" value={this.state.password} action={this.handleChange} />
            <div className={style.login_btn}>
              <Button appearance={'_basic-accent'} type={'submit'} text={'Login'} />
              <div className={style.bottom_login_btn}>
                <span>or </span>
                <NavLink to="/register">register</NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login

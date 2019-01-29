import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import '../../components/style.module.css'
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
    if (success) this.props.history.replace('/')
  }

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/')
  }

  render() {
    return (
      <div className={style.loginPage}>
        <div className={style.bgWrap} />
        <div className={style.formBlock}>
          <div className={style.infoBlock}>
            Please <br /> login <br /> in the <br />
            system
          </div>
          <form onSubmit={this.handleLogin}>
            <Input id="username" label="Email" name="username" placeholder="login" type="text" autofocus={true} value={this.state.username} action={this.handleChange} />
            <Input id="password" label="Password" name="password" placeholder="password" type="password" value={this.state.password} action={this.handleChange} />
            <div>
              <Button
                appearance={'_basic-accent'}
                type={'submit'}
                text={'Login'}
              />
              <div>
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

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/authService'
import Input from '../../components/input'
import Button from '../../components/button'
import style from '../../components/style.module.css'

class Register extends Component {
  constructor() {
    super()
    this.auth = new AuthService()
    this.state = {
      username: '',
      password: '',
    }
  }

  // handleChange(e) {
  // 	e.preventDefault()
  // 	this.setState({ [e.target.name]: e.target.value })
  // }

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
            Please
            <br /> register <br /> in the <br />
            system
          </div>
          <form onSubmit={this.handleLogin}>
            <Input id="username" label="Login" name="username" placeholder="" type="text" autofocus={true} value={this.state.username} action={this.handleChange} />
            <Input id="password" label="Password" name="password" placeholder="" type="password" value={this.state.password} action={this.handleChange} />
            <Input id="password" label="Password" name="password" placeholder="" type="password" value={this.state.password} action={this.handleChange} />
            <div className={style.loginBtn}>
              <Button type={'submit'} text={'Login'} />
              <div>
                <span>or </span>
                <NavLink to="/login">login</NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Register

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/authService'
import AuthWrapper from '../authWrapper'
import Button from '../button/index'
import style from './topMenu.module.css'

class TopMenuComponent extends Component {
  constructor() {
    super()
    this.Auth = new AuthService()
    this.state = {
      profile: null,
    }
  }

  handleLogout = () => {
    this.Auth.logout()
    this.props.history.replace('/login')
  }

  componentDidMount() {
    let profile = this.Auth.getProfile()
    this.setState({ profile: profile })
  }

  render() {
    return (
      <div className={style.topMenu}>
        <div className={style.menuWrap}>
          <NavLink to="/">
            <h2>Pick.gg</h2>
          </NavLink>
          <div className={style.userInfo}>
            <Button
              appearance={'_basic-primary'}
              text={'Logout'}
              onClick={this.handleLogout}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default AuthWrapper(TopMenuComponent)

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/authService'
import AuthWrapper from '../authWrapper'
import Button from '../button/index'
import DropDown from '../DropDown'
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
    this.props.history.replace('/')
  }

  componentDidMount() {
    let profile = this.Auth.getProfile()
    this.setState({ profile: profile })
  }

  render() {
    return (
      <div className={style.top_menu}>
        <div className={style.menu_wrap}>
          <NavLink to="/">
            <h2>Pick.gg</h2>
          </NavLink>
          {/* <NavLink to="/profile">
            <Button appearance={'_basic-primary'} text={'User profile'} />
          </NavLink> */}
          <div className={style.user_info}>
            {/* <Button appearance={'_basic-primary'} text={'Logout'} onClick={this.handleLogout} /> */}
            <DropDown />
          </div>
        </div>
      </div>
    )
  }
}

export default AuthWrapper(TopMenuComponent)

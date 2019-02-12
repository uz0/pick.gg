import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/authService'
import AuthWrapper from '../authWrapper'
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
    console.log(this.props)
    return (
      <div className={style.top_menu}>
        <div className={style.menu_wrap}>
          <div className={style.links}>
            <NavLink to="/">
              <h2>Pick.gg</h2>
            </NavLink>
            <NavLink to="/rating">Rating</NavLink>
          </div>
          <DropDown user={this.props.user}/>
        </div>
      </div>
    )
  }
}

export default AuthWrapper(TopMenuComponent)

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './TopMenu.css'
import AuthService from '../../services/authService'
import AuthWrapper from '../authWrapper'

class TopMenuComponent extends Component {
  constructor() {
    super()
    this.Auth = new AuthService()
    this.state = {
      profile: null,
    }
  }

  handleLogout() {
    this.Auth.logout()
    this.props.history.replace('/login')
  }

  componentDidMount() {
    let profile = this.Auth.getProfile()
    this.setState({ profile: profile })
  }

  render() {
    return (
      <div className="top-menu-component">
        <div className="menuWrap">
          <NavLink to="/">
            <h2>Pick.gg</h2>
          </NavLink>
          <div className="user-info-wrapper">
            <button onClick={this.handleLogout.bind(this)}>Logout</button>
          </div>
        </div>
      </div>
    )
  }
}

export default AuthWrapper(TopMenuComponent)

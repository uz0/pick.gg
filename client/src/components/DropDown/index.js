import React from 'react'
import style from './style.module.css'
import AuthService from '../../services/authService'
import { NavLink } from 'react-router-dom'
import { ReactComponent as AddPlayerIcon } from '../../assets/add-player.svg'

class DropDown extends Component {

  constructor(){
    super()
    this.Auth = new AuthService()
    this.state = {
      isActive: false,
    }
  }

  handleLogout = e => {
    e.preventDefault()
    this.Auth.logout()
    this.props.history.replace('/')
  }

  render() {
    return (
      <div>
        <div className={style.user}>
          <img src="" alt="userpic"/>
          Random User
        </div>
        <div className={style.menu}>
          <NavLink to="/profile">My tournaments</NavLink>
          <NavLink to="/profile">Public profile</NavLink>
          <NavLink to="/profile">Profile settings</NavLink>
          <a href="#" onClick={this.handleLogout}>Log out</a>
        </div>
      </div>
    )
  }

}

export default DropDown;

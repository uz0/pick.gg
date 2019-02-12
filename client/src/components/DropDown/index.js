import React, { Component } from 'react'
import classnames from 'classnames/bind'
import AuthService from '../../services/authService'
import { NavLink } from 'react-router-dom'
import { ReactComponent as AvatarPlaceholder } from '../../assets/avatar-placeholder.svg'
import style from './style.module.css'

const cx = classnames.bind(style);

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

  componentDidMount() {
    window.addEventListener('click', event => {
      if(this.state.isActive && event.target !== this.userbox){
        this.toggleDropDown()
      }
    });
  }

  toggleDropDown = () => this.setState({ isActive: !this.state.isActive })

  render() {
    let Avatar = () => this.props.avatar ? <img src={this.props.avatar} alt="userpic"/> : <AvatarPlaceholder />;
    return (
      <div className={cx(style.dropdown, { active: this.state.isActive })} onClick={this.toggleDropDown}>
        <div ref={(userbox) => {this.userbox = userbox}} className={style.userbox}>
          <Avatar />
          {this.props.user.username}
        </div>
        <div className={style.menu}>
          <NavLink to="/tournaments">My tournaments</NavLink>
          <NavLink to={`/user/${this.props.user._id}`}>Public profile</NavLink>
          <NavLink to="/profile">Profile settings</NavLink>
          <a href="/" onClick={this.handleLogout}>Log out</a>
        </div>
      </div>
    )
  }

}

export default DropDown;

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/authService'
import UserService from '../../services/userService'
import TransactionService from '../../services/transactionService'
import AuthWrapper from '../authWrapper'
import DropDown from '../DropDown'
import style from './topMenu.module.css'

class TopMenuComponent extends Component {
  constructor() {
    super()
    this.Auth = new AuthService()
    this.UserService = new UserService()
    this.TransactionService = new TransactionService()
    this.state = {
      profile: null,
    }
  }

  handleLogout = () => {
    this.Auth.logout()
    this.props.history.replace('/')
  }

  updateProfile = async() => {
    let profile = await this.UserService.getMyProfile()
    this.setState({ profile: profile })
  }

  deposit = async(e) => {
    e.preventDefault();
    await this.TransactionService.deposit()
    this.updateProfile();
  }
  
  withdraw = async(e) => {
    e.preventDefault();
    await this.TransactionService.withdraw()
    this.updateProfile();
  }
  
  componentDidMount = () => {
    this.updateProfile();
  }

  render() {
    return (
      <div className={style.top_menu}>
        <div className={style.menu_wrap}>
          <div className={style.links}>
            <NavLink to="/">
              <h2>Pick.gg</h2>
            </NavLink>
            <NavLink to="/rating">Rating</NavLink>
          </div>
          <DropDown data={this.state.profile} mode="balance">
            {/* <a href="/" onClick={e => this.handleLogout}>Transactions</a>     */}
            <a href="/" onClick={e => this.deposit(e)}>Deposit</a>
            <a href="/" onClick={e => this.withdraw(e)}>Withdraw</a>
          </DropDown>
          <DropDown data={this.state.profile} mode="userbox">
            <NavLink to="/tournaments">My tournaments</NavLink>
            <NavLink to={`/user/${this.props.user._id}`}>Public profile</NavLink>
            <NavLink to="/profile">Profile settings</NavLink>
            <a href="/" onClick={this.handleLogout}>Log out</a>
          </DropDown>
        </div>
      </div>
    )
  }
}

export default AuthWrapper(TopMenuComponent)

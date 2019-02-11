import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import { NavLink } from 'react-router-dom'
import style from './rating.module.css'

class Rating extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.TournamentService = new TournamentService(); 
    this.state = {
     
    }
  }

  handleChange = () => {}

  render() {
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main>
          <h1>Best Players rankings</h1>
          <div className={style.content}>
            <div className={style.header_table}>
              <div className={style.number_header}>#</div>
              <div className={style.name_header}>Name</div>
            </div>
            <NavLink className={style.item_table} to="/">
              <div>1.</div>
              <div className={style.avatar_table} />
              <div className={style.name_table}>Painkiller</div>
            </NavLink>
            <NavLink className={style.item_table} to="/">
              <div>2.</div>
              <div className={style.avatar_table} />
              <div className={style.name_table}>HighLate</div>
            </NavLink>
          </div>
        </main>
      </div>
    )
  }
}

export default Rating
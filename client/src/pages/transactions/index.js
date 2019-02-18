import React, { Component } from 'react'
import TournamentService from '../../services/tournamentService'
import UserService from '../../services/userService'
// import http from '../../services/httpService'
import style from './style.module.css'

class Transactions extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  componentDidMount(){

  }
  
  render() {
    
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main>
          <h1>Transactions History</h1>
        </main>
      </div>
    )
    
  }

}

export default Transactions
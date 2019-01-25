import React, { Component } from 'react'
import './Tournament.css'
import ChooseChamp from '../../components/chooseChampion'

import AuthService from '../../services/authService'

class App extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.state = {
      newTournament: false,
    }
  }

  render() {
    return (
      <div className="home-page">
        <div className="bg-wrap" />
        <div className="tournamentContent">
          <div className="tournamentHeader">
            <h2>Tournament Name</h2>
            <div className="tournamentInfo">
              <p>Feb 27</p>
              <p>$ 3.97</p>
            </div>
          </div>
          <ChooseChamp />
          <div className="teamBlock">
            <h3>Team</h3>
            <div className="tournamentTeam">
              <div className="item">
                <p>Add Player</p>
              </div>
              <div className="item">
                <p>Add Player</p>
              </div>
              <div className="item">
                <p>Add Player</p>
              </div>
              <div className="item">
                <p>Add Player</p>
              </div>
              <div className="item">
                <p>Add Player</p>
              </div>
            </div>
          </div>
          <div className="tournamentBottom">
            <div className="tournamentMatches">
              <h3>Mathes</h3>
              <p>
                <span>10:30</span> Fisrt Match
              </p>
              <p>
                <span>13:40</span> Second Match
              </p>
              <p>
                <span>17:00</span> Third Match
              </p>
              <p>
                <span>20:00</span> GrandFinal Match
              </p>
            </div>
            <div className="tournamentLeader">
              <div className="headerLeader">
                <h3>Leaderboard</h3>
                <p>2019 users</p>
              </div>
              <div className="tableLeader">
                <div className="topFive">
                  <div className="leader">
                    <p className="number">1</p>
                    <p className="nameLeader">DiscoBoy</p>
                    <span>376</span>
                  </div>
                  <div className="leader">
                    <p className="number">2</p>
                    <p className="nameLeader">JonhWick</p>
                    <span>376</span>
                  </div>
                  <div className="leader">
                    <p className="number">3</p>
                    <p className="nameLeader">Terminator</p>
                    <span>349</span>
                  </div>
                  <div className="leader">
                    <p className="number">4</p>
                    <p className="nameLeader">MenInBlack</p>
                    <span>311</span>
                  </div>
                  <div className="leader">
                    <p className="number">5</p>
                    <p className="nameLeader">Wolverine</p>
                    <span>287</span>
                  </div>
                </div>
                <div className="myNumber">
                  <p className="number">211</p>
                  <p className="nameLeader">Me</p>
                  <span>19</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App

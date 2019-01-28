import React, { Component } from 'react'
import './Home.css'
import Input from '../../components/input'
import NewTournament from '../../components/newTournament'
import { NavLink } from 'react-router-dom'
import arrow from '../../assets/arrow.svg'
import AuthService from '../../services/authService'

const items = [
  { id: '1', title: 'My Crazy League', date: 'Feb 02', users: '2023', entry: '3.97' },
  { id: '2', title: 'Mamkin tiger wanna play', date: 'Feb 02', users: '3052', entry: '10.00' },
  { id: '3', title: 'Only for hardcore fans', date: 'Feb 02', users: '1233', entry: '2.17' },
  { id: '4', title: 'Crazy camp', date: 'Feb 02', users: '1652', entry: '1.00' },
  { id: '5', title: 'Lvl up', date: 'Feb 03', users: '1054', entry: '5.35' },
  { id: '6', title: 'Super win tonight', date: 'Feb 03', users: '2582', entry: '4.70' },
  { id: '7', title: 'Mega HARDDD', date: 'Feb 03', users: '1629', entry: '1.30' },
  { id: '8', title: 'Whats happened? AAAA!', date: 'Feb 03', users: '254', entry: '9.09' },
  { id: '9', title: 'AAAAAAAAAAAAA!!!', date: 'Feb 03', users: '4346', entry: '7.77' },
]

class App extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.state = {
      newTournament: false,
    }
  }
  createTournament = () =>
    this.setState({
      newTournament: true,
    })

  closeTournament = () =>
    this.setState({
      newTournament: false,
    })

  render() {
    return (
      <div className="home-page">
        <div className="bg-wrap" />
        <div className="filters">
          <h2>Tournaments</h2>
          <form>
            <Input label="End date" name="date" type="date" />
            <Input label="Minimal entry" name="entry" placeholder="$ 0.1" type="text" />
          </form>
          <div className="createTournament">
            <p>Not satisfied?</p>
            <button onClick={this.createTournament} type="submit">
              Create a new tournament
            </button>
          </div>
        </div>
        {this.state.newTournament && <NewTournament closeTournament={this.closeTournament} />}
        <div className="tournaments-block">
          <div className="headerTournaments">
            <p>Tournament Name</p>
            <p>End Date</p>
            <p>Users</p>
            <p>Entry</p>
          </div>
          {items.map(item => (
            <NavLink key={item.id} to="/tournament">
              <div className="cardTournament">
                <p>{item.title}</p>
                <p>{item.date}</p>
                <p>{item.users} users</p>
                <p>$ {item.entry}</p>
                <img className="arrowCard" src={arrow} alt="arrow icon" />
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    )
  }
}

export default App

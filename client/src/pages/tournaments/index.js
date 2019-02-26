import React, { Component } from 'react'
import Input from '../../components/input'
import NewTournament from '../../components/newTournament'
import { NavLink } from 'react-router-dom'
import arrow from '../../assets/arrow.svg'
import moment from 'moment'
import AuthService from '../../services/authService'
import UserService from '../../services/userService'
import http from '../../services/httpService'
import TournamentService from '../../services/tournamentService'
import style from './tournaments.module.css'

class App extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.UserService = new UserService()
    this.TournamentService = new TournamentService()
    this.state = {
      newTournament: false,
      tournaments: [],
      rules: [],
      entryFilter: '',
      dateFilter: '',
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

  filterByDate = async e => {
    if (e.target.value === '') {
      let tournaments = await this.TournamentService.getAllTournaments()
      this.setState({
        tournaments: tournaments.tournaments,
        dateFilter: '',
      })
      return
    }

    this.setState(
      {
        dateFilter: e.target.value,
      },
      async () => {
        let filteredTournaments = await this.TournamentService.filterTournamentsByDate(this.state.dateFilter)
        this.setState({ tournaments: filteredTournaments })
      },
    )
  }

  filterByEntry = async e => {
    if (e.target.value <= 0) {
      let tournaments = await this.TournamentService.getAllTournaments()
      this.setState({
        tournaments: tournaments.tournaments,
        entryFilter: '',
      })
      return
    }

    this.setState(
      {
        entryFilter: e.target.value,
      },
      async () => {
        let filteredTournaments = await this.TournamentService.filterTournamentsByEntry(this.state.entryFilter)
        this.setState({ tournaments: filteredTournaments })
      },
    )
  }

  updateTournaments = async() => {
    let tournaments = await this.TournamentService.getAllTournaments()
    let rulesQuery = await http('/api/rules')
    let rules = await rulesQuery.json()
    
    this.setState({
      tournaments: tournaments.tournaments,
      rules: rules.rules,
    })
  }

  async componentDidMount() {
    let tournaments = await this.TournamentService.getAllTournaments()
    let user = await this.UserService.getMyProfile();
    let rulesQuery = await http('/api/rules')
    let rules = await rulesQuery.json()
    
    this.setState({
      tournaments: tournaments.tournaments,
      rules: rules.rules,
      user: user.user
    })
  }

  render() {

    // let {  user } = this.state;

    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <div className={style.filters}>
          <h2>Tournaments</h2>
          <div className={style.block_filters}>
            <form>
              <Input type="date" value={this.state.filterByDate} action={this.filterByDate} label="End date" name="date" min="2019-01-01" max="2020-12-31"/>
              <Input type="number" value={this.state.entryFilter} action={this.filterByEntry} label="Minimal entry" placeholder="$ 0.1" name="entry" min="0" />
            </form>
            <div className={style.create_tournament}>
              <p>Not satisfied?</p>
              <button onClick={this.createTournament} type="submit">
                Create a new tournament
              </button>
            </div>
          </div>
        </div>
        {this.state.newTournament && <NewTournament rules={this.state.rules} user={this.state.user} updateTournaments={this.updateTournaments} closeTournament={this.closeTournament} />}
        <div className={style.tournaments_block}>
          <div className={style.header_tournaments}>
            <p>Tournament Name</p>
            <p>End Date</p>
            <p>Users</p>
            <p>Entry</p>
          </div>
          {this.state.tournaments.map(item => (
            <NavLink key={item._id} to={`/tournaments/${item._id}`}>
              <div className={style.card_tournament}>
                <p>{item.name}</p>
                <p>{moment(item.date).format('MMM DD')}</p>
                <p>{item.users.length}</p>
                <p>$ {item.entry}</p>
                <img className={style.arrow_card} src={arrow} alt="arrow icon" />
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    )
  }
}

export default App

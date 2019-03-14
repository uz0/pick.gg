import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import style from './style.module.css';
import AuthService from '../../services/authService';

import tournamentsList from '../../assets/faq/tournaments_list.png';
import tournamentsFinished from '../../assets/faq/tournament_finished.png';
import championsCards from '../../assets/faq/champions.png';

import classnames from 'classnames';
const cx = classnames.bind(style);

class Start extends Component {
  constructor() {
    super();
    this.auth = new AuthService();

    this.state = {
      username: '',
      password: '',
    };
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin = async event => {
    event.preventDefault();
    let success = await this.auth.login(this.state.username, this.state.password);
    if (success) this.props.history.replace('/');
  }

  componentWillMount() {
    if (this.auth.isLoggedIn()) this.props.history.replace('/');
  }

  render() {
    let startButtonLink = localStorage.getItem('JWS_TOKEN') ? "/tournaments" : "/login";
    return (
      <div className={style.login_page}>

        <section className={style.login_section}>
          <div className={style.start_content}>
            <h1>Fantasy league</h1>
            
            <div className={style.start_btns}>
              <NavLink to={startButtonLink}>
                <button>Start</button>
              </NavLink>
              
              <div>
                <span>or </span>
                <NavLink to="/register">register</NavLink>
              </div>
            </div>
          </div>
        </section>

        <section className={style.guide}>
          <div className={style.step}>
            <div>
              <h2>1. Choose fantasy tournament</h2>
              <p>Choose fantasy tournament you would like to take part in.</p>
            </div>
            <div>
              <img src={tournamentsList} alt="Tournaments list"/>
            </div>
          </div>
          <div className={cx(style.step, style.align_right)}>
            <div>
              <h2>2. Create your dream team</h2>
              <p>Pick 5 players from the players list.</p>
            </div>
            <div>
              <img src={championsCards} alt="User team"/>
            </div>
          </div>
          <div className={style.step}>
            <div>
              <h2>3. Win money</h2>
              <p>Pick 5 players from the players list.</p>
            </div>
            <div>
              <img src={tournamentsFinished} alt="Tournament result"/>
            </div>
          </div>
        </section>

      </div>
    );
  }
}

export default Start;

import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';

import Input from '../input';
import Select from '../select';
import Button from '../button';
import Modal from '../../components/modal';
import Preloader from '../../components/preloader';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';

import http from '../../services/httpService';
import NotificationService from '../../services/notificationService';
import TournamentService from '../../services/tournamentService';
import UserService from '../../services/userService';

import style from './style.module.css';
import i18n from 'i18n'

class newTournament extends Component {
  constructor() {
    super();
    this.notificationService = new NotificationService();
    this.tournamentService = new TournamentService();
    this.userService = new UserService();

    this.rules = [];
    this.realTournaments = [];
  }

  async componentDidMount() {
    const { tournaments } = await this.tournamentService.getRealTournaments();
    const { rules } = await http('/api/rules').then(res => res.json());
    const { user } = await this.userService.getMyProfile();

    const tournamentsSortedByDate = tournaments.sort((a, b) => new Date(b.date) - new Date(a.date));
    const filteredTournaments = tournamentsSortedByDate.filter(tournament => tournament.champions_ids.length > 0);

    this.setState({
      filteredTournaments,
      rules,
      user,
    });
  }

  state = {
    rulesValues: {},
    rules: [],
    filteredTournaments: [],
    modalChoose: false,
  }

  showModal = () => {
    this.setState({
      modalChoose: true,
    });
  }

  closeModalChoose = () => this.setState({ modalChoose: false })

  onRulesInputChange = event => {
    let formattedInputValue = parseInt(event.target.value, 10);
    let value = 0;

    if (formattedInputValue <= 10 && formattedInputValue >= 0) {
      value = formattedInputValue;
    } else if (formattedInputValue >= 10) {
      value = 10;
    } else if (formattedInputValue <= 0) {
      value = 0;
    }

    this.setState({
      rulesValues: {
        ...this.state.rulesValues,
        [event.target.name]: value,
      },
    });
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleChange = (event, input) => this.setState({ [input]: event.target.value });

  submitForm = async () => {
    let { name, entry, rulesValues, tournament } = this.state;

    let tournamentId = '';

    if (name === undefined){
      this.notificationService.show(`Name is empty`);
      return;
    }

    if (entry === undefined){
      this.notificationService.show(`Entry is empty`);

      return;
    }
    
    if (this.state.user.balance < entry) {
      this.notificationService.show(`Insufficient funds ${entry - this.state.user.balance}$`);

      return;
    }

    if (tournament){
      tournamentId = this.state.filteredTournaments.find(item => item.name === tournament).id;
    } else {
      this.notificationService.show('Please, select tournament and try again');
      return false;
    }
    
    let normalizedRules = Object.keys(rulesValues).map(item => ({
      rule: item,
      score: rulesValues[item],
    }));

    const { newTournament } = await http('/api/tournaments', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        entry,
        rules: [...normalizedRules],
        tournamentId,
      }),
    }).then(res => res.json());

    this.notificationService.show(`You've created tournament ${name}`);
    this.props.history.push(`/tournaments/${newTournament._id}`);
  }

  render() {
    let { onClose } = this.props;
    const areTournamentsLoaded = this.state.filteredTournaments.length > 0 ? true : false;

    return (
      <div className={style.wrap}>

        <div className={style.new_tournament}>

          <div className={style.create_block}>
            <p>{i18n.t('create_new_tournament')}</p>
          </div>

          {this.state.modalChoose && <Modal
            textModal={'Do you really want to create a tournament?'}
            closeModal={this.closeModalChoose}
            submitClick={this.submitForm}
          />
          }

          <form onSubmit={(event) => { event.preventDefault(); this.showModal(); }}>

            {!areTournamentsLoaded && <Preloader />}

            <Button
              className={style.close_button}
              appearance={'_icon-transparent'}
              icon={<CloseIcon />}
              onClick={onClose}
            />

            <div>
              <div className={style.top_block}>
                <Input
                  label={i18n.t('tournaments_name')}
                  value={this.state.name}
                  onInput={(event) => this.handleChange(event, 'name')}
                />

                <Select
                  action={this.onChange}
                  name="tournament"
                  values={this.state.filteredTournaments}
                  option={item => `${moment(item.date).format("DD MMM YYYY")} - ${item.name}`}
                  label={i18n.t('tournament_list')}
                />

                <Input
                  label={i18n.t('entry')}
                  value={this.state.entry}
                  onInput={(event) => this.handleChange(event, 'entry')}
                />
              </div>
              
              <p>Rules</p>
              
              <div className={style.rules_inputs}>
                {this.state.rules.map(item =>
                  <div className={style.input_rules} key={item._id}>
                    <input
                      name={item._id}
                      onChange={this.onRulesInputChange}
                      value={this.state.rulesValues[item._id] || ''}
                      key={item._id}
                      type="number"
                      required
                      min="-10"
                      max="10"
                    />
                    <label>{item.name}</label>
                  </div>)}
              </div>
              
              <div className={style.bottom_btn}>
                <Button
                  appearance={'_basic-accent'}
                  type={'submit'}
                  text={'Create'}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(newTournament);

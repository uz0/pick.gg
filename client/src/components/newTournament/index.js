import React, { Component } from 'react';
import moment from 'moment';

import Input from '../input';
import Select from '../select';
import Button from '../button';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import style from './newTournament.module.css';

import http from '../../services/httpService';
import NotificationService from '../../services/notificationService';
import TournamentService from '../../services/tournamentService';
import UserService from '../../services/userService';

import Modal from '../../components/modal';

class newTournament extends Component {
  constructor() {
    super();
    this.NotificationService = new NotificationService();
    this.TournamentService = new TournamentService();
    this.UserService = new UserService();

    this.rules = [];
    this.realTournaments = [];
  }

  async componentDidMount() {
    const { tournaments } = await this.TournamentService.getRealTournaments();
    const { rules } = await http('/api/rules').then(res => res.json());
    const { user } = await this.UserService.getMyProfile();

    this.setState({
      tournaments,
      rules,
      user,
    });
  }

  state = {
    rulesValues: {},
    rules: [],
    tournaments: [],
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

  submitForm = async () => {
    let { name, entry, rulesValues, tournament } = this.state;

    let tournamentId = '';
    if (name === undefined){
      this.NotificationService.show(`Name is empty`);

      return;
    }

    if (entry === undefined){
      this.NotificationService.show(`Entry is empty`);

      return;
    }
    
    if (this.state.user.balance < entry) {
      this.NotificationService.show(`Insufficient funds ${entry - this.state.user.balance}$`);

      return;
    }

    if (tournament){
      tournamentId = this.state.tournaments.find(item => item.name === tournament)._id;
    } else {
      this.NotificationService.show('Please, select tournament and try again');
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

    this.NotificationService.show(`You've created tournament ${name}`);
    this.props.history.push(`/tournaments/${newTournament._id}`);
  }

  render() {
    let { onClose } = this.props;

    return (
      <div className={style.wrap}>
        <div className={style.new_tournament}>

          <div className={style.create_block}>
            <p>Create a new tournament</p>
          </div>

          {this.state.modalChoose && <Modal
            textModal={'Do you really want to create a tournament?'}
            closeModal={this.closeModalChoose}
            submitClick={this.submitForm}
          />
          }

          <form onSubmit={(event) => { event.preventDefault(); this.showModal(); }}>
            <Button
              className={style.close_button}
              appearance={'_icon-transparent'}
              icon={<CloseIcon />}
              onClick={onClose}
            />

            <div>
              <div className={style.top_block}>
                <Input
                  action={this.onChange}
                  label="Name"
                  name="name"
                  type="text"
                />

                <Select
                  action={this.onChange}
                  name="tournament"
                  values={this.state.tournaments}
                  option={item => `${moment(item.date).format("DD MMM")} - ${item.name}`}
                  label="Tournament (from list)"
                />

                <Input
                  action={this.onChange}
                  label="Entry $"
                  name="entry"
                  type="text"
                />
              </div>
              
              <p>Rules</p>
              
              <div className={style.rules_inputs}>
                {this.state.rules.map(item =>
                  <div className={style.input_rules}>
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

export default newTournament;

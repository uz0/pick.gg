import React, { Component } from 'react';
import Input from '../input';
import Select from '../select';
import Button from '../button';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import style from './newTournament.module.css';
import http from '../../services/httpService';
import NotificationService from '../../services/notificationService';
import Modal from '../../components/modal';

class newTournament extends Component {
  constructor() {
    super();
    this.NotificationService = new NotificationService();
    this.state = {
      rules: {},
      modalChoose: false,
    };
  }

  showModal = () => {
    this.setState({
      modalChoose: true,
    });
  }

  closeModalChoose = () => this.setState({modalChoose: false})

  onRulesInputChange = e => {
    let formattedInputValue = parseInt(e.target.value, 10);
    let value = 0;

    if (formattedInputValue <= 10 && formattedInputValue >= 0) {
      value = formattedInputValue;
    } else if (formattedInputValue >= 10) {
      value = 10;
    } else if (formattedInputValue <= 0) {
      value = 0;
    }

    this.setState({
      rules: {
        ...this.state.rules,
        [e.target.name]: value,
      },
    });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  submitForm = async e => {
    e.preventDefault();

    let { name, entry, rules, tournament } = this.state;
    let tournamentId = '';
    if (name === undefined){
      this.NotificationService.show(`Name is empty`);
    }
    if (entry === undefined){
      this.NotificationService.show(`Entry is empty`);
    }
    
    if (this.props.user.balance < entry) {
      this.NotificationService.show(`Insufficient funds ${entry - this.props.user.balance}$`);
    }
    if (entry < this.props.user.balance){
      this.NotificationService.show(`You've created tournament ${name}`);
      this.props.closeTournament();
      this.props.updateTournaments();
    }
    if (tournament){
      tournamentId = this.props.tournamentsData.filter(item => item.name === tournament)[0]._id;
    } else {
      this.NotificationService.show('Please, select tournament and try again');
      return false;
    }
    
    let normalizedRules = Object.keys(rules).map(item => {
      return {
        rule: item,
        score: rules[item],
      };
    });
    
    this.showModal()
    await http('/api/tournaments', {
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
    });
  }

  render() {

    let { closeTournament, rules, tournamentsData } = this.props;

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
            />}

          <form onSubmit={this.submitForm}>
            <Button className={style.close_button} appearance={'_icon-transparent'} icon={<CloseIcon />} onClick={closeTournament} />

            <div>
              <div className={style.top_block}>
                <Input action={this.onChange} label="Name" name="name" type="text" />
                <Select action={this.onChange} name="tournament" tournamentsData={tournamentsData} label="Tournament (from list)" />
                <Input action={this.onChange} label="Entry $" name="entry" type="text" />
              </div>
              
              <p>Rules</p>
              
              <div className={style.rules_inputs}>{rules && rules.map(item => <input name={item._id} onChange={this.onRulesInputChange} value={this.state.rules[item._id] || ''} key={item._id} placeholder={item.name} type="number" min="-10" max="10" />)}</div>
              
              <div className={style.bottom_btn}>
                <Button appearance={'_basic-accent'} type={'submit'} text={'Create'} />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default newTournament;

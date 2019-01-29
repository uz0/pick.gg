import React, { Component } from 'react'
import Input from '../input'
import Select from '../select'
import Button from '../button'
import { ReactComponent as CloseIcon } from '../../assets/close.svg'
import style from './newTournament.module.css'
import http from '../../services/httpService'

class newTournament extends Component {

  constructor(){
    super();
    this.state = {
      rules: {}
    }
  }

  onRulesInputChange = (e) => {
    
    let formattedInputValue = parseInt(e.target.value);
    let value = 0;

    if(formattedInputValue <= 10 && formattedInputValue >= -10){
      value = formattedInputValue;
    } else if (formattedInputValue >= 10) {
      value = 10;
    } else if (formattedInputValue <= -10) {
      value = -10;
    }

    this.setState({
      rules: {
        ...this.state.rules,
        [e.target.name]: value
      }
    });

  }
  
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  submitForm = async (e) => {
    
    e.preventDefault();

    let { name, entry, rules } = this.state;

    let normalizedRules = Object.keys(rules).map(item => {
      return {
        rule: item,
        score: rules[item]
      }
    });

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
        tournamentId: 1,
      }),
    });

  }

  render(){
    let { closeTournament, rules } = this.props;
    
    return (
      <div className={style.wrap}>
        <div className="fade" />
        <div className={style.newTournament}>
          <div className={style.createBlock}>
            <p>
              Create a new tournament
            </p>
          </div>
          <form onSubmit={this.submitForm}>
            <Button
              appearance={'_icon-transparent'}
              icon={<CloseIcon />}
              onClick={closeTournament}
            />
            <div>
              <div className={style.topBlock}>
                <Input action={this.onChange} label="Name" name="name" type="text" />
                <Select label="Tournament (from list)" option="Tournament Name" />
                <Input action={this.onChange} label="Entry $" name="entry" type="text" />
              </div>
              <p>Rules</p>
              <div className={style.rulesInputs}>
                {rules && rules.map(item => (
                  <input name={item._id} onChange={this.onRulesInputChange} value={this.state.rules[item._id] || ''} key={item._id} placeholder={item.name} type="number" min="-10" max="10" />
                ))}
              </div>
              <div className={style.bottomBtn}>
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
    )
  }
}

export default newTournament;

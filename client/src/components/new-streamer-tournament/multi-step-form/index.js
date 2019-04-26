import React, { Component } from 'react';

import Button from '../../button';

import GeneralStep from '../general';
import PlayersStep from '../players';
import MatchesStep from '../matches';

import NotificationService from 'services/notificationService';

import classnames from 'classnames';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

class MultiStepForm extends Component {
  constructor() {
    super();

    this.notificationService =  new NotificationService();
  }

  async componentDidMount() {

  }

  state = {
    stepIndex: 1,
    name: '',
    thumbnail: '',
    entry: '',
    rules: [],
    rulesValues: {},
  }

  getGeneralData = () => {
    this.setState({
      generalData: {
        
      }
    })
  }

  nextStep = (payload) => {
    if(this.state.stepIndex === 3 ){
      return;
    }

    // if(this.state.stepIndex === 1){
    //   return;
    // }

    this.setState({
      ...payload,
      stepIndex: this.state.stepIndex + 1
    }, () => console.log(this.state));

  }

  prevStep = () => {
    if(this.state.stepIndex === 1){
      return;
    }

    this.setState({ stepIndex: this.state.stepIndex - 1 });
  }

  render() {
    const { stepIndex } = this.state;

    return <div className={style.form}>
      <div className={style.steps}>
        {`Step ${stepIndex} of 3`}
      </div>

      <div className={style.content}>
        <div className={cx(style.step, { [style.isActive]: stepIndex === 1 })}>
          <GeneralStep
            nextStep={this.nextStep}
          />
        </div>

        <div className={cx(style.step, { [style.isActive]: stepIndex === 2 })}>
          <PlayersStep />
        </div>

        <div className={cx(style.step, { [style.isActive]: stepIndex === 3 })}>
          <MatchesStep />
        </div>
      </div>

      {/* <div className={style.controls}>
        {this.state.stepIndex !== 1 && <Button
            className={style.prev}
            appearance={'_basic-accent'}
            text='prev'
            icon={<i className="material-icons">arrow_back</i>}
            onClick={this.prevStep}
          />
        }
        {this.state.stepIndex !== 3 && <Button
            className={style.next}
            appearance={'_basic-accent'}
            text='next'
            icon={<i className="material-icons">arrow_forward</i>}
            onClick={this.nextStep}
          />
        }
      </div> */}

    </div>;
  }
}

export default MultiStepForm;
import React, { Component } from 'react';

import Button from '../../button';

import GeneralStep from '../general';
import PlayersStep from '../players';
import MatchesStep from '../matches';

import classnames from 'classnames';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

class MultiStepForm extends Component {
  constructor() {
    super();
  }

  async componentDidMount() {

  }

  state = {
    stepIndex: 1,
  }

  handleStepChange = (event, stepIndex) => {
    event.preventDefault();
    
    this.setState({ stepIndex });
  }

  render() {
    const { stepIndex } = this.state;

    return <div>
      <div className={style.controls}>
        <a href="#" onClick={(event) => this.handleStepChange(event, 1)} >1. General information</a>
        <a href="#" onClick={(event) => this.handleStepChange(event, 2)} >2. Tournament players</a>
        <a href="#" onClick={(event) => this.handleStepChange(event, 3)} >3. Tournament matches</a>
      </div>

      <div className={style.content}>
        <div className={cx(style.step, {[style.isActive]: stepIndex === 1})}>
          <GeneralStep />
        </div>

        <div className={cx(style.step, {[style.isActive]: stepIndex === 2})}>
          <PlayersStep />
        </div>

        <div className={cx(style.step, {[style.isActive]: stepIndex === 3})}>
          <MatchesStep />
        </div>
      </div>
    </div>;
  }
}

export default MultiStepForm;
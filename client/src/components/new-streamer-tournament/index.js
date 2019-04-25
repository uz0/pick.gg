import React, { Component } from 'react';

import MultiStepForm from './multi-step-form';
import style from './style.module.css';


class NewStreamerTournament extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={style.wrapper}>
        <div className={style.tournament}>
          <MultiStepForm />
        </div>
      </div>
    );
  }
}

export default NewStreamerTournament;
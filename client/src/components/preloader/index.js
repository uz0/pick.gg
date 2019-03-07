import React, { Component } from 'react';
import style from './style.module.css';

class Preloader extends Component {
  render() {
    return (
      <div className={style.wrapper}>
        <div className={style.loader_circle} />
      </div>
    );
  }
}
export default Preloader;
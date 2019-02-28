import React, { Component } from 'react'
import style from './preloader.module.css'
import classnames from 'classnames';

const cx = classnames.bind(style)

class Preloader extends Component {
  render() {
    return (
      <div class={style.wrapper}>
        <div class={style.loader_circle}></div>
        <div class={style.loader_bottom}>LOADING</div>
      </div>
    )
  }
}
export default Preloader
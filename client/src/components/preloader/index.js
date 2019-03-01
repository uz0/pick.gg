import React, { Component } from 'react'
import style from './preloader.module.css'

class Preloader extends Component {
  render() {
    return (
      <div className={style.wrapper}>
        <div className={style.loader_circle}></div>
      </div>
    )
  }
}
export default Preloader
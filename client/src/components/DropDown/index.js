import React, { Component } from 'react';
import classnames from 'classnames/bind';
import AuthService from '../../services/authService';
import style from './style.module.css';

const cx = classnames.bind(style);

class DropDown extends Component {

  constructor(){
    super();
    this.Auth = new AuthService();
    this.state = {
      isActive: false,
    };
  }

  componentDidMount() {
    window.addEventListener('click', event => {
      if (this.state.isActive && event.target !== this.userbox){
        this.toggleDropDown();
      }
    });
  }
  
  toggleDropDown = () => this.setState({ isActive: !this.state.isActive })
  
  render() {
    return (
      <div className={cx(style.dropdown, { active: this.state.isActive })} onClick={this.toggleDropDown}>
        <div ref={(userbox) => {this.userbox = userbox;}} className={style.userbox}>
          { this.props.placeholder }
        </div>

        <div className={style.menu}>
          { this.props.children }
        </div>
      </div>
    );
  }

}

export default DropDown;

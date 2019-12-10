import React, { Component } from 'react';
import classnames from 'classnames/bind';

import style from './style.module.css';

const cx = classnames.bind(style);

class DropDown extends Component {
  state = {
    isActive: false,
  };

  componentDidMount() {
    window.addEventListener('click', event => {
      if (this.state.isActive && event.target !== this.userbox) {
        this.toggleDropDown();
      }
    });
  }

  toggleDropDown = () => this.setState(prevState => ({ isActive: !prevState.isActive }));

  render() {
    return (
      <div className={cx(style.dropdown, { active: this.state.isActive }, this.props.className)} onClick={this.toggleDropDown}>
        <div ref={userbox => {
          this.userbox = userbox;
        }
        }
        // eslint-disable-next-line react/jsx-indent-props
        className={style.userbox}
        >
          {this.props.placeholder}
        </div>

        <div className={style.menu}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DropDown;

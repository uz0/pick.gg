import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import AuthWrapper from '../authWrapper';

import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';

import style from './style.module.css';
import i18n from 'i18n';

class TopMenuComponent extends Component {
  constructor() {
    super();
    this.state = {
      profile: {
        user: {},
      },
    };
  }

  render() {
    return (
      <div className={style.footer}>
        <div className={style.footer_wrap}>
          <p>© 2019 uz0</p>

          <NavLink to="#">{i18n.t('terms_and_agreement')}</NavLink>
        </div>
      </div>
    );
  }
}

export default AuthWrapper(TopMenuComponent);

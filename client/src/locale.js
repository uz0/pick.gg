import React, { Component } from 'react';
import i18n from './i18n';

class Locale extends Component {
  componentDidMount(){
    const path = this.props.location.pathname;
    const locale = path === '/ru' ? 'ru' : 'en';

    localStorage.setItem('_pgg_locale', locale);

    i18n.changeLanguage(locale, this.props.history.replace('/'));
  }

  render(){
    return <div />;
  }
}

export default Locale;

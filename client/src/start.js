import { Component } from 'react';

import { isLogged } from 'helpers';

class Start extends Component {
  componentDidMount() {
    const isUserAuthenticated = isLogged();

    if (isUserAuthenticated) {
      this.props.history.replace('/tournaments');
    } else {
      this.props.history.replace('/home');
    }
  }

  render() {
    return null;
  }
}

export default Start;

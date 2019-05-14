import React, { Component } from 'react';
import AuthService from '../services/authService';

export default function AuthWrapper(AuthComponent) {
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.auth = new AuthService();
      this.state = {
        user: null,
      };
    }

    componentWillMount() {
      // if (!this.auth.isLoggedIn()) {
      //   this.props.history.replace('/');
      // } else {
      //   try {
      //     const profile = this.auth.getProfile();
      //     this.setState({
      //       user: profile,
      //     });
      //   } catch (err) {
      //     this.auth.logout();
      //     this.props.history.replace('/');
      //   }
      // }
    }

    render() {
      if (this.state.user) {
        return <AuthComponent history={this.props.history} user={this.state.user} />;
      // eslint-disable-next-line no-else-return
      } else {
        return null;
      }
    }
  };
}

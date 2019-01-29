import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/authService'
import Input from '../../components/input'
import Button from '../../components/button'
import style from '../../components/style.module.css'

class Register extends Component {
  constructor() {
    super()
    this.auth = new AuthService()
    this.state = {
      username: '',
      password: '',
    }
  }

  componentWillMount() {}

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  submitForm = async event => {
    event.preventDefault()

    let { username, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      // TODO RENDER ERROR!
      console.error('passwords must be equal');

      return;
    }

    await fetch('/api/authentication/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then(response => response.json())
      .then(({success, message}) => {
        // console.log(response)

        if (!success) {
          // TODO RENDER ERROR!
          console.error(message);
        }

        if (success) {
          this.props.history.replace('/login');
        }
      })
  }

  render() {
    return (
      <div className={style.loginPage}>
        <div className={style.bgWrap} />
        <div className={style.formBlock}>
          <div className={style.infoBlock}>
            Please
            <br /> register <br /> in the <br />
            system
          </div>
          <form onSubmit={this.submitForm}>
            <Input label="Login" name="username" type="text" action={this.onChange('username')} autofocus={true} />
            <Input label="Password" name="password" type="password" action={this.onChange('password')} />
            <Input label="Confirm password" name="confirmPassword" type="password" action={this.onChange('confirmPassword')} />
            <div className="login-btn">
              <button type="submit">Register</button>
              <div>
                <span>or </span>
                <NavLink to="/login">login</NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Register

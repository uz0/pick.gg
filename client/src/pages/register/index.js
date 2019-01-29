import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../../services/authService'
import http from '../../services/httpService'
import Input from '../../components/input'
import '../../components/style.css'

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

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  submitForm = async e => {
    e.preventDefault()

    let { username, password, confirmPassword } = this.state

    const request = await http('/api/authentication/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        confirmPassword,
      }),
    })

    const result = await request.json()
    if (!result.success) {
      alert(result.message)
      return false
    }

    console.log(result)
    this.props.history.replace('/login')
    console.log(this.props)
  }

  render() {
    return (
      <div className="login-page">
        <div className="bg-wrap" />
        <div className="formBlock">
          <div className="info-block">
            Please
            <br /> register <br /> in the <br />
            system
          </div>
          <form onSubmit={this.submitForm}>
            <Input label="Login" name="username" type="text" action={this.onChange} autofocus={true} />
            <Input label="Password" name="password" type="password" action={this.onChange} />
            <Input label="Confirm password" name="confirmPassword" type="password" action={this.onChange} />
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

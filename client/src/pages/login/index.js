import React, { Component } from 'react'
import cx from 'classnames'

import './Login.css'
import AuthService from '../../services/authService'
import Input from '../../components/InputComponent'

class Login extends Component {
	constructor() {
		super()
		this.auth = new AuthService()
		this.handleChange = this.handleChange.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
		this.clickLogin = this.clickLogin.bind(this)
		this.clickRegister = this.clickRegister.bind(this)
		this.state = {
			username: '',
			password: '',
			loginIsShown: false,
			registerIsShown: false,
			startIsShown: true,
		}
	}

	handleChange(e) {
		e.preventDefault()
		this.setState({ [e.target.name]: e.target.value })
	}
	clickLogin() {
		this.setState({
			loginIsShown: !this.state.loginIsShown,
			startIsShown: false,
			registerIsShown: false,
		})
	}
	clickRegister() {
		this.setState({
			registerIsShown: !this.state.registerIsShown,
			loginIsShown: !this.state.loginIsShown,
		})
	}
	handleLogin = async e => {
		e.preventDefault()
		let success = await this.auth.login(this.state.username, this.state.password)
		if (success) this.props.history.replace('/')
	}

	componentWillMount() {
		if (this.auth.isLoggedIn()) this.props.history.replace('/')
	}

	render() {
		return (
			<div className="login-page">
				{this.state.startIsShown && (
					<div className="start-content">
						<h1>Fantasy league</h1>
						<button onClick={this.clickLogin}>Start</button>
						<div>
							<span>or </span>
							<a onClick={this.clickRegister}>register</a>
						</div>
					</div>
				)}
				{this.state.loginIsShown && (
					<form onSubmit={this.handleLogin}>
						<Input id="username" label="" name="username" placeholder="login" type="text" autofocus={true} className={cx('sarasa1', 'sarasa2')} value={this.state.username} action={this.handleChange} />
						<Input id="password" label="" name="password" placeholder="password" type="password" className={cx('sarasa3', 'sarasa4')} value={this.state.password} action={this.handleChange} />
						<div className="login-btn">
							<button type="submit">Login</button> <span>or </span>
							<a onClick={this.clickRegister}>register</a>
						</div>
					</form>
				)}
				{this.state.registerIsShown && (
					<form onSubmit={this.handleLogin}>
						<Input id="username" label="" name="username" placeholder="login" type="text" autofocus={true} className={cx('sarasa1', 'sarasa2')} value={this.state.username} action={this.handleChange} />
						<Input id="password" label="" name="password" placeholder="password" type="password" className={cx('sarasa3', 'sarasa4')} value={this.state.password} action={this.handleChange} />
						<Input id="password" label="" name="password" placeholder="repeat password" type="password" className={cx('sarasa3', 'sarasa4')} value={this.state.password} action={this.handleChange} />
						<div className="login-btn">
							<button type="submit">Register</button> <span>or </span>
							<a onClick={this.clickLogin}>login</a>
						</div>
					</form>
				)}
			</div>
		)
	}
}

export default Login

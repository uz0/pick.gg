import React, { Component } from 'react'
import './TopMenu.css'
import AuthService from '../../services/authService'
import AuthWrapper from '../authWrapper'

class TopMenuComponent extends Component {
	constructor() {
		super()
		this.Auth = new AuthService()
		this.state = {
			profile: null,
		}
	}

	handleLogout() {
		this.Auth.logout()
		this.props.history.replace('/login')
	}

	componentDidMount() {
		let profile = this.Auth.getProfile()
		this.setState({ profile: profile })
	}

	render() {
		return (
			<div className="top-menu-component">
				<div className="menuWrap">
					<h2>Pick.gg</h2>
					<div className="user-info-wrapper">
						<button onClick={this.handleLogout.bind(this)}>Logout</button>
					</div>
				</div>
			</div>
		)
	}
}

export default AuthWrapper(TopMenuComponent)

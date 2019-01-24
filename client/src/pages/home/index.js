import React, { Component } from 'react'
import './Home.css'
import Input from '../../components/InputComponent'

import AuthService from '../../services/authService'

class App extends Component {
	constructor() {
		super()
		this.AuthService = new AuthService()
		this.state = {}
	}

	render() {
		function Blog(props) {
			const content = props.posts.map(item => (
				<div className="cardTournament">
					<p>{item.title}</p>
					<p>{item.date}</p>
					<p>{item.users} users</p>
					<p>$ {item.entry}</p>
				</div>
			))
			return <div>{content}</div>
		}

		const items = [{ title: 'My Crazy League', date: 'Feb 02', users: '2023', entry: '3.97' }, { title: 'Mamkin tiger wanna play', date: 'Feb 03', users: '3052', entry: '10.00' }, { title: 'Only for hardcore fans', date: 'Feb 05', users: '1233', entry: '2.17' }]
		return (
			<div className="home-page">
				<div className="bg-wrap" />
				<div className="filters">
					<h2>Tournaments</h2>
					<form>
						<Input label="End date" name="date" type="date" />
						<Input label="Minimal entry" name="entry" placeholder="$ 0.1" type="text" />
					</form>
					<div className="createTournament">
						<p>Not satisfied?</p>
						<button type="submit">Create a new tournament</button>
					</div>
				</div>
				<div className="tournaments-block">
					<div className="headerTournaments">
						<p>Tournament Name</p>
						<p>End Date</p>
						<p>Users</p>
						<p>Entry</p>
					</div>
					<Blog posts={items} />
					<Blog posts={items} />
					<Blog posts={items} />
				</div>
			</div>
		)
	}
}

export default App

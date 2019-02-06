import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import TopMenuComponent from './components/TopMenuComponent'
import Tournaments from './pages/tournaments'
import Tournament from './pages/tournament'
import Profile from './pages/profile'

const App = ({ history }) => (
	<div>
		<TopMenuComponent history={history} />
		<Container>
			<Switch>
				<Route exact path="/tournaments" component={Tournaments} />
				<Route exact path="/tournaments/:id" component={Tournament} />
				<Route exact path="/profile" component={Profile} />
				<Redirect to="/tournaments"/>
			</Switch>
		</Container>
	</div>
)

const Container = ({ children }) => <div className="container">{children}</div>

export default App
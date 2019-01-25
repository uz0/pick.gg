import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import TopMenuComponent from './components/TopMenuComponent'
import Home from './pages/home'
import Tournament from './pages/tournament'

const App = ({ history }) => (
	<div>
		<TopMenuComponent history={history} />
		<Container>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/tournament" component={Tournament} />
				<Route component={Home} />
			</Switch>
		</Container>
	</div>
)

const Container = ({ children }) => <div className="container">{children}</div>

export default App

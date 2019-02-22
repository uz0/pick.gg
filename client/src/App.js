import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import TopMenuComponent from './components/TopMenuComponent'
import NotificationContainer from './components/notification/NotificationContainer'
import Transactions from './pages/transactions'
import Tournaments from './pages/tournaments'
import Tournament from './pages/tournament'
import Profile from './pages/profile'
import User from './pages/user'
import MyTournaments from './pages/mytournaments'
import Rating from './pages/rating'

const App = ({ history }) => (
	<div>
		<TopMenuComponent history={history} />
    <NotificationContainer />
		<Container>
			<Switch>
				<Route exact path="/tournaments" component={Tournaments} />
				<Route exact path="/tournaments/:id" component={Tournament} />
				<Route exact path="/profile" component={Profile} />
				<Route exact path="/user/:id" component={User} />
        <Route exact path="/mytournaments" component={MyTournaments} />
        <Route exact path="/rating" component={Rating} />
        <Route exact path="/transactions" component={Transactions} />
				<Redirect to="/tournaments"/>
			</Switch>
		</Container>
	</div>
)

const Container = ({ children }) => <div className="container">{children}</div>

export default App
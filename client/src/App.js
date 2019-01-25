import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import TopMenuComponent from './components/TopMenuComponent'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import Start from './pages/start'
const App = ({ history }) => (
  <div>
    <TopMenuComponent history={history} />
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />

        <Redirect from="/" to="/start" component={Start} />

        <Route component={Home} />
      </Switch>
    </Container>
  </div>
)

const Container = ({ children }) => <div className="container">{children}</div>

export default App

import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import TopMenuComponent from './components/TopMenuComponent'
import Home from './pages/home'

const App = ({ history }) => (
  <div>
    <TopMenuComponent history={history} />
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />

        <Route component={Home} />
      </Switch>
    </Container>
  </div>
)

const Container = ({ children }) => <div className="container">{children}</div>

export default App

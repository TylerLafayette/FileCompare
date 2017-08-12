import React, { Component } from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import history from './history.js'
import Home from "../ui/Home"
import Job from "../ui/Job"

export default class Main extends Component {
	render() {
		return (
			<Router history={history} >
				<div id="router--container">
					<Route exact path="/" component={Home} />
					<Route exact path="/job" component={Job} />
				</div>
			</Router>
		)
	}
}

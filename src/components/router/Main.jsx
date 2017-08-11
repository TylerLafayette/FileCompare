import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom"
import history from "./history.js"
import Home from "../ui/Home"

export default class Main extends Component {
	render() {
		return (
			<Router history={history} >
				<div id="keljlkfhsalkfds">
					<Route exact path="" component={Home} />
				</div>
			</Router>
		)
	}
}

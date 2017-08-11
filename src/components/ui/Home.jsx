import React, { Component } from "react"
import { ipcRenderer } from "electron"
import history from "../router/history.js"

export default class Home extends Component {
	constructor() {
		super()
		this.state = {
			hovering: false
		}
	}
	onDragOver(e) {
		e.preventDefault()
		this.setState({ hovering: true })
	}
	onDragEnd(e) {
		e.preventDefault()
		this.setState({ hovering: false })
	}
	onFileDrop(e) {
		e.preventDefault()
		this.setState({ hovering: false })
		// If dropped items aren't files, reject them
		var dt = e.dataTransfer
		var items = []
		if (dt.items) {
			for (var i=0; i < dt.items.length; i++) {
				if (dt.items[i].kind == "file") {
					items[0] = dt.items[i].getAsFile()
				}
			}
		} else {
			// Use DataTransfer interface to access the file(s)
			items = dt.files;
		}
		var thing = items[0].path

		if(items.length > 1) 
			return this.setState({error: true, message: "Only drop in one folder, please!"})

		if(!items[0].type == "")
			return this.setState({error: true, message: "Please drop in a folder!"})
		
		ipcRenderer.send('run-directory-scan', thing) // Send the message to the server
		history.push('/job') // Redirect to the job page
	}
	componentDidMount() {
		ipcRenderer.on('directory-scan', (e, arg) => {
			console.log(arg);
		})
		ipcRenderer.on('progress-update', (e, progress) => {
			console.log("Progress report: " , progress)
		})
	}
	render() {
		if(this.state.error) {
			this.refs.message.classList.add("anim--done")
			this.refs.message.classList.remove("shake")
			setTimeout(() => {this.refs.message.classList.add("shake");this.setState({error: false})}, 10)
		}
		return (
			<div className="home--wrapper" 
				onDragEnd={this.onDragEnd.bind(this)} 
				onDragOver={this.onDragOver.bind(this)}
				onDragLeave={this.onDragEnd.bind(this)}
				onDrop={this.onFileDrop.bind(this)}
				>
				<div className="border--container">
					<div className={this.state.hovering ? "border--drag show" : "border--drag"}></div>
				</div>
				<div className="center--container">
					<h1 className="main--text">FileCompare</h1>
					<span ref="message" className="secondary--text">{this.state.message ? this.state.message : "Drag a folder here to start."}</span>
				</div>
			</div>
		)
	}
}

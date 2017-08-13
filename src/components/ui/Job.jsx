import React, { Component } from "react"
import { ipcRenderer } from "electron"
import history from "../router/history.js"

export default class Job extends Component {
    constructor() {
        super()
        this.state = {
            percent: 0
        }
    }
    componentDidMount() {
        if(window.localStorage.getItem('current-job-path')) {
            ipcRenderer.send('run-directory-scan', window.localStorage.getItem('current-job-path')) // Send the message to the server
            window.localStorage.removeItem('current-job-path')
        }else {
            history.push('/')
        }
        ipcRenderer.on('progress-update', (e, percent) => {
			// this.setState({
            //     percent
            // })
		})
    }
    render() {
        return (
            <div className="home--wrapper">
                <div className="center--container">
                    <div className="progress--bar-outer">
                        <div className="progress--bar-inner"/>
                    </div>
                    <span className="loading--status">{Math.round(this.state.percent)}%</span>
                    <span className="loading--status">This may take a while, depending on the size of the directory.</span>
                </div>
            </div>
        )
    }
}
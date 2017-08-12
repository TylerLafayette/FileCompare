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
        ipcRenderer.on('progress-update', (e, percent) => {
            console.log(percent)
			this.setState({
                percent
            })
		})
    }
    render() {
        return (
            <div className="home--wrapper">
                <div className="center--container">
                    <div className="progress--bar-outer">
                        <div className="progress--bar-inner" style={{
                            width: this.state.percent + "%"
                        }}/>
                    </div>
                    <span className="loading--status">{Math.round(this.state.percent)}%</span>
                </div>
            </div>
        )
    }
}
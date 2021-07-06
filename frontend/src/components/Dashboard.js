import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
        };

        this.getMessage = this.getMessage.bind(this)
    };

    async getMessage() {
        try {
            let response = await axiosInstance.get('/dashboard/');
            const message = response.data.dashboard;
            this.setState({
                message: message,
            });
            return message;
        } 
            catch(error) {
                console.log("Dashboard Error: ", JSON.stringify(error, null, 4));
            }
    };

    render() {
        return (
            <div>
                <p>{this.state.message}</p>
            </div>
        )
    };
}

export default Dashboard;
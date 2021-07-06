import React, { Component } from "react";
import { Switch, Route, Link } from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import axiosInstance from "../axiosApi";


class App extends Component {
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout() {
        try {
            const response = await axiosInstance.post(
                '/blacklist/', {
                    "refresh_token": localStorage.getItem("refresh_token")
                }
            );
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            return response;
        }
            catch(e) {
                console.log(e);
            }
    };
    
    render() {
        return (
            <div className="site">
                <nav>
                    <Link className={"nav-link"} to={"/"}>Home</Link>
                    <Link className={"nav-link"} to={"/login/"}>Login</Link>
                    <Link className={"nav-link"} to={"/register/"}>Register</Link>
                    <Link className={"nav-link"} to={"/dashboard/"}>Dashboard</Link>
                    <button onClick={this.handleLogout}>Logout</button>
                </nav>
                <main>
                    <h1>Welcome</h1>
                    <Switch>
                        <Route exact path={"/login/"} component={Login}/>
                        <Route exact path={"/register/"} component={Register}/>
                        <Route exact path={"/dashboard/"} component={Dashboard}/>
                        <Route path={"/"} render={() => <div>Home</div>}/>
                    </Switch>                
                </main>
            </div>
        );
    }
}

export default App;
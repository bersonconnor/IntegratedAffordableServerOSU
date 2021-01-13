import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";

const Landing = () => {
    return (
        <div className="row">
            <div className="col">
                <div className="row mt-5">
                    <div className="col text-center">
                        <NavLink to="/login">
                            <input type="submit" value="Login" className="App-login-button" />
                        </NavLink>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col text-center">
                        <NavLink to="/register">
                            <input
                            type="submit"
                            value="Register"
                            className="App-login-button"
                            />
                        </NavLink>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col text-center">
                        <Button
                            id="donate-button"
                            target="_blank"
                            href="https://www.covid19affordhealth.org/"
                            style={{margin: "0px"}}>
                            Donate
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;

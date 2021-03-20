import React, { Fragment, useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//components
import ApplicantForm from "./components/ApplicantForm";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <Fragment>
      <section id="applicantform">
        <div className="container">
          <ApplicantForm />
        </div>
        <Router>
          <div className="container">
            <Switch>
              <Route
                exact
                path="/login"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/register"
                render={(props) => <Register {...props} />}
              />
              <Route
                exact
                path="/dashboard"
                render={(props) => <Dashboard {...props} />}
              />
            </Switch>
          </div>
        </Router>
      </section>
    </Fragment>
  );
}

export default App;

import React, { Fragment, useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//components
import ApplicantForm from "./components/ApplicantForm";
import Expform from "./components/ExperienceForm";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

toast.configure();

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function stillAuth(){
    try {
      const response = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    stillAuth();
  }, [])

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <ApplicantForm {...props} />}
              id="applicantform"
            />
            <Route
              exact
              path="/login"
              render={(props) =>
                !isAuthenticated ? (
                  <Login {...props} setAuth={setAuth}/>
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/register"
              render={(props) =>
                !isAuthenticated ? (
                  <Register {...props} setAuth={setAuth}/>
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/dashboard"
              render={(props) =>
                isAuthenticated ? (
                  <Dashboard {...props} setAuth={setAuth}/>
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;

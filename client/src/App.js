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
//import Expform from "./components/ExperienceForm";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

toast.configure();

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const setAuth = (boolean) => {
		setIsAuthenticated(boolean);
	};

	async function stillAuth() {
		try {
			const response = await fetch("http://localhost:5000/auth/verify", {
				method: "GET",
				headers: { token: localStorage.token },
			});
			const parseRes = await response.json();
			parseRes === true
				? setIsAuthenticated(true)
				: setIsAuthenticated(false);
		} catch (error) {
			console.log(error.message);
		}
	}

	useEffect(() => {
		stillAuth();
	}, []);

	return (
		<Fragment>
			<Router>
				<div className="container">
					<Switch>
						<Route exact path="/" render={Home} />
						<Route
							path="/login"
							render={(props) =>
								!isAuthenticated ? (
									<Login {...props} setAuth={setAuth} />
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
									<Register {...props} setAuth={setAuth} />
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
									<Dashboard {...props} setAuth={setAuth} />
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

const Home = () => (
	<Fragment>
		<section id="greet" className="d-flex align-items-center">
			<Nav />
			<div className="container">
				<div className="row">
					<div
						className="
							col-lg-6
							d-flex
							flex-column
							justify-content-center
							pt-4 pt-lg-0
							order-2 order-lg-1
						"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<h1>ResumeDB</h1>
						<h2>Find quality candidates for your organization</h2>
						<div className="d-lg-flex">
							<a
								href="#applicantform"
								className="btn-get-started scrollto"
							>
								Get Started &gt;
							</a>
						</div>
					</div>
					<div
						className="col-lg-6 order-1 order-lg-2 greet-img"
						data-aos="zoom-in"
						data-aos-delay="200"
					>
						<img
							src="page.png"
							className="img-fluid animated"
							alt=""
						/>
					</div>
				</div>
			</div>
		</section>
		<div id="applicantform" >
			<ApplicantForm  />
		</div>
		
	</Fragment>
);

const Nav = () => (
	<header id="header">
		<div className="container d-flex align-items-center">
			<nav
				className="
						navbar navbar-expand-lg navbar-light
						bg-light
						fixed-top
					"
			>
				<a className="navbar-brand" href="https://www.adasteam.ca/">
					POWERED BY ADA'S TEAM
				</a>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
							<a className="nav-link" href="/">
								Home
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link hiddenTab"
								href="#applicantform"
							>
								Apply
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/login">
								Login
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</header>
);

export default App;

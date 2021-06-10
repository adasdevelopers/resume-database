import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

import AdminTools from "./AdminTools"

export default function Dashboard({ setAuth }) {
	const [user, setUser] = useState("");

	const getProfile = async () => {
		try {
			const response = await fetch("http://localhost:5000/dashboard/", {
				method: "POST",
				headers: { token: localStorage.token },
			});
			const parsRes = await response.json();
			setUser(parsRes);
		} catch (error) {
			console.log(error.message);
		}
	};

	const logout = (e) => {
		e.preventDefault();
		localStorage.removeItem("token");
		setAuth(false);
		toast.success("Logged Out");
	};

	useEffect(() => {
		getProfile();
	}, []);

	return (
		<Fragment >
			<div className="mt-5 d-flex align-items-center">
				<h1>
					Hello {user.user_first_name} {user.user_last_name}
				</h1>
			</div>
			<div>
				{
					{
						verified: <h3>Table</h3>,
						admin: (
							<div>
								<AdminTools />
								<h3>Table</h3>
							</div>
						),
						unverified: (
							<h3>
								Your account is still being reviewed, please
								check back later or contact us.
							</h3>
						),
					}[user.user_role]
				}
			</div>
			<button className="btn btn-danger" onClick={(e) => logout(e)}>
				Logout
			</button>
		</Fragment>
	);
}

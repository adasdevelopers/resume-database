import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login({ setAuth }) {
	const { register, handleSubmit } = useForm();

	const onSubmit = async (data, e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:5000/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const parseRes = await response.json();

			if (parseRes.token) {
				localStorage.setItem("token", parseRes.token);
				setAuth(true);
				toast.success("Login Successful");
			} else {
				setAuth(false);
				toast.error(parseRes);
			}
      
		} catch (err) {
			console.error(err.message);
		}
	};
	return (
		<Fragment>
			<h1 className="text-center mt-5">Login</h1>
			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<input
						type="email"
						name="email"
						className="form-control"
						placeholder="Email"
						ref={register}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						name="password"
						className="form-control"
						placeholder="Password"
						ref={register}
						required
					/>
				</div>
				<button type="submit" className="btn-success btn-block">
					Login
				</button>
			</form>
			<Link to="/register">Register</Link>
		</Fragment>
	);
}

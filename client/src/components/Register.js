import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register({setAuth}) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
 
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      	  
	  const parseRes = await response.json();

	  if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
		toast.success("Registration Successful")
      }
	  else{
		setAuth(false);
		toast.error(parseRes);
	  }

    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Register</h1>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              ref={register}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="First Name"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              ref={register}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <input
              type="text"
              name="company"
              className="form-control"
              placeholder="Company"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="City"
              ref={register}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-success btn-block">
          Register
        </button>
      </form>
	  <Link to="/login">Login</Link>
    </Fragment>
  );
}

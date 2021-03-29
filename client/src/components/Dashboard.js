import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Dashboard({ setAuth }) {
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "POST",
        headers: { token: localStorage.token },
      });
	  const parsRes = await response.json();
	  setName(parsRes.user_first_name)

    } catch (error) {
      console.log(error.message);
    }
  }

  const logout = (e) =>{
	  e.preventDefault();
	  localStorage.removeItem("token");
	  setAuth(false);
	  toast.success("Logged Out")
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Fragment>
      <h1>Hello {name}</h1>
	  <button className="btn btn-danger" onClick={e => logout(e)}>Logout</button>
    </Fragment>
  );
}

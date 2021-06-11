import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminTools() {
	const [applicant, setApplicant] = useState([]);
	const [searchTerm, setSearch] = useState([]);

	const onSearch = async (e) => {
		e.preventDefault();
		try {
			const check = await fetch(
				`http://localhost:5000/check/${searchTerm}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				}
			).then((response) => response.json());
			if (check) {
				const response = await fetch(
					`http://localhost:5000/admin/${searchTerm}`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
					}
				);
				const applicant = await response.json();
				setApplicant(applicant);
			} else {
				toast.error("Application not present");
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const hideApp = async (id) => {};
	const deleteApp = async (id) => {
		try {
			await fetch(`http://localhost:5000/admin/${id}`, {
				method: "DELETE",
			});
			setApplicant([]);
			toast.success("Application deleted");
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<Fragment>
			<div>
				<h3 className="mt-3 mb-2">Search Application</h3>
				<form className="d-flex mt-3 mb-5" onSubmit={onSearch}>
					<input
						type="email"
						placeholder="Search for Applicant by Email"
						className="form-control"
						value={searchTerm}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button className="btn btn-success">Search</button>
				</form>
				{applicant.map((applicant) => {
					return (
						<div key="applicant" id="applicantinfo">
							<p>
								Application ID: {applicant.personid} <br />{" "}
								First Name: {applicant.firstname} <br /> Last
								Name: {applicant.lastname} <br /> Email:{" "}
								{applicant.email} <br /> Contact Number:{" "}
								{applicant.phonenumber} <br /> City:{" "}
								{applicant.city} <br /> Province:{" "}
								{applicant.province} <br />{" "}
							</p>
							<button
								className="btn btn-warning"
								onClick={() => hideApp(applicant.personid)}
							>
								Hide/Unhide Application
							</button>
							<button
								className="btn btn-danger"
								onClick={() => deleteApp(applicant.personid)}
							>
								Delete Application
							</button>
						</div>
					);
				})}
			</div>
		</Fragment>
	);
}

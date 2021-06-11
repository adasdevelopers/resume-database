import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminTools() {
	const [applicant, setApplicant] = useState([]);
	const [searchTerm, setSearch] = useState([]);
	const [Option, setOption] = useState("Hide Application");
	const [regs, setRegs] = useState([]);

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
				if (applicant[0].status !== "active")
					setOption("Unhide Application");
				else setOption("Hide Application");
			} else {
				toast.error("Application not present");
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const hideApp = async (e, id) => {
		e.preventDefault();
		try {
			await fetch(`http://localhost:5000/admin/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			onSearch(e);
			toast.success("Application status changed");
		} catch (error) {
			console.error(error.message);
		}
	};

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

	const getRegs = async () => {
		try {
			const response = await fetch(
				"http://localhost:5000/registerdecisions"
			);
			const jsonData = await response.json();

			setRegs(jsonData);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		getRegs();
	}, []);

	const denyReg = async (id) => {
		try {
			console.log(id);
			await fetch(`http://localhost:5000/registerdecisions/${id}`, {
				method: "DELETE",
			});
			setRegs(regs.filter((regs) => regs.user_id !== id));
			toast.success("Account terminated");
		} catch (error) {
			console.error(error.message);
		}
	};

	const approveReg = async (id) => {
		try {
			await fetch(`http://localhost:5000/registerdecisions/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			setRegs(regs.filter((regs) => regs.user_id !== id));
			toast.success("New User account activated!");
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<Fragment>
			<div className="mb-5">
				<h3 className="mt-3 mb-2">Search Application</h3>
				<p>varunrajrana98@gmail.com</p>
				<form className="d-flex mt-3 mb-3" onSubmit={onSearch}>
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
								{applicant.province} <br /> <br /> Current
								Status: {applicant.status}
							</p>
							<button
								className="btn btn-warning mr-3"
								onClick={(e) => hideApp(e, applicant.personid)}
							>
								{Option}
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
			<div className="mb-5">
				<h3>New Registrations</h3>
				{regs === [] && (
					<table className="table mt-5 text-center">
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Company</th>
								<th>City</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{regs.map((regs) => (
								<tr key={regs.user_id}>
									<td>
										{regs.user_first_name}{" "}
										{regs.user_last_name}
									</td>
									<td>{regs.user_email}</td>
									<td>{regs.companyname}</td>
									<td>{regs.city}</td>
									<td>
										<button
											className="btn btn-success mr-2"
											onClick={() =>
												approveReg(regs.user_id)
											}
										>
											Approve
										</button>
										<button
											className="btn btn-danger"
											onClick={() =>
												denyReg(regs.user_id)
											}
										>
											Deny
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}{regs !== [] && (<h5 className="mt-3">No new registrations at this time...</h5>)}
			</div>
		</Fragment>
	);
}

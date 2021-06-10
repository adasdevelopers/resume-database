import React, { Fragment, useEffect, useState } from "react";

export default function AdminTools() {
	const [applicant, setApplicant] = useState([]);
	const [searchTerm, setSearch] = useState([]);

	const getApplicant = async () => {
		try {
			const response = await fetch("http://localhost:5000/search");
			const jsonData = await response.json();

			setApplicant(jsonData);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		getApplicant();
	}, []);

	const onSearch = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/search/${searchTerm}`,{
                method:"GET",
                headers: {"Content-Type":"application/json"},
            }).then(response => response.json());
			setApplicant(JSON.stringify(response));
			
        } catch (err) {
            console.error(err.message);
        }
    }

	return (
		<Fragment>
			<div>
				<h3>Admin Tools</h3>
				<form className="d-flex mt-5 mb-5" onSubmit={onSearch}>
					<input
						type="email"
						className="form-control"
						value={searchTerm}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button className="btn btn-success">Search</button>
				</form>
				<h4>{applicant}</h4>
				<button className="btn btn-warning">Hide/Unhide Application</button>
				<button className="btn btn-danger">Delete Application</button>
			</div>
		</Fragment>
	);
}

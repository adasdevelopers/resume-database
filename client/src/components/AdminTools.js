import React, { Fragment, useEffect, useState } from "react";

export default function AdminTools() {
	const [applicant, setApplicant] = useState([]);

	const deleteApplication = async (id) => {
		try {
			const deleteApplication = await fetch(`http://localhost:5000/todo/${id}`, {
				method: "DELETE",
			});
			setApplicant(applicant.filter((applicant) => applicant.todo_id !== id));
		} catch (error) {
			console.error(error.message);
		}
	};

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

	return (
		<Fragment>
			<div>
				<h3>Admin Tools</h3>
			</div>
			<table className="table mt-5 text-center">
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {applicant.map(applicant => (
                    <tr key = {applicant.todo_id}>
                        <td>{applicant.description}</td>
                        <td><button className="btn btn-danger" onClick={()=>deleteApplication(applicant.todo_id)}>Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
		</Fragment>
	);
}

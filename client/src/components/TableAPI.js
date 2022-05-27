import React, { useEffect, useState } from "react";
import AdminTable from './AdminTable';

export default function TableAPI() {
    const [cells, setCells] = useState([]);

    const getApplicants = async () => {
        try {
			const response = await fetch("http://localhost:5000/applicants/", {
				method: "POST",
				headers: { token: localStorage.token },
			});
			const parsRes = await response.json();
			setUser(parsRes);
		} catch (error) {
			console.log(error.message);
		}
    };
}
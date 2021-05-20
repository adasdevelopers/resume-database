import React, { Fragment, useState, useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { baseStyle, activeStyle, acceptStyle, rejectStyle } from "./styles.js";

export default function ApplicantForm() {
	const { register, control, handleSubmit } = useForm({
		defaultValues: {
			items: [
				{
					InstName: "",
					startSchool: "",
					endSchool: "",
					degree: "",
					other: "",
					major: "",
					minor: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [count, setCount] = useState(0);

	const onSubmit = async (data, e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("pdf", selectedFile);

		const res = await fetch("http://localhost:5000/upload", {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.catch((error) => {
				console.error("Error:", error);
			});
		data.resumelink = res.location;
		console.log(data);
		try {
			await fetch("http://localhost:5000/submitform", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			window.location = "/";
		} catch (err) {
			console.error(err.message);
		}
	};

	const onDrop = useCallback((acceptedFiles) => {
		setSelectedFile(acceptedFiles[0]);
		setIsFilePicked(true);
	}, []);

	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,
		accept: "application/pdf,.doc,.docx",
	});

	useDropzone({ onDrop });

	const acceptedFileItems = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isDragActive, isDragReject, isDragAccept]
	);

	return (
		<Fragment>
			<section id="applicantform">
				<h1 className="text-center mt-5">Applicant Form</h1>
				<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
					<div className="form-row">
						<div className="form-group col-md-6">
							<label htmlFor="fname">First Name*</label>
							<input
								type="text"
								name="firstName"
								className="form-control"
								id="fname"
								placeholder="First Name"
								ref={register}
								required
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="lname">Last Name*</label>
							<input
								type="text"
								name="lastName"
								className="form-control"
								id="lname"
								placeholder="Last Name"
								ref={register}
								required
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="prefname">Preferred Name</label>
							<input
								type="text"
								name="prefName"
								className="form-control"
								id="prefname"
								placeholder="Preferred Name"
								ref={register}
							/>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group col-md-6">
							<label htmlFor="inputEmail">Email*</label>
							<input
								type="email"
								name="email"
								className="form-control"
								id="inputEmail"
								placeholder="Email"
								ref={register}
								required
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="inputphonenumber">
								Phone Number
							</label>
							<input
								type="tel"
								name="phonenumber"
								className="form-control"
								id="inputphonenumber"
								placeholder="(123)-456-7890"
								ref={register}
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="inputAddress">Address</label>
						<input
							type="text"
							name="address"
							className="form-control"
							id="inputAddress"
							placeholder="1234 Main St"
							ref={register}
						/>
					</div>
					<div className="form-row">
						<div className="form-group col-md-6">
							<label htmlFor="inputCity">City*</label>
							<input
								type="text"
								name="city"
								className="form-control"
								id="inputCity"
								ref={register}
								required
							/>
						</div>
						<div className="form-group col-md-4">
							<label htmlFor="inputState">Province*</label>
							<select
								id="inputState"
								name="province"
								className="form-control"
								placeholder=""
								ref={register}
								required
							>
								<option value="">Choose...</option>
								<option value="AB">Alberta</option>
								<option value="BC">British Columbia</option>
								<option value="MB">Manitoba</option>
								<option value="NB">New Brunswick</option>
								<option value="NL">
									Newfoundland and Labrador
								</option>
								<option value="NS">Nova Scotia</option>
								<option value="ON">Ontario</option>
								<option value="PE">Prince Edward Island</option>
								<option value="QC">Quebec</option>
								<option value="SK">Saskatchewan</option>
								<option value="NT">
									Northwest Territories
								</option>
								<option value="NU">Nunavut</option>
								<option value="YT">Yukon</option>
							</select>
						</div>
						<div className="form-group col-md-2">
							<label htmlFor="inputZip">Zip*</label>
							<input
								type="text"
								name="zip"
								className="form-control"
								id="inputZip"
								ref={register}
								required
							/>
						</div>
					</div>
					<p>Websites (Optional)</p>
					<div className="form-row">
						<div className="form-group col-md-4">
							<label htmlFor="web1">LinkedIn</label>
							<input
								type="url"
								name="web1"
								className="form-control"
								id="web1"
								placeholder=""
								ref={register}
							/>
						</div>
						<div className="form-group col-md-4">
							<label htmlFor="web2">Github</label>
							<input
								type="url"
								name="web2"
								className="form-control"
								id="web2"
								placeholder=""
								ref={register}
							/>
						</div>
						<div className="form-group col-md-4">
							<label htmlFor="web3">Portfolio</label>
							<input
								type="url"
								name="web3"
								className="form-control"
								id="web3"
								placeholder=""
								ref={register}
							/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="file">Resume*</label>

						<div
							className="form-control"
							{...getRootProps({ className: "dropzone" })}
							style={style}
						>
							<input
								{...getInputProps()}
								type="file"
								id="file"
								name="file"
							/>
							<p>
								Drag 'n' drop some files here, or click to
								select files
							</p>
							<em>
								(Only *.pdf,*.docx and *.doc files will be
								accepted)
							</em>
						</div>
						<aside>
							<p>Accepted files:</p>
							<ul>{acceptedFileItems}</ul>
						</aside>
					</div>
					<div>
						<h3>Education</h3>
						<ul className="list-unstyled">
							{fields.map((item, index) => {
								return (
									<li key={item.id}>
										<div>
											<div className="form-row">
												<div className="form-group col-md-5">
													<label htmlFor="InstName">
														Institution Name
													</label>
													<input
														name={`edu[${index}].InstName`}
														defaultValue={
															item.InstName
														}
														className="form-control"
														id="InstName"
														ref={register()}
														required
													/>
												</div>
												<div className="form-group col-md-3">
													<label htmlFor="startDateSchool">
														Start Date*
													</label>
													<input
														type="date"
														name={`edu[${index}].startSchool`}
														defaultValue={
															item.startSchool
														}
														className="form-control"
														id="startDateSchool"
														ref={register()}
														required
													/>
												</div>
												<div className="form-group col-md-3">
													<label htmlFor="endDateSchool">
														End Date/Expected
														Graduation*
													</label>
													<input
														type="date"
														name={`edu[${index}].endSchool`}
														defaultValue={
															item.endSchool
														}
														className="form-control"
														id="endDateSchool"
														ref={register()}
														required
													/>
												</div>
												<div className="form-group col-md-1">
													<button
														type="button"
														id="removebutton"
														className="btn btn-outline-danger form-control"
														onClick={(e) => {
															if (count > 0) {
																remove(index);
																setCount(
																	count - 1
																);
															}
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="15"
															fill="currentColor"
															className="bi bi-trash"
															viewBox="0 0 16 16"
														>
															<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
															<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
														</svg>
													</button>
												</div>
											</div>

											<div className="form-row">
												<div className="form-group col-md-3">
													<label htmlFor="degree">
														Degree
													</label>
													<span className="required">
														*
													</span>
													<select
														id="inputDegree"
														name={`edu[${index}].degree`}
														defaultValue={
															item.degree
														}
														className="form-control"
														placeholder="Level of Education"
														ref={register()}
														required
													>
														<option value="">
															Choose...
														</option>
														<option value="HS">
															High School Diploma
														</option>
														<option value="PC">
															Professional
															Certificate
														</option>
														<option value="TD">
															Transfer Degree
														</option>
														<option value="AD">
															Associate's Degree
														</option>
														<option value="BD">
															Bachelor's Degree
														</option>
														<option value="MD">
															Master's Degree
														</option>
														<option value="DD">
															Doctoral Degree
														</option>
														<option value="PD">
															Professional Degree
														</option>
														<option value="SD">
															Specialist Degree
														</option>
														<option value="OT">
															Other
														</option>
													</select>
												</div>
												<div className="form-group col-md-2">
													<label htmlFor="other">
														If Other, Specify:
													</label>
													<input
														type="text"
														name={`edu[${index}].other`}
														defaultValue={
															item.other
														}
														className="form-control"
														id="other"
														ref={register()}
													/>
												</div>
												<div className="form-group col-md-3">
													<label htmlFor="major">
														Major(s), Comma
														Separated
													</label>
													<input
														type="text"
														name={`edu[${index}].major`}
														defaultValue={
															item.major
														}
														className="form-control"
														id="major"
														placeholder="Major(s)"
														ref={register()}
													/>
												</div>
												<div className="form-group col-md-3">
													<label htmlFor="minor">
														Minor(s), Comma
														Separated
													</label>
													<input
														type="text"
														name={`edu[${index}].minor`}
														defaultValue={
															item.minor
														}
														className="form-control"
														id="minor"
														placeholder="Minor(s)"
														ref={register()}
													/>
												</div>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
						<button
							type="button"
							onClick={(e) => {
								if (count < 5) {
									append({});
									setCount(count + 1);
								}
							}}
						>
							Add Education
						</button>
					</div>
					<div>
						<h3>Experience</h3>
						<div className="form-row">
							<div className="form-group col-md-6">
								<label htmlFor="inputCompany">
									Company/Organization Name
								</label>
								<input
									type="text"
									name="companyName"
									className="form-control"
									id="inputCompany"
									placeholder="ex: Google"
									ref={register}
									required
								/>
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="inputPosition">
									Position/Title
								</label>
								<input
									type="text"
									name="Position"
									className="form-control"
									id="inputPosition"
									placeholder="ex: Software Developer"
									ref={register}
									required
								/>
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="inputStartDate">
									Start Date
								</label>
								<input
									type="month"
									name="startDate"
									className="form-control"
									id="inputStartDate"
									placeholder="YYYY/MM"
									ref={register}
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group col-md-6">
								<label htmlFor="inputEndDate">End Date</label>
								<input
									type="month"
									name="endDate"
									className="form-control"
									id="inputEndDate"
									placeholder="YYYY/MM"
									ref={register}
									required
								/>
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="inputDescription">
									Description
								</label>
								<input
									style={{ height: "200px" }}
									type="text"
									name="description"
									className="form-control"
									id="inputDescription"
									placeholder="Talk about your role and responsibilities."
									ref={register}
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group col-md-6">
								<label htmlFor="inputCity">City</label>
								<input
									type="text"
									name="city"
									className="form-control"
									id="inputCity"
									ref={register}
									required
								/>
							</div>
							<div className="form-group col-md-4">
								<label htmlFor="inputState">Province</label>
								<select
									id="inputState"
									name="province"
									className="form-control"
									placeholder=""
									ref={register}
									required
								>
									<option value="">Choose...</option>
									<option value="AB">Alberta</option>
									<option value="BC">British Columbia</option>
									<option value="MB">Manitoba</option>
									<option value="NB">New Brunswick</option>
									<option value="NL">
										Newfoundland and Labrador
									</option>
									<option value="NS">Nova Scotia</option>
									<option value="ON">Ontario</option>
									<option value="PE">
										Prince Edward Island
									</option>
									<option value="QC">Quebec</option>
									<option value="SK">Saskatchewan</option>
									<option value="NT">
										Northwest Territories
									</option>
									<option value="NU">Nunavut</option>
									<option value="YT">Yukon</option>
								</select>
							</div>
						</div>
					</div>
					<div>
						<h3>Skills</h3>
						<div className="form-row">
							<div className="token-input tokenfield col-md-12">
								<input
									type="text"
									className="token-example-field form-control"
									name="skills"
									id="skills"
									placeholder="Mention any noteworthy skills"
									ref={register}
								/>
							</div>
						</div>
					</div>

					<div>
						<button type="submit" className="btn bttnsub btn-group">
							Submit
						</button>
					</div>
				</form>
			</section>
		</Fragment>
	);
}

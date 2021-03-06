import React, { Fragment, useState, useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { baseStyle, activeStyle, acceptStyle, rejectStyle } from "./styles.js";
import { toast } from "react-toastify";

export default function ApplicantForm() {
	const { register, control, handleSubmit } = useForm({
		defaultValues: {
			edu: [
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
			exp: [
				{
					company: "",
					position: "",
					startDate: "",
					endDate: "",
					city: "",
					province: "",
					description: "",
				},
			],
		},
	});

	const {
		fields: edufields,
		append: eduappend,
		remove: eduremove,
	} = useFieldArray({
		control,
		name: "edu",
	});
	const {
		fields: expfields,
		append: expappend,
		remove: expremove,
	} = useFieldArray({
		control,
		name: "exp",
	});

	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [educount, edusetCount] = useState(0);
	const [expcount, expsetCount] = useState(0);

	const onSubmit = async (data, e) => {
		e.preventDefault();
		try {
			const check = await fetch(
				`http://localhost:5000/check/${data.email}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				}
			).then((response) => response.json());

			if (!check) {
				const formData = new FormData();
				formData.append("pdf", selectedFile);

				if (isFilePicked) {
					const res = await fetch("http://localhost:5000/upload", {
						method: "POST",
						body: formData,
					})
						.then((res) => res.json())
						.catch((error) => {
							console.error("Error:", error);
						});
					data.resumelink = res.location;
				}
				await fetch("http://localhost:5000/submitform", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				toast.success("Application Submitted");
			} else {
				toast.error("Application already submitted in the past!");
			}
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
			<section>
				<h1 className="text-center mt-5" id="form">
					Applicant Form
				</h1>
				<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
					<div className="form-row">
						<div className="form-group col-md-4">
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
						<div className="form-group col-md-4">
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
						<div className="form-group col-md-4">
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
						{!isFilePicked && (
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
									Drag 'n' drop resume file here, or click to
									select file
								</p>
								<em>
									(Only *.pdf,*.docx and *.doc files will be
									accepted)
								</em>
							</div>
						)}
						{isFilePicked && (
							<div>
								<label>
									Uploaded file: {acceptedFileItems}
								</label>
								<button
									className="btn btn-outline-danger ml-2"
									onClick={(e) => {
										setIsFilePicked(false)
									}}
								>
									<i className="bi bi-trash"></i>
								</button>
							</div>
						)}
					</div>
					<div className="mt-5">
						<h3>Education</h3>
						<ul className="list-unstyled">
							{edufields.map((item, index) => {
								return (
									<li key={item.id}>
										<div>
											<div className="form-row">
												<div className="form-group col-md-6">
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
												<div className="form-group col-md-3">
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
											<div className="form-group">
												{educount > 0 && (
													<button
														type="button"
														id="removebutton"
														className="btn btn-outline-danger form-control"
														onClick={(e) => {
															eduremove(index);
															edusetCount(
																educount - 1
															);
														}}
													>
														<i className="bi bi-trash"></i>
													</button>
												)}
											</div>
										</div>
									</li>
								);
							})}
						</ul>
						<div className="form-group">
							{educount < 5 && (
								<button
									type="button"
									className="btn btn-outline-success form-control"
									onClick={(e) => {
										eduappend({});
										edusetCount(educount + 1);
									}}
								>
									<i className="bi bi-plus-circle"></i>
								</button>
							)}
						</div>
					</div>
					<div className="mt-5">
						<h3>Experience</h3>
						<ul className="list-unstyled">
							{expfields.map((item, index) => {
								return (
									<li key={item.id}>
										<div className="form-row">
											<div className="form-group col-md-6">
												<label htmlFor="Company">
													Company/Organization Name
												</label>
												<input
													type="text"
													name={`exp[${index}].companyName`}
													defaultValue={
														item.companyName
													}
													className="form-control"
													id="companyName"
													placeholder="ex: Google"
													ref={register()}
												/>
											</div>
											<div className="form-group col-md-6">
												<label htmlFor="Position">
													Position/Title
												</label>
												<input
													type="text"
													name={`exp[${index}].position`}
													defaultValue={item.position}
													className="form-control"
													id="position"
													placeholder="ex: Software Developer"
													ref={register()}
												/>
											</div>
											<div className="form-group col-md-6">
												<label htmlFor="StartDate">
													Start Date
												</label>
												<input
													type="date"
													name={`exp[${index}].startDate`}
													defaultValue={
														item.startDate
													}
													className="form-control"
													id="startDate"
													placeholder="YYYY/MM"
													ref={register()}
												/>
											</div>
											<div className="form-group col-md-6">
												<label htmlFor="EndDate">
													End Date
												</label>
												<input
													type="date"
													name={`exp[${index}].endDate`}
													defaultValue={item.endDate}
													className="form-control"
													id="endDate"
													placeholder="YYYY/MM"
													ref={register()}
												/>
											</div>
										</div>
										<div className="form-row">
											<div className="form-group col-md-6">
												<label htmlFor="City">
													City
												</label>
												<input
													type="text"
													name={`exp[${index}].city`}
													defaultValue={item.city}
													className="form-control"
													id="city"
													ref={register()}
												/>
											</div>
											<div className="form-group col-md-6">
												<label htmlFor="province">
													Province
												</label>
												<select
													id="province"
													name={`exp[${index}].province`}
													defaultValue={item.province}
													className="form-control"
													placeholder=""
													ref={register()}
												>
													<option value="">
														Choose...
													</option>
													<option value="AB">
														Alberta
													</option>
													<option value="BC">
														British Columbia
													</option>
													<option value="MB">
														Manitoba
													</option>
													<option value="NB">
														New Brunswick
													</option>
													<option value="NL">
														Newfoundland and
														Labrador
													</option>
													<option value="NS">
														Nova Scotia
													</option>
													<option value="ON">
														Ontario
													</option>
													<option value="PE">
														Prince Edward Island
													</option>
													<option value="QC">
														Quebec
													</option>
													<option value="SK">
														Saskatchewan
													</option>
													<option value="NT">
														Northwest Territories
													</option>
													<option value="NU">
														Nunavut
													</option>
													<option value="YT">
														Yukon
													</option>
												</select>
											</div>
										</div>
										<div className="form-row">
											<div className="form-group col-md-12">
												<label htmlFor="Description">
													Description
												</label>
												<textarea
													maxLength="5000"
													style={{ height: "150px" }}
													type="textarea"
													name={`exp[${index}].description`}
													defaultValue={
														item.description
													}
													className="form-control"
													id="description"
													placeholder="Talk about your role and responsibilities."
													ref={register()}
												/>
											</div>
										</div>
										<div className="form-group">
											{expcount > 0 && (
												<button
													type="button"
													id="removebutton"
													className="btn btn-outline-danger form-control"
													onClick={(e) => {
														expremove(index);
														expsetCount(
															expcount - 1
														);
													}}
												>
													<i className="bi bi-trash"></i>
												</button>
											)}
										</div>
									</li>
								);
							})}
						</ul>
						<div className="form-group">
							{expcount < 5 && (
								<button
									type="button"
									className="btn btn-outline-success form-control"
									onClick={(e) => {
										expappend({});
										expsetCount(expcount + 1);
									}}
								>
									<i className="bi bi-plus-circle"></i>
								</button>
							)}
						</div>
					</div>

					<div className="mt-5">
						<h3>Skills</h3>
						<div className="form-row mt-3">
							<div className="token-input tokenfield col-md-12">
								<input
									type="text"
									className="form-control token-example-field"
									name="skills"
									id="skills"
									placeholder="Mention any noteworthy skills"
									ref={register}
								/>
							</div>
						</div>
					</div>
					<div className="form-group">
						<button
							type="submit"
							className="btn bttnsub mt-5 col-md-12"
						>
							Submit &gt;
						</button>
					</div>
				</form>
			</section>
		</Fragment>
	);
}

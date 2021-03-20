import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

export default function ApplicantForm() {
  const { register, handleSubmit } = useForm();

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

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
    try {
      const response = await fetch("http://localhost:5000/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Experience</h1>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputCompany">Company/Organization Name</label>
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
            <label htmlFor="inputPosition">Position/Title</label>
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
            <label htmlFor="inputStartDate">Start Date</label>
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
            <label htmlFor="inputDescription">Description</label>
            <input
              style={{height: '200px'}}
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
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NS">Nova Scotia</option>
              <option value="ON">Ontario</option>
              <option value="PE">Prince Edward Island</option>
              <option value="QC">Quebec</option>
              <option value="SK">Saskatchewan</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputCity">Country</label>
            <input
              type="text"
              name="country"
              className="form-control"
              id="inputCountry"
              ref={register}
              required
            />
          </div>
        </div>
      </form>
    </Fragment>
  );
}

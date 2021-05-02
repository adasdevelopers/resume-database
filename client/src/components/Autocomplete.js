import './Autocomplete.css'
import React, { Fragment, useState, useEffect, useRef} from "react";
import { useForm } from "react-hook-form";
import { Typeahead } from 'react-bootstrap-typeahead';
import universities from "./components/universities"
import 'react-bootstrap-typeahead/css/Typeahead.css';


export default function Autocomplete(props){
  
  const {register, handleSubmit} = useForm();
  const [suggestions, setSuggestion] = useState([]);
  const [counter, setCounter] = useState(0);

  const onTextChange = (e) => {
    const {items} = props;
    setSuggestion([]);
    const value = e.target.value;
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, `i`);
      setSuggestion(items.sort().filter(v => regex.test(v)));
    }
  }
 
  const suggestionSelected=(value)=>{
    setSuggestion([]) 
  }
  

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 1
        }}
    />
 );

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const formData = new FormData();

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

  const renderSuggestions = () => {
    console.log("suggestions :",suggestions);
    if (suggestions.length === 0) {
      return null;  
    }
    return (
      <ul>
        {suggestions.slice(0,5).map(uni=>
                                    <option key={uni} onClick={(e)=>suggestionSelected(uni)}>{uni}</option>)}
      </ul>
    )
  }

  return(
    <Fragment>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <ColoredLine color="black" />
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="fname">Institution Name</label>
            <span class="required">*</span>
            <Typeahead 
              id = "basic-typeahead-single"
              labelkey="name"
              onChange={setSuggestion} 
              placeholder="Institution Name" 
              options={universities}
              selected={suggestions}
               />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="startDateSchool">Start Date</label>
            <span class="required">*</span>
            <input
              type="month"
              name="startSchool"
              className="form-control"
              id="startDateSchool"
              placeholder="YYYY/MM"
              ref={register}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="endDateSchool">End Date/Expected Graduation</label>
            <span class="required">*</span>
            <input
              type="month"
              name="endSchool"
              className="form-control"
              id="endDateSchool"
              placeholder="YYYY/MM"
              ref={register}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-3">
            <label htmlFor="degree">Degree</label>
            <span class="required">*</span>
            <select
              id="inputDegree"
              name="degree"
              className="form-control"
              placeholder="Level of Education"
              ref={register}
              required
            >
              <option value="">Choose...</option>
              <option value="HS">High School Diploma</option>
              <option value="PC">Professional Certificate</option>
              <option value="TD">Transfer Degree</option>
              <option value="AD">Associate's Degree</option>
              <option value="BD">Bachelor's Degree</option>
              <option value="MD">Master's Degree</option>
              <option value="DD">Doctoral Degree</option>
              <option value="PD">Professional Degree</option>
              <option value="SD">Specialist Degree</option>
              <option value="OT">Other</option>
            </select>
          </div>   
          <div className="form-group col-md-3">
            <label htmlFor="other">If Other, please specify</label>
            <input
              type="text"
              name="other"
              className="form-control"
              id="other"
              ref={register}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="major">Major(s), Comma Separated</label>
            <input
              type="text"
              name="major"
              className="form-control"
              id="major"
              placeholder="Major(s)"
              ref={register}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="minor">Minor(s), Comma Separated</label>
            <input
              type="text"
              name="minor"
              className="form-control"
              id="minor"
              placeholder="Minor(s)"
              ref={register}
            />
          </div>
        </div>
      </form>
    </Fragment>
  )
}

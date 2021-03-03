import React,{ Fragment } from "react"; 
import './App.css';

import ApplicantForm from "./components/ApplicantForm";

function App() {
  return (
    <Fragment>
      <div className="container">
        <ApplicantForm />
      </div>
    </Fragment>
  );
}

export default App;

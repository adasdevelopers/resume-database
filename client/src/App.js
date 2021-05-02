import React,{ Fragment } from "react"; 
import './App.css';
import universities from "./components/universities"
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApplicantForm from "./components/ApplicantForm";
import Autocomplete from './Autocomplete';

function App() {
  const [inputList, setInputList] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const onAddBtnClick = event => {
    if (inputList.length < 5){
      setInputList(inputList.concat(<Autocomplete items={universities} />));
    }
    if (inputList.length === 4){
      setDisabled(true);
    }
  };

  const onDeleteBtnClick = event => {
    setInputList(prev=>prev.splice(0,prev.length-1));
    if (inputList.length < 5){
      setDisabled(false);
    }
  };
  
  return (
    <Fragment>
      <div className="container">
        <ApplicantForm />
      </div>
      <div className="autocompleter">
        {inputList}
        <Button className="btn btn-success" onClick={onAddBtnClick} disabled={disabled} size="lg" >Add Education (Maximum 5)</Button> {' '}
        <Button className="btn btn-danger" onClick={onDeleteBtnClick} size="lg">Delete Education</Button> 
      </div>
    </Fragment>
  );
}

export default App;

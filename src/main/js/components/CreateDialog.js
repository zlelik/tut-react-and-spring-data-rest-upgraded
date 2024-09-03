import React, { useRef, useCallback } from "react";

const CreateDialog = (props) => {
  const inputRefs = useRef({});

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const newEmployee = {};
    props.attributes.forEach(attribute => {
      newEmployee[attribute] = inputRefs.current[attribute].value.trim();
    });
    props.onCreate(newEmployee);
    props.attributes.forEach(attribute => {
      inputRefs.current[attribute].value = ''; // clear out the dialog's inputs
    });
    window.location = "#";
  }, [props]);

  const inputs = props.attributes.map(attribute => (
    <p key={attribute}>
      <input 
        type="text" 
        placeholder={attribute} 
        ref={el => inputRefs.current[attribute] = el} 
        className="field" 
      />
    </p>
  ));

  return (
    <div>
      <a href="#createEmployee">Create</a>

      <div id="createEmployee" className="modalDialog">
        <div>
          <a href="#" title="Close" className="close">X</a>
          <h2>Create new employee</h2>
          <form>
            {inputs}
            <button onClick={handleSubmit}>Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateDialog;

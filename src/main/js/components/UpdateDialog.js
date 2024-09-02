import React, { useRef, useCallback } from "react";
import ReactDOM from "react-dom";

const UpdateDialog = (props) => {
  const inputRefs = useRef({});

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const updatedEmployee = {};
    props.attributes.forEach(attribute => {
      updatedEmployee[attribute] = inputRefs.current[attribute].value.trim();
    });
    props.onUpdate(props.employee, updatedEmployee);
    window.location = "#";
  }, [props]);

  const inputs = props.attributes.map(attribute => (
    <p key={props.employee.entity[attribute]}>
      <input
        type="text"
        placeholder={attribute}
        defaultValue={props.employee.entity[attribute]}
        ref={el => inputRefs.current[attribute] = el}
        className="field"
      />
    </p>
  ));

  const dialogId = "updateEmployee-" + props.employee.entity._links.self.href;
  const isManagerCorrect = props.employee.entity.manager.name === props.loggedInManager;

  if (!isManagerCorrect) {
    return (
      <div>
        <a>Not Your Employee</a>
      </div>
    );
  } else {
    return (
      <div>
        <a href={"#" + dialogId}>Update</a>

        <div id={dialogId} className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>

            <h2>Update an employee</h2>

            <form>
              {inputs}
              <button onClick={handleSubmit}>Update</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default UpdateDialog;
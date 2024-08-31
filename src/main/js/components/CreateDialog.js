/*
//Original Class Component code.
import React from "react";
import ReactDOM from "react-dom";

class CreateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const newEmployee = {};
    this.props.attributes.forEach(attribute => {
      newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onCreate(newEmployee);
    this.props.attributes.forEach(attribute => {
      ReactDOM.findDOMNode(this.refs[attribute]).value = ''; // clear out the dialog's inputs
    });
    window.location = "#";
  }

  render() {
    const inputs = this.props.attributes.map(attribute =>
      <p key={attribute}>
        <input type="text" placeholder={attribute} ref={attribute} className="field" />
      </p>
    );

    return (
      <div>
        <a href="#createEmployee">Create</a>

        <div id="createEmployee" className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>

            <h2>Create new employee</h2>

            <form>
              {inputs}
              <button onClick={this.handleSubmit}>Create</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default CreateDialog;
*/

//Functional Component code. It is working.
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

/*
//Original Class Component code.
import React from "react";
import UpdateDialog from './UpdateDialog';

class Employee extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.employee);
  }

  render() {
    return (
      <tr>
        <td>{this.props.employee.entity.firstName}</td>
        <td>{this.props.employee.entity.lastName}</td>
        <td>{this.props.employee.entity.description}</td>
        <td>{this.props.employee.entity.manager.name}</td>
        <td>
          <UpdateDialog employee={this.props.employee}
            attributes={this.props.attributes}
            onUpdate={this.props.onUpdate}
            loggedInManager={this.props.loggedInManager} />
        </td>
        <td>
          <button onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    )
  }
}

export default Employee;
*/

//Functional Component code. It is working!
import React, { useCallback } from "react";
import UpdateDialog from './UpdateDialog';

const Employee = (props) => {
  const { employee, attributes, onUpdate, onDelete, loggedInManager } = props;

  const handleDelete = useCallback(() => {
    onDelete(employee);
  }, [onDelete, employee]);

  return (
    <tr>
      <td>{employee.entity.firstName}</td>
      <td>{employee.entity.lastName}</td>
      <td>{employee.entity.description}</td>
      <td>{employee.entity.manager.name}</td>
      <td>
        <UpdateDialog 
          employee={employee}
          attributes={attributes}
          onUpdate={onUpdate}
          loggedInManager={loggedInManager}
        />
      </td>
      <td>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
}

export default Employee;

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

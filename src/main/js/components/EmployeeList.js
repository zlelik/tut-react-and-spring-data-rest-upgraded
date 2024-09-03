import React, { useRef, useCallback } from "react";
import Employee from './Employee';

const EmployeeList = (props) => {
  const pageSizeRef = useRef();

  const handleInput = useCallback((e) => {
    e.preventDefault();
    const pageSize = pageSizeRef.current.value;
    if (/^[0-9]+$/.test(pageSize)) {
      props.updatePageSize(pageSize);
    } else {
      pageSizeRef.current.value = pageSize.substring(0, pageSize.length - 1);
    }
  }, [props]);

  const handleNavFirst = useCallback((e) => {
    e.preventDefault();
    props.onNavigate(props.links.first.href);
  }, [props]);

  const handleNavPrev = useCallback((e) => {
    e.preventDefault();
    props.onNavigate(props.links.prev.href);
  }, [props]);

  const handleNavNext = useCallback((e) => {
    e.preventDefault();
    props.onNavigate(props.links.next.href);
  }, [props]);

  const handleNavLast = useCallback((e) => {
    e.preventDefault();
    props.onNavigate(props.links.last.href);
  }, [props]);

  const pageInfo = props.page.hasOwnProperty("number") ?
    <h3>Employees - Page {props.page.number + 1} of {props.page.totalPages}</h3> : null;

  const employees = props.employees.map(employee =>
    <Employee key={employee.entity._links.self.href}
      employee={employee}
      attributes={props.attributes}
      onUpdate={props.onUpdate}
      onDelete={props.onDelete}
      loggedInManager={props.loggedInManager} />
  );

  const navLinks = [];
  if ("first" in props.links) {
    navLinks.push(<button key="first" onClick={handleNavFirst}>&lt;&lt;</button>);
  }
  if ("prev" in props.links) {
    navLinks.push(<button key="prev" onClick={handleNavPrev}>&lt;</button>);
  }
  if ("next" in props.links) {
    navLinks.push(<button key="next" onClick={handleNavNext}>&gt;</button>);
  }
  if ("last" in props.links) {
    navLinks.push(<button key="last" onClick={handleNavLast}>&gt;&gt;</button>);
  }

  return (
    <div>
      {pageInfo}
      <input ref={pageSizeRef} defaultValue={props.pageSize} onInput={handleInput} />
      <table>
        <tbody>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Description</th>
            <th>Manager</th>
            <th></th>
            <th></th>
          </tr>
          {employees}
        </tbody>
      </table>
      <div>
        {navLinks}
      </div>
    </div>
  );
}

export default EmployeeList;

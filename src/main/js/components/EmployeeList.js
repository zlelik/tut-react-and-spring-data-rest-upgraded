/*
//Original Class Component code.
import React from "react";
import ReactDOM from "react-dom";
import Employee from './Employee';

class EmployeeList extends React.Component {

  constructor(props) {
    super(props);
    this.handleNavFirst = this.handleNavFirst.bind(this);
    this.handleNavPrev = this.handleNavPrev.bind(this);
    this.handleNavNext = this.handleNavNext.bind(this);
    this.handleNavLast = this.handleNavLast.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
    if (/^[0-9]+$/.test(pageSize)) {
      this.props.updatePageSize(pageSize);
    } else {
      ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
    }
  }

  handleNavFirst(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.first.href);
  }

  handleNavPrev(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.prev.href);
  }

  handleNavNext(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.next.href);
  }

  handleNavLast(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.last.href);
  }

  render() {
    const pageInfo = this.props.page.hasOwnProperty("number") ?
      <h3>Employees - Page {this.props.page.number + 1} of {this.props.page.totalPages}</h3> : null;

    const employees = this.props.employees.map(employee =>
      <Employee key={employee.entity._links.self.href}
        employee={employee}
        attributes={this.props.attributes}
        onUpdate={this.props.onUpdate}
        onDelete={this.props.onDelete}
        loggedInManager={this.props.loggedInManager} />
    );

    const navLinks = [];
    if ("first" in this.props.links) {
      navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
    }
    if ("prev" in this.props.links) {
      navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
    }
    if ("next" in this.props.links) {
      navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
    }
    if ("last" in this.props.links) {
      navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
    }

    return (
      <div>
        {pageInfo}
        <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput} />
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
    )
  }
}
export default EmployeeList;
*/

//Functional Component code. It is working!
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

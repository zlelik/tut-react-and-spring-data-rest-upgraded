'use strict';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOMClient from 'react-dom/client';
//import when from 'when';
import client from './client';
import follow from './follow'; // function to hop multiple links by "rel"
import CreateDialog from './components/CreateDialog';
import EmployeeList from './components/EmployeeList';
import stompClient from './websocket-listener';

const root = '/api';

const App = ({ loggedInManager }) => {
  const [employees, setEmployees] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [links, setLinks] = useState({});
  const [schema, setSchema] = useState(null);
  
  const stompClientRef = useRef(null);
  const pageRef = useRef(page);
  const pageSizeRef = useRef(pageSize);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  const loadFromServer = useCallback(async (pageSize) => {
    try {
      // Fetch employee collection
      const employeeCollection = await follow(client, root, [{ rel: 'employees', params: { size: pageSize } }]);

      // Fetch schema
      const schemaResponse = await client({
        method: 'GET',
        path: employeeCollection.entity._links.profile.href,
        headers: { 'Accept': 'application/schema+json' }
      });

      // Filter unneeded JSON Schema properties
      Object.keys(schemaResponse.entity.properties).forEach(property => {
        if (schemaResponse.entity.properties[property].hasOwnProperty('format') && schemaResponse.entity.properties[property].format === 'uri') {
          delete schemaResponse.entity.properties[property];
        } else if (schemaResponse.entity.properties[property].hasOwnProperty('$ref')) {
          delete schemaResponse.entity.properties[property];
        }
      });

      setSchema(schemaResponse.entity);

      setLinks(employeeCollection.entity._links);

      // Set page
      setPage(employeeCollection.entity.page);

      // Fetch employees
      const employeePromises = employeeCollection.entity._embedded.employees.map(employee =>
        client({ method: 'GET', path: employee._links.self.href })
      );

      // Wait for all employee requests to resolve
      const employees = await Promise.all(employeePromises);

      setEmployees(employees);

      if ((schemaResponse) && (schemaResponse.entity) && (schemaResponse.entity.properties)) {
        setAttributes(Object.keys(schemaResponse.entity.properties));
      }
      setPageSize(pageSize);
    } catch (error) {
      console.error("Failed to load from server: ", error);
    }
  }, [links, schema]);

  const onCreate = useCallback(async (newEmployee) => {
    try {
      // Follow the client to the 'employees' link
      const response = await follow(client, root, ['employees']);
      
      // Make a POST request to create a new employee
      await client({
        method: 'POST',
        path: response.entity._links.self.href,
        entity: newEmployee,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error creating employee: ', error);
    }
  }, []);

  const onUpdate = useCallback(async (employee, updatedEmployee) => {
    if (employee.entity.manager.name === loggedInManager) {
      updatedEmployee["manager"] = employee.entity.manager;

      try {
        const response = await client({
          method: 'PUT',
          path: employee.entity._links.self.href,
          entity: updatedEmployee,
          headers: {
            'Content-Type': 'application/json',
            'If-Match': employee.headers.Etag
          }
        });

      } catch (error) {
        if (error.status.code === 403) {
          alert('ACCESS DENIED: You are not authorized to update ' + employee.entity._links.self.href);
        } else if (error.status.code === 412) {
          alert('DENIED: Unable to update ' + employee.entity._links.self.href + '. Your copy is stale.');
        }
      }
    } else {
      alert("You are not authorized to update");
    }
  }, [loggedInManager]);
  
  const onDelete = useCallback(async (employee) => {
    try {
      const response = await client({ method: 'DELETE', path: employee.entity._links.self.href });
    } catch (error) {
      if (error.status.code === 403) {
        alert('ACCESS DENIED: You are not authorized to delete ' + employee.entity._links.self.href);
      }
    }
  }, []);
  
  const onNavigate = useCallback(async (navUri) => {
    try {
      // Fetch the employee collection
      const employeeCollection = await client({ method: 'GET', path: navUri });

      // Update the links and page state
      setLinks(employeeCollection.entity._links);
      setPage(employeeCollection.entity.page);

      // Fetch individual employee data
      const employeePromises = employeeCollection.entity._embedded.employees.map(employee =>
        client({ method: 'GET', path: employee._links.self.href })
      );

      // Wait for all employee requests to resolve
      const employeesArg = await Promise.all(employeePromises);

      // Update the employees state
      setEmployees(employeesArg);
    } catch (error) {
      console.error("onNavigate error: ", error);
    }
  }, []);

  const updatePageSize = useCallback((newPageSize) => {
    if (newPageSize !== pageSize) {
      loadFromServer(newPageSize);
    }
  }, [loadFromServer, pageSize]);

  const refreshAndGoToLastPage = useCallback(async () => {
    try {
      // Follow the client to get the employee collection
      const response = await follow(client, root, [{ rel: 'employees', params: { size: pageSize } }]);
      
      // Navigate to the last page if it exists, otherwise to the current page
      if (response.entity._links.last !== undefined) {
        await onNavigate(response.entity._links.last.href);
      } else {
        await onNavigate(response.entity._links.self.href);
      }
    } catch (error) {
      console.error("Error in refreshAndGoToLastPage: ", error);
    }
  }, []);

  const refreshCurrentPage = useCallback(async () => {
    // Access current values from refs
    const currentPage = pageRef.current;
    const currentPageSize = pageSizeRef.current;

    try {
      // Follow the client to get the employee collection
      const employeeCollection = await follow(client, root, [{ rel: 'employees', params: { size: currentPageSize, page: currentPage.number } }]);

      // Update state with links and page information
      setLinks(employeeCollection.entity._links);
      setPage(employeeCollection.entity.page);

      // Fetch individual employee details
      const employeePromises = employeeCollection.entity._embedded.employees.map(employee =>
        client({ method: 'GET', path: employee._links.self.href })
      );

      // Resolve all employee promises
      const employees = await Promise.all(employeePromises);

      // Update state with employee data
      setEmployees(employees);
    } catch (error) {
      console.error("Error in refreshCurrentPage: ", error);
    }
  }, [pageRef, pageSizeRef]);

  
  useEffect(() => {
    loadFromServer(pageSize);
    if (stompClientRef.current === null) {
      const routes = [
        { route: '/topic/newEmployee', callback: refreshAndGoToLastPage },
        { route: '/topic/updateEmployee', callback: () => { refreshCurrentPage(); } },
        { route: '/topic/deleteEmployee', callback: () => { refreshCurrentPage(); } }
      ];

      stompClient.register(routes);
      stompClientRef.current = stompClient;
      stompClientRef.current.routes = routes; // Store the routes in the ref
    }
  }, []);

  return (
    <div>
      <CreateDialog attributes={attributes} onCreate={onCreate} />
      <EmployeeList
        page={page}
        employees={employees}
        links={links}
        pageSize={pageSize}
        attributes={attributes}
        onNavigate={onNavigate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        updatePageSize={updatePageSize}
        loggedInManager={loggedInManager}
      />
    </div>
  );
};

const rootElement = document.getElementById('react');
const rootReactElement = ReactDOMClient.createRoot(rootElement);
rootReactElement.render(<App loggedInManager={document.getElementById('managername').innerHTML} />);

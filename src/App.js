// src/App.js
import React, { useState, useEffect } from 'react';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import './App.css';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Fetch employee data from the server on component mount
    fetch('/api/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employee data', error));
  }, []);

  const saveEmployee = (employee) => {
    if (!employee) {
      console.error('Error: Employee object is null or undefined.');
      return;
    }

    const isNewEmployee = !employee.id;

    // Save employee data to the server
    fetch(isNewEmployee ? '/api/employees' : `/api/employees/${employee.id}`, {
      method: isNewEmployee ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    })
      .then((response) => response.json(),
      console.log(employee))
      .then((updatedEmployee) => {
        setEmployees((prevEmployees) =>
          isNewEmployee
            ? [...prevEmployees, updatedEmployee]
            : prevEmployees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
        setIsAdding(false);
        setSelectedEmployee(null);
      })
      .catch((error) => console.error('Error saving employee data', error));
  };

  const editEmployee = (employee) => {
    setIsAdding(true);
    setSelectedEmployee(employee);
  };

  const deleteEmployee = (employeeId) => {
    // Delete employee data on the server
    fetch(`/api/employees/${employeeId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Update the state by removing the deleted employee
          setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== employeeId));
        } else {
          console.error('Error deleting employee data');
        }
      })
      .catch((error) => console.error('Error deleting employee data', error));
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="app">
      <h1>Employee Management System</h1>
      {isAdding || selectedEmployee ? (
        <EmployeeForm onSave={saveEmployee} onCancel={cancelEdit} employeeData={selectedEmployee} />
      ) : (
        <button onClick={() => setIsAdding(true)}>Add Employee</button>
      )}
            <EmployeeList employees={employees} onEdit={editEmployee} onDelete={deleteEmployee} />

    </div>
  );
};

export default App;

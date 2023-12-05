// src/components/Employee.js
import React from 'react';
import './Employee.css';

const Employee = ({ employee, onEdit, onDelete }) => {
  const handleEdit = () => {
    // Call the onEdit function and pass the employee object
    onEdit(employee);
  };

  return (
    <div className="employee-card">
      <h3>ID: {employee.id}</h3>
      <p>Name: {employee.name}</p>
      <p>Email: {employee.email}</p>
      <p>CNIC: {employee.cnic}</p>
      <p>Address: {employee.address}</p>
      <button className="edit-button" onClick={handleEdit}>Edit</button>
      <button className="delete-button" onClick={() => onDelete(employee.id)}>Delete</button>
    </div>
  );
};

export default Employee;
 
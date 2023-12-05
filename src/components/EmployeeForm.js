// src/components/EmployeeForm.js
import React, { useState, useEffect } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ onSave, onCancel, employeeData }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    cnic: '',
    address: '',
  });

  // Update form data when employeeData changes
  useEffect(() => {
    if (employeeData) {
      setFormData({
        id: employeeData.id || '',
        name: employeeData.name || '',
        email: employeeData.email || '',
        cnic: employeeData.cnic || '',
        address: employeeData.address || '',
      });
    }
  }, [employeeData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Validate form data before saving (optional)

    // Call the onSave function with the form data
    onSave(formData);
  };

  return (
    <div className="employee-form">

      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} />

      <label>Email:</label>
      <input type="text" name="email" value={formData.email} onChange={handleChange} />

      <label>CNIC:</label>
      <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} />

      <label>Address:</label>
      <input type="text" name="address" value={formData.address} onChange={handleChange} />

      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EmployeeForm;

// App.js

import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file for styling

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    hobbies: '',
  });

  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (
        formData.name &&
        formData.phoneNumber &&
        formData.email &&
        formData.hobbies
      ) {
        const response = await fetch('/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const newUser = await response.json();
          setTableData([...tableData, newUser]);
          setFormData({ name: '', phoneNumber: '', email: '', hobbies: '' });
        } else {
          console.error('Server error:', response.statusText);
          alert('Failed to save user');
        }
      } else {
        alert('Please fill in all fields');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save user. Please check console for more details.');
    }
  };

  const handleDelete = async () => {
    const updatedTableData = tableData.filter(
      (item) => !selectedRows.includes(item.id)
    );
    try {
      const response = await fetch('/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRows),
      });

      if (response.ok) {
        setTableData(updatedTableData);
        setSelectedRows([]);
      } else {
        alert('Failed to delete user(s)');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/users');
        if (response.ok) {
          const users = await response.json();
          setTableData(users);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };



  return (
    <div className="container">
      <h1 className="title">CRUDS using React</h1>
      <div className="form-container">
        <h2>Please fill the form:</h2>
        <div className="form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-field"
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input-field"
          />
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
          />
          <input
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            placeholder="Hobbies"
            className="input-field"
          />
          <button onClick={handleSave} className="save-button">Save</button>
        </div>
      </div>
      <div className="table-container">
        <h2>Registered Entry:</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Hobbies</th>
              <th>Update/Delete</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleRowSelect(item.id)}
                    checked={selectedRows.includes(item.id)}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.email}</td>
                <td>{item.hobbies}</td>
                <td>
                  <button>Update</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-buttons">
          <button onClick={handleDelete} className="delete-button">Delete</button>
          <button className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};



export default App;

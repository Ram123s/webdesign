import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUsers(res.data); // initialize filterUsers with all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // search function
  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers); // update filterUsers instead of users
  };

  // delete function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:8000/users/${id}`);
        setUsers(res.data);
        setFilterUsers(res.data);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // add user details
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModelOpen(true);
  };

  // handle form input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  // handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (userData.id) {
        await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
      } else {
        await axios.post("http://localhost:8000/users", userData);
      }
      getAllUsers(); // Refresh user list
      handleCloseModal(); // Close modal
      setUserData({ name: "", age: "", city: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  // handle close modal
  const handleCloseModal = () => {
    setIsModelOpen(false);
  };

  // update user function
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js FE & Node.js BE</h3>
        <div className="input-search">
          <input type="search" placeholder='Search Text Here' onChange={handleSearchChange} />
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers &&
              filterUsers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td>
                      <button className='btn green' onClick={() => handleUpdateRecord(user)}>Edit</button>
                      <button onClick={() => handleDelete(user.id)} className='btn red'>Delete</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

        {
          isModelOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <h3>User Record</h3>
                <div className="input-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" value={userData.name} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input type="number" id="age" name="age" value={userData.age} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={userData.city} onChange={handleInputChange} />
                </div>
                <button className="btn green" onClick={handleSubmit}>
                  {userData.id ? "Update User" : "Add User"}
                </button>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
}

export default App;

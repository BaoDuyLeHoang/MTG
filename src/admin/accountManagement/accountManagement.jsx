import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import './accountManagement.css';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Fetch accounts data from your API
    // This is just example data
    const fetchedAccounts = [
      { userId: 1, username: 'john_doe', email: 'john@example.com', roles: ['Manager'], status: 'Active' },
      { userId: 2, username: 'jane_smith', email: 'jane@example.com', roles: ['Manager'], status: 'Active' },
      { userId: 3, username: 'bob_johnson', email: 'bob@example.com', roles: ['Manager'], status: 'Inactive' },
    ];
    setAccounts(fetchedAccounts);
  }, []);

  return (
    <div className="account-management-container">
      <Sidebar />
      <div className="account-management-content">
        <h1>Account Management</h1>
        <table className="account-management-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email Address</th>
              <th>User Roles</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.userId}>
                <td>{account.userId}</td>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.roles.join(', ')}</td>
                <td className={account.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {account.status}
                </td>
                <td>
                  <button>Edit</button>
                  <button className='button-delete'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;

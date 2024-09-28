import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import './accountManagement.css';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Fetch accounts data from your API
    // This is just example data
    const fetchedAccounts = [
      { userId: 1, username: 'Nguyễn Văn A', email: 'john@example.com', roles: ['Quản lý'], status: 'Hoạt động' },
      { userId: 2, username: 'Nguyễn Văn B', email: 'jane@example.com', roles: ['Quản lý'], status: 'Hoạt động' },
      { userId: 3, username: 'Nguyễn Văn C', email: 'bob@example.com', roles: ['Quản lý'], status: 'Không hoạt động' },
    ];
    setAccounts(fetchedAccounts);
  }, []);

  return (
    <div className="account-management-container">
      <Sidebar />
      <div className="account-management-content">
        <h1>Quản lý tài khoản</h1>
        <table className="account-management-table">
          <thead>
            <tr>
              <th>ID người dùng</th>
              <th>Tên người dùng</th>
              <th>Địa chỉ email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.userId}>
                <td>{account.userId}</td>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.roles.join(', ')}</td>
                <td className={account.status === 'Hoạt động' ? 'status-active' : 'status-inactive'}>
                  {account.status}
                </td>
                <td>
                  <button id="edit-button">Sửa</button>
                  <button className='button-delete' id="delete-button">Xóa</button>
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

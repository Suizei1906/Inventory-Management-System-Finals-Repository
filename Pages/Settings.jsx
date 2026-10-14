// src/pages/Settings.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { canViewAllUsers } from "../config/permissions";

export default function Settings() {
  const { user, users } = useContext(AppContext);
  const showAllUsers = canViewAllUsers(user?.Role);

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>

      <div className="panel">
        <h2 className="panel-title">My Account</h2>
        {user ? (
          <div className="account-details">
            <div>
              <span className="account-detail-label">User ID</span>
              <span>{user.UserID}</span>
            </div>
            <div>
              <span className="account-detail-label">Username</span>
              <span>{user.UserName}</span>
            </div>
            <div>
              <span className="account-detail-label">Role</span>
              <span>{user.Role}</span>
            </div>
          </div>
        ) : (
          <p className="empty-cell">Not logged in.</p>
        )}
      </div>

      <div className="panel">
        <h2 className="panel-title">All Users</h2>
        {showAllUsers ? (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.UserID}>
                      <td>{u.UserID}</td>
                      <td>{u.UserName}</td>
                      <td>{u.Role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="readonly-note">
              Contact your administrator to change account details.
            </p>
          </>
        ) : (
          <p className="empty-cell">Only Admins can view the full user directory.</p>
        )}
      </div>
    </div>
  );
}

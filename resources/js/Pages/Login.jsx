import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    UserName: "",
    Password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    post("/login");
  }

  const error = errors.UserName || errors.Password;

  return (
    <div className="login-page">
      <Head title="Log in" />
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">⚡</span>
          <h1>WalangBrownout</h1>
          <p>Inventory Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              type="text"
              value={data.UserName}
              onChange={(e) => setData("UserName", e.target.value)}
              placeholder="Enter username"
              autoFocus
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={data.Password}
              onChange={(e) => setData("Password", e.target.value)}
              placeholder="Enter password"
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={processing}>
            Log In
          </button>
        </form>

        <p className="login-hint">
          Demo accounts: admin/admin123 · juan/juan123 · maria/maria123 · pedro/pedro123
        </p>
        <p className="login-hint">
          Don't have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
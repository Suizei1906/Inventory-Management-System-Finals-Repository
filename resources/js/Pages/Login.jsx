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

  const error = errors.UserName || errors.Password || errors.login;

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
          <label htmlFor="username">
            Username
            <input
              id="username"
              name="UserName"
              type="text"
              value={data.UserName}
              onChange={(e) => setData("UserName", e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
              required
            />
          </label>

          <label htmlFor="password">
            Password
            <input
              id="password"
              name="Password"
              type="password"
              value={data.Password}
              onChange={(e) => setData("Password", e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={processing}
          >
            {processing ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="login-hint">
          Don't have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

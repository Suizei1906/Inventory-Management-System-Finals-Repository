import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";

const ROLES = ["Warehouse Staff", "Purchasing Manager", "Sales Staff"];

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", className: "" };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", className: "strength-weak" };
  if (score <= 2) return { score: 2, label: "Fair", className: "strength-fair" };
  if (score <= 3) return { score: 3, label: "Good", className: "strength-good" };
  return { score: 4, label: "Strong", className: "strength-strong" };
}

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [error, setError] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle"); // idle | checking | available | taken

  // Live username availability check against the backend (debounced).
  useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/username-available?username=${encodeURIComponent(trimmed)}`,
          { headers: { Accept: "application/json" }, signal: controller.signal }
        );
        const body = await res.json();
        setUsernameStatus(body.available ? "available" : "taken");
      } catch {
        /* aborted or offline — server validates again on submit anyway */
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a username");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // The server re-checks the username and validates everything again.
    router.post(
      "/signup",
      {
        UserName: trimmedUsername,
        Password: password,
        Password_confirmation: confirmPassword,
        Role: role,
      },
      {
        onError: (errors) => setError(Object.values(errors)[0] || "Sign up failed"),
      }
    );
  }

  return (
    <div className="login-page">
      <Head title="Sign up" />
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">⚡</span>
          <h1>WalangBrownout</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoFocus
              className={
                usernameStatus === "taken"
                  ? "input-invalid"
                  : usernameStatus === "available"
                  ? "input-valid"
                  : ""
              }
            />
            {usernameStatus === "checking" && (
              <span className="field-hint field-hint-neutral">Checking availability…</span>
            )}
            {usernameStatus === "available" && (
              <span className="field-hint field-hint-good">✓ Username is available</span>
            )}
            {usernameStatus === "taken" && (
              <span className="field-hint field-hint-bad">✕ That username is already taken</span>
            )}
          </label>

          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label>
            Password
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
            />
            {password.length > 0 && (
              <div className="strength-meter">
                <div className="strength-meter-track">
                  <div
                    className={`strength-meter-fill ${strength.className}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
                <span className={`strength-label ${strength.className}`}>
                  {strength.label}
                </span>
              </div>
            )}
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              required
              minLength={4}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={
                passwordsMismatch
                  ? "input-invalid"
                  : passwordsMatch
                  ? "input-valid"
                  : ""
              }
            />
            {passwordsMatch && (
              <span className="field-hint field-hint-good">✓ Passwords match</span>
            )}
            {passwordsMismatch && (
              <span className="field-hint field-hint-bad">✕ Passwords do not match</span>
            )}
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit-btn">
            Create Account
          </button>
        </form>

        <p className="login-hint">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
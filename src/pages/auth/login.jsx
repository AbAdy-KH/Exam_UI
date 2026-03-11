import { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import "./login.css";

const API = import.meta.env.VITE_API_URL;

async function login(username, password) {
    try {
        const response = await axios.post(API + "/api/Auth/login", {
            username,
            password,
        });

        return { ok: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.errors ||
            error.response?.data?.message ||
            "Login failed";

        return { ok: false, message };
    }
}

function LoginHeader() {
    return (
            <header className="login-header">
                <div className="login-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                    </svg>
                </div>

                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Login to your account</p>
            </header>
    )
}

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        const result = await login(username, password);

        if (!result.ok) {
            setError(result.message);
            return;
        }

        localStorage.setItem("token", JSON.stringify(result.data));
        window.location.href = "/home";
    };

    return (
        <div className="login-card">
            <LoginHeader />

            {error && <p className="login-error">{error}</p>}

            <div className="login-field">
                <label>Username</label>
                <div className="login-input-wrapper">
                    <input
                        type="text"
                        placeholder="khaled"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
            </div>

            <div className="login-field">
                <label>Password</label>
                <div className="login-input-wrapper">
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <button className="login-button" onClick={handleLogin}>
                Login
            </button>

            <Link className="register-link" to="/register">
                <span className="register-text">Register</span>
            </Link>
        </div>
    );
}

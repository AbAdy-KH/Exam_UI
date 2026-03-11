import { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import "./register.css";

const API = import.meta.env.VITE_API_URL;

// ================= API ================= //
async function register(registrationData, setError) {
    try {
        await axios.post(API + "/api/Auth/register", {
            fullname: registrationData.fullname,
            username: registrationData.username,
            email: registrationData.email,
            password: registrationData.password,
        }, 
        { 
            headers: { "Content-Type": "application/json" }
        });

        return {ok: true}

    } catch (error) {
        setError(
            error.response?.data?.errors ||
            error.response?.data?.message ||
            "Registration failed. Please try again."
        );

        return {ok: false, message: error.message};
    }
}

// ================= COMPONENTS ================= //
function RegisterHeader() {
    return (
            <header className="register-header">
                <div className="register-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14"
                        />
                    </svg>
                </div>

                <h2 className="register-title">Create Account</h2>
                <p className="register-subtitle">Register a new account</p>
            </header>
    );
}

function Field({ label, ...props }) {
    return (
        <div className="register-field">
            <label>{label}</label>
            <input {...props} />
        </div>
    );
}
function RegisterForm({ formData, handleChange, handleRegister })
{
    return (
                <div className="register-form">
                <Field
                    label="Full Name"
                    name="fullname"
                    type="text"
                    placeholder="Abdulrahman Khaled"
                    value={formData.fullname}
                    onChange={handleChange}
                />

                <Field
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="abdalrhman"
                    value={formData.username}
                    onChange={handleChange}
                />

                <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                />

                <Field
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                />

                <Field
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <button
                    className="register-button"
                    onClick={handleRegister}
                >
                    Create Account
                </button>
            </div>
    );
}

// ================= Register Page ================= //
export function RegisterPage() {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        setError("");

        const { fullname, username, email, password, confirmPassword } = formData;

        if (!fullname || !username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        let res = await register({ fullname, username, email, password }, setError);

        if(res) navigate(`/`);
        else setError(res.message);
    };

    return (
        <div className="register-card">

            <RegisterHeader />

            {error && <p className="register-error">{error}</p>}

            <RegisterForm
                formData={formData}
                handleChange={handleChange}
                handleRegister={handleRegister}
            />

            <Link to="/" className="register-login-link">
                Already have an account? Login
            </Link>
        </div>
    );
}


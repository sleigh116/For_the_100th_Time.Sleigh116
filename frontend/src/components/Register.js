// frontend/src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!name || !email || !password) {
            setError('All fields are required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            const response = await auth.register(name, email, password);
            if (response.success) {
                navigate('/login');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (error) {
            if (error.message === 'Network Error') {
                setError('Cannot connect to the server. Please make sure the backend server is running.');
            } else {
                setError(error.message || 'Registration failed. Please try again.');
            }
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="auth-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default Register;
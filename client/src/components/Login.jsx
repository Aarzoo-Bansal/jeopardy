import { useState } from 'react';
import { useNavigate, Link, UNSAFE_getTurboStreamSingleFetchDataStrategy } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticlesBg from './ParticlesBg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            login(data.token, data.user);
            navigate('/admin');
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0f',
            position: 'relative'
        }}>
            <ParticlesBg />

            <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '48px',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Title */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                    textAlign: 'center'
                }}>
                    Welcome Back
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    textAlign: 'center',
                    marginBottom: '32px',
                    fontSize: '0.9rem'
                }}>
                    Sign in to manage your questions
                </p>

                {/* Error message */}
                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: '#ef4444',
                        marginBottom: '24px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Email */}
                    <div>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                            fontSize: '0.9rem'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '8px',
                            fontSize: '0.9rem'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px 48px 12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.7)',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? (
                                    // Eye with slash — hide password
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    // Open eye — show password
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading
                                ? 'rgba(168,85,247,0.4)'
                                : 'linear-gradient(135deg, #06b6d4, #a855f7)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>

                {/* Link to signup */}
                <p style={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.9)',
                    marginTop: '24px',
                    fontSize: '0.9rem'
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{
                        color: '#06b6d4',
                        textDecoration: 'none',
                        fontWeight: 600
                    }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
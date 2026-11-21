import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminLogin.css';

// ─── Admin credentials ──────────────────────────────
const ADMIN_USERNAME = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
// ────────────────────────────────────────────────────

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate a slight delay for UX
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                localStorage.setItem('admin_authenticated', 'true');
                navigate('/admin');
            } else {
                setError('Invalid credentials. Please try again.');
                setLoading(false);
                setShake(true);
                setTimeout(() => setShake(false), 600);
            }
        }, 800);
    };

    return (
        <div className="admin-login-page">
            {/* Background blobs */}
            <div className="login-bg-blob blob-1" />
            <div className="login-bg-blob blob-2" />

            <motion.div
                className={`admin-login-card ${shake ? 'shake' : ''}`}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Header */}
                <div className="login-header">
                    <div className="login-shield-wrap">
                        <Shield size={36} className="login-shield-icon" />
                    </div>
                    <h1>Admin Portal</h1>
                    <p>Restricted access. Authorized personnel only.</p>
                </div>

                {/* Form */}
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-field">
                        <label>Username</label>
                        <div className="login-input-wrap">
                            <User size={18} className="login-input-icon" />
                            <input
                                type="text"
                                placeholder="Enter admin username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label>Password</label>
                        <div className="login-input-wrap">
                            <Lock size={18} className="login-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="show-pass-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                className="login-error"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                            >
                                ⚠️ {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? (
                            <span className="login-spinner" />
                        ) : (
                            <><Shield size={18} /> Access Admin Panel</>
                        )}
                    </button>
                </form>

                {/* Footer hint */}
                <div className="login-footer">
                    <Sparkles size={14} />
                    <span>FuturePath · Admin v2.0</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

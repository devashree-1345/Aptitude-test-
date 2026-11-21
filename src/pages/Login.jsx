import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Login.css';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let userCredential;
            
            if (isSignUp) {
                // Sign Up
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Create user document in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    email: email,
                    name: email.split('@')[0], // Extract name from email
                    createdAt: new Date().toISOString(),
                    testResults: [],
                    careerProfile: null
                });
                
                if (onLogin) onLogin(email.split('@')[0]);
            } else {
                // Sign In
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                if (onLogin) onLogin(user.email.split('@')[0]);
            }
            
            navigate('/test');
        } catch (error) {
            console.error('Authentication error:', error);
            setError(error.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <motion.div
                className="login-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p>{isSignUp ? 'Sign up to start your journey' : 'Sign in to continue your journey'}</p>

                {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleAuth}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="student@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required 
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <span 
                            className="link" 
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{ cursor: 'pointer', marginLeft: '5px' }}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

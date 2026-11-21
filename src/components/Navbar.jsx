import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Sun, Moon, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ toggleTheme, theme, isAuthenticated, userName, logout }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon-wrap">
                        <Zap className="logo-icon" size={20} />
                    </div>
                    <span className="logo-text">Future<span className="logo-accent">Path</span></span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {/* Route-based links */}
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' && !window.location.hash ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/test"
                        className={`nav-link ${location.pathname === '/test' ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Aptitude Test
                    </Link>

                    {/* Hash anchor links — use plain <a> for native scroll */}
                    <a
                        href="#features"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            setMenuOpen(false);
                            const el = document.getElementById('features');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Features
                    </a>
                    <a
                        href="#colleges"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            setMenuOpen(false);
                            const el = document.getElementById('colleges');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Colleges
                    </a>


                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {isAuthenticated ? (
                        <div className="nav-auth">
                            <span className="user-greeting">👋 {userName}</span>
                            <button onClick={logout} className="nav-btn nav-btn-outline">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-btn nav-btn-glow" onClick={() => setMenuOpen(false)}>
                            Get Started
                        </Link>
                    )}
                </div>

                <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

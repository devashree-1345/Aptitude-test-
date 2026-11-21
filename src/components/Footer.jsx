import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-glow" />
            <div className="footer-inner container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <div className="footer-logo-icon"><Zap size={18} /></div>
                        <span>Future<span className="logo-accent">Path</span></span>
                    </Link>
                    <p className="footer-tagline">
                        Empowering students across India to discover their ideal career with AI-powered aptitude assessments.
                    </p>
                    <div className="footer-socials">
                        <a href="#" aria-label="Twitter" className="social-btn"><Twitter size={16} /></a>
                        <a href="#" aria-label="Instagram" className="social-btn"><Instagram size={16} /></a>
                        <a href="#" aria-label="LinkedIn" className="social-btn"><Linkedin size={16} /></a>
                        <a href="#" aria-label="GitHub" className="social-btn"><Github size={16} /></a>
                    </div>
                </div>

                <div className="footer-links-col">
                    <h4 className="footer-heading">Platform</h4>
                    <ul>
                        <li><Link to="/test">Aptitude Test</Link></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#colleges">Colleges</a></li>
                        <li><Link to="/login">Student Login</Link></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h4 className="footer-heading">Career Streams</h4>
                    <ul>
                        <li><a href="#">Engineering & Tech</a></li>
                        <li><a href="#">Medical & Science</a></li>
                        <li><a href="#">Business & Finance</a></li>
                        <li><a href="#">Design & Creative</a></li>
                        <li><a href="#">Data Science & AI</a></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h4 className="footer-heading">Contact</h4>
                    <ul className="contact-list">
                        <li><Mail size={14} /><span>support@futurepath.in</span></li>
                        <li><Phone size={14} /><span>+91 98765 43210</span></li>
                        <li><MapPin size={14} /><span>Bangalore, India</span></li>
                    </ul>
                    <div className="footer-newsletter">
                        <input type="email" placeholder="Your email…" />
                        <button className="newsletter-btn">Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>© 2025 FuturePath. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

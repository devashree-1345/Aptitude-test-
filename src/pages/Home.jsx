import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    ChevronRight, Brain, Target, Lightbulb, Users, TrendingUp,
    Award, BookOpen, Star, MapPin, ArrowRight, Sparkles,
    BarChart2, CheckCircle, Zap, Globe, Shield, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

/* ── helpers ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
});

const stagger = {
    initial: {},
    whileInView: {},
    viewport: { once: true },
};

/* ── data ── */
const features = [
    { icon: Brain, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', title: 'AI-Powered Assessment', desc: 'Smart algorithms adapt questions to your skill level in real-time.' },
    { icon: Target, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', title: 'Precision Career Mapping', desc: 'Data-driven insights map you to careers where you\'ll truly thrive.' },
    { icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.12)', title: 'Performance Analytics', desc: 'Visual dashboards show your strengths, gaps and growth over time.' },
    { icon: Award, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', title: 'Certified Results', desc: 'Shareable certificates trusted by 500+ colleges and recruiters.' },
    { icon: Globe, color: '#ec4899', bg: 'rgba(236,72,153,0.12)', title: 'Industry Connections', desc: 'Direct pathways to internships and campus placement drives.' },
    { icon: Shield, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', title: 'Expert Mentorship', desc: 'One-on-one guidance from professionals in 30+ career streams.' },
];

const colleges = [
    { name: 'IIT Bombay', location: 'Mumbai, Maharashtra', tag: 'Engineering & Tech', rank: '#1 NIRF', color: '#7c3aed' },
    { name: 'NIT Trichy', location: 'Tiruchirappalli, Tamil Nadu', tag: 'Engineering', rank: '#10 NIRF', color: '#06b6d4' },
    { name: 'BITS Pilani', location: 'Pilani, Rajasthan', tag: 'Science & Tech', rank: 'Top Private', color: '#10b981' },
    { name: 'VIT Vellore', location: 'Vellore, Tamil Nadu', tag: 'Engineering', rank: '#9 Private', color: '#f59e0b' },
    { name: 'IIIT Hyderabad', location: 'Hyderabad, Telangana', tag: 'IT & AI', rank: '#11 NIRF', color: '#ec4899' },
    { name: 'Christ University', location: 'Bengaluru, Karnataka', tag: 'Liberal Arts', rank: 'A++ NAAC', color: '#8b5cf6' },
    { name: 'Symbiosis Pune', location: 'Pune, Maharashtra', tag: 'Management & Law', rank: 'Top 5 Private', color: '#06b6d4' },
    { name: 'Manipal Institute', location: 'Manipal, Karnataka', tag: 'Multi-Discipline', rank: 'Top 10 Private', color: '#7c3aed' },
];

const testimonials = [
    { name: 'Priya Sharma', role: 'B.Tech CSE, IIT Delhi', text: 'FuturePath pinpointed my love for data science before I even knew it! The dashboard is stunning and the career match was spot-on.', stars: 5, avatar: 'PS', color: '#7c3aed' },
    { name: 'Arjun Mehta', role: 'MBA, IIM Ahmedabad', text: 'I was confused between engineering and management. This platform\'s aptitude mapping made the decision crystal clear for me.', stars: 5, avatar: 'AM', color: '#06b6d4' },
    { name: 'Sneha Reddy', role: 'B.Sc Psychology, Delhi University', text: 'The career guidance section is incredible. Found my passion for organizational psychology through one test!', stars: 5, avatar: 'SR', color: '#10b981' },
    { name: 'Karan Patel', role: 'B.Com, Symbiosis Pune', text: 'Loved the animations and the UI. The test was engaging unlike anything I have seen. Got placed at Deloitte through connections here!', stars: 5, avatar: 'KP', color: '#f59e0b' },
];

const careerStreams = [
    { label: 'Engineering & Tech', icon: '⚙️' },
    { label: 'Medical & Life Science', icon: '🔬' },
    { label: 'Business & Finance', icon: '📈' },
    { label: 'Design & Arts', icon: '🎨' },
    { label: 'Law & Policy', icon: '⚖️' },
    { label: 'Data Science & AI', icon: '🤖' },
    { label: 'Education & Research', icon: '📚' },
    { label: 'Media & Journalism', icon: '📰' },
];

const skillBars = [
    { label: 'Logical Reasoning', value: 88, color: '#7c3aed' },
    { label: 'Verbal Ability', value: 72, color: '#06b6d4' },
    { label: 'Quantitative Aptitude', value: 65, color: '#10b981' },
    { label: 'Spatial Intelligence', value: 79, color: '#f59e0b' },
];

/* ─────────────── COMPONENT ─────────────── */
const Home = ({ isAuthenticated }) => {
    const [animateBars, setAnimateBars] = useState(false);
    const dashRef = useRef(null);
    const isDashInView = useInView(dashRef, { once: true });

    useEffect(() => {
        if (isDashInView) setAnimateBars(true);
    }, [isDashInView]);

    console.log('Home component is rendering');

    return (
        <div className="home-page">
            {/* ═══════ HERO ═══════ */}
            <section className="hero">
                {/* Background orbs */}
                <div className="hero-orb orb-1" />
                <div className="hero-orb orb-2" />
                <div className="hero-orb orb-3" />

                {/* Floating particles */}
                {[...Array(14)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${8 + Math.random() * 10}s`,
                        width: `${4 + Math.random() * 6}px`,
                        height: `${4 + Math.random() * 6}px`,
                    }} />
                ))}

                <div className="container hero-container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                    >
                        <motion.div
                            className="hero-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Sparkles size={14} /> India's #1 Career Guidance Platform
                        </motion.div>

                        <h1 className="hero-title">
                            Discover Your<br />
                            <span className="gradient-text">Perfect Career</span><br />
                            Path Today
                        </h1>

                        <p className="hero-subtitle">
                            Take our AI-powered aptitude assessment and unlock personalized career recommendations, college guidance, and expert mentorship — all in one place.
                        </p>

                        <div className="hero-stats">
                            <div className="stat-chip"><span className="stat-num">50K+</span><span>Students</span></div>
                            <div className="stat-chip"><span className="stat-num">500+</span><span>Colleges</span></div>
                            <div className="stat-chip"><span className="stat-num">30+</span><span>Careers</span></div>
                        </div>

                        <div className="hero-btns">
                            <Link to="/test" className="btn-glow">
                                {isAuthenticated ? 'Go to Test' : 'Start Free Test'}
                                <ChevronRight size={20} />
                            </Link>
                            <a href="#features" className="btn-outline">
                                Explore Features <ArrowRight size={18} />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                    >
                        <div className="hero-card-stack">
                            {/* Main card */}
                            <div className="hcs-main glass-card">
                                <div className="hcs-header">
                                    <div className="hcs-dot red" /><div className="hcs-dot yellow" /><div className="hcs-dot green" />
                                    <span className="hcs-title">Aptitude Report</span>
                                </div>
                                <div className="hcs-score-ring">
                                    <svg viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="10" />
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                                            strokeDasharray="314" strokeDashoffset="56" strokeLinecap="round"
                                            transform="rotate(-90 60 60)" />
                                        <defs>
                                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#7c3aed" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="hcs-score-text">
                                        <span className="hcs-score-num">82%</span>
                                        <span className="hcs-score-label">Overall</span>
                                    </div>
                                </div>
                                <div className="hcs-mini-bars">
                                    {[{ l: 'Logic', v: 88, c: '#7c3aed' }, { l: 'Verbal', v: 72, c: '#06b6d4' }, { l: 'Quant', v: 65, c: '#10b981' }].map(b => (
                                        <div key={b.l} className="hcs-bar-row">
                                            <span>{b.l}</span>
                                            <div className="hcs-bar-track">
                                                <div className="hcs-bar-fill" style={{ width: `${b.v}%`, background: b.c }} />
                                            </div>
                                            <span>{b.v}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating mini cards */}
                            <div className="hcs-float float-1 glass-card">
                                <Target size={18} color="#7c3aed" />
                                <div>
                                    <p className="f-card-title">Top Match</p>
                                    <p className="f-card-val">Data Scientist</p>
                                </div>
                            </div>
                            <div className="hcs-float float-2 glass-card">
                                <Award size={18} color="#f59e0b" />
                                <div>
                                    <p className="f-card-title">Rank</p>
                                    <p className="f-card-val">Top 5%</p>
                                </div>
                            </div>
                            <div className="hcs-float float-3 glass-card">
                                <TrendingUp size={18} color="#10b981" />
                                <div>
                                    <p className="f-card-title">Growth</p>
                                    <p className="f-card-val">+24 pts</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-mouse"><div className="scroll-wheel" /></div>
                    <span>Scroll to explore</span>
                </div>
            </section>

            {/* ═══════ FEATURES ═══════ */}
            <section id="features" className="section features-section">
                <div className="container">
                    <motion.div className="section-header" {...fadeUp()}>
                        <div className="section-badge">✨ Why FuturePath</div>
                        <h2 className="section-title">Everything You Need to <span className="gradient-text">Succeed</span></h2>
                        <p className="section-sub">A complete ecosystem built to transform confused students into confident professionals.</p>
                    </motion.div>

                    <div className="features-grid">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                className="feature-card glass-card"
                                {...fadeUp(i * 0.1)}
                                whileHover={{ y: -8, scale: 1.02 }}
                            >
                                <div className="feature-icon-wrap" style={{ background: f.bg }}>
                                    <f.icon size={26} color={f.color} />
                                </div>
                                <h3 className="feature-card-title">{f.title}</h3>
                                <p className="feature-card-desc">{f.desc}</p>
                                <div className="feature-card-glow" style={{ background: f.bg }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ CAREER GUIDANCE ═══════ */}
            <section className="section career-section">
                <div className="career-bg-orb" />
                <div className="container career-container">
                    <motion.div className="career-text" {...fadeUp()}>
                        <div className="section-badge">🎯 Career Guidance</div>
                        <h2 className="section-title">Find Your <span className="gradient-text">Dream Career</span></h2>
                        <p className="section-sub">Our AI matches your unique aptitude profile against 30+ career streams to find where you'll excel and be most fulfilled.</p>

                        <div className="career-streams">
                            {careerStreams.map((s) => (
                                <motion.div
                                    key={s.label}
                                    className="stream-chip"
                                    whileHover={{ scale: 1.06 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                >
                                    <span>{s.icon}</span> {s.label}
                                </motion.div>
                            ))}
                        </div>

                        <div className="career-cta">
                            <Link to="/test" className="btn-glow">
                                Get My Career Match <ChevronRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div className="career-visual" {...fadeUp(0.2)}>
                        <div className="career-cards-stack">
                            {[
                                { title: 'Data Scientist', match: 94, icon: '🤖', color: '#7c3aed' },
                                { title: 'Product Manager', match: 87, icon: '📱', color: '#06b6d4' },
                                { title: 'UX Designer', match: 81, icon: '🎨', color: '#10b981' },
                            ].map((c, i) => (
                                <motion.div
                                    key={c.title}
                                    className="career-match-card glass-card"
                                    style={{ '--delay': i }}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.15 }}
                                >
                                    <div className="cmc-icon">{c.icon}</div>
                                    <div className="cmc-info">
                                        <p className="cmc-title">{c.title}</p>
                                        <div className="cmc-bar-track">
                                            <div className="cmc-bar-fill" style={{ width: `${c.match}%`, background: c.color }} />
                                        </div>
                                    </div>
                                    <div className="cmc-pct" style={{ color: c.color }}>{c.match}%</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════ COLLEGES ═══════ */}
            <section id="colleges" className="section colleges-section">
                <div className="container">
                    <motion.div className="section-header" {...fadeUp()}>
                        <div className="section-badge">🏛️ Top Colleges</div>
                        <h2 className="section-title">Explore India's <span className="gradient-text">Best Institutions</span></h2>
                        <p className="section-sub">Based on your aptitude results, we match you with the best-fit colleges across India.</p>
                    </motion.div>

                    <div className="colleges-grid">
                        {colleges.map((c, i) => (
                            <motion.div
                                key={c.name}
                                className="college-card glass-card"
                                {...fadeUp(i * 0.08)}
                                whileHover={{ y: -6 }}
                            >
                                <div className="college-avatar" style={{ background: `${c.color}20`, border: `2px solid ${c.color}30` }}>
                                    <span style={{ color: c.color, fontWeight: 700, fontSize: '1.1rem' }}>
                                        {c.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                                    </span>
                                </div>
                                <div className="college-info">
                                    <h3 className="college-name">{c.name}</h3>
                                    <p className="college-location"><MapPin size={12} /> {c.location}</p>
                                    <div className="college-tags">
                                        <span className="college-tag" style={{ background: `${c.color}15`, color: c.color }}>{c.tag}</span>
                                        <span className="college-tag rank">{c.rank}</span>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="college-arrow" style={{ color: c.color }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ DASHBOARD PREVIEW ═══════ */}
            <section className="section dashboard-section" ref={dashRef}>
                <div className="dash-bg-blob" />
                <div className="container">
                    <motion.div className="section-header" {...fadeUp()}>
                        <div className="section-badge">📊 Student Dashboard</div>
                        <h2 className="section-title">Your Personal <span className="gradient-text">Command Center</span></h2>
                        <p className="section-sub">Track your progress, view detailed analytics, and explore personalized recommendations.</p>
                    </motion.div>

                    <motion.div className="dashboard-preview glass-card" {...fadeUp(0.2)}>
                        <div className="dash-sidebar">
                            <div className="dash-avatar">D</div>
                            <p className="dash-name">Devashree</p>
                            <p className="dash-role">Class XII Student</p>
                            <div className="dash-nav">
                                {['📊 Overview', '🎯 Results', '🏛️ Colleges', '💼 Careers', '📝 Tests'].map((item, i) => (
                                    <div key={item} className={`dash-nav-item ${i === 0 ? 'active' : ''}`}>{item}</div>
                                ))}
                            </div>
                        </div>
                        <div className="dash-main">
                            <div className="dash-top-row">
                                <div className="dash-score-card">
                                    <p className="dsc-label">Overall Score</p>
                                    <p className="dsc-value gradient-text">82 / 100</p>
                                    <p className="dsc-sub">↑ Top 5% nationwide</p>
                                </div>
                                <div className="dash-score-card">
                                    <p className="dsc-label">Tests Taken</p>
                                    <p className="dsc-value" style={{ color: '#06b6d4' }}>3</p>
                                    <p className="dsc-sub">Last: 2 days ago</p>
                                </div>
                                <div className="dash-score-card">
                                    <p className="dsc-label">Career Matches</p>
                                    <p className="dsc-value" style={{ color: '#10b981' }}>12</p>
                                    <p className="dsc-sub">Top: Data Scientist</p>
                                </div>
                            </div>
                            <div className="dash-skill-section">
                                <p className="dash-section-title">Skill Breakdown</p>
                                <div className="dash-skill-bars">
                                    {skillBars.map(s => (
                                        <div key={s.label} className="skill-bar-row">
                                            <span className="skill-label">{s.label}</span>
                                            <div className="skill-track">
                                                <div
                                                    className="skill-fill"
                                                    style={{
                                                        width: animateBars ? `${s.value}%` : '0%',
                                                        background: s.color,
                                                    }}
                                                />
                                            </div>
                                            <span className="skill-pct" style={{ color: s.color }}>{s.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════ TESTIMONIALS ═══════ */}
            <section className="section testimonials-section">
                <div className="container">
                    <motion.div className="section-header" {...fadeUp()}>
                        <div className="section-badge">💬 Success Stories</div>
                        <h2 className="section-title">Students Who Found Their <span className="gradient-text">Path</span></h2>
                    </motion.div>

                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                className="testimonial-card glass-card"
                                {...fadeUp(i * 0.1)}
                                whileHover={{ y: -6 }}
                            >
                                <div className="t-stars">
                                    {[...Array(t.stars)].map((_, si) => (
                                        <Star key={si} size={16} fill="#f59e0b" color="#f59e0b" />
                                    ))}
                                </div>
                                <p className="t-text">"{t.text}"</p>
                                <div className="t-author">
                                    <div className="t-avatar" style={{ background: `${t.color}20`, color: t.color }}>{t.avatar}</div>
                                    <div>
                                        <p className="t-name">{t.name}</p>
                                        <p className="t-role">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ CTA BANNER ═══════ */}
            <section className="cta-banner">
                <div className="cta-orb cta-orb-1" />
                <div className="cta-orb cta-orb-2" />
                <div className="container cta-inner">
                    <motion.h2 className="cta-title" {...fadeUp()}>
                        Ready to Unlock Your <span className="gradient-text">True Potential?</span>
                    </motion.h2>
                    <motion.p className="cta-sub" {...fadeUp(0.1)}>
                        Join 50,000+ students who discovered their career path with FuturePath.
                    </motion.p>
                    <motion.div {...fadeUp(0.2)}>
                        <Link to={isAuthenticated ? '/test' : '/login'} className="btn-glow btn-lg">
                            {isAuthenticated ? 'Take Your Test Now' : 'Start for Free — No Credit Card'}
                            <Zap size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default Home;

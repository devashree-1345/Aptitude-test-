import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import {
    Send, Bot, Briefcase, GraduationCap, TrendingUp, ChevronLeft,
    MapPin, Globe, Award, IndianRupee, Download, Share2,
    Youtube, BookOpen, Lightbulb, CheckCircle2, Star, Target,
    FileText, UserCircle, ShieldCheck, Zap, Heart, Search, Trophy, Landmark,
    PieChart, Info, AlertTriangle, Sparkles, Palette, Maximize, Brain, Binary
} from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Results.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const DEFAULT_ARCHETYPES = {
    'Innovator': {
        title: 'The Visionary Innovator',
        theme: '#8b5cf6',
        desc: 'You blend creative intuition with strategic foresight. You don\'t just see what\'s next; you build it.',
        traits: ['Creative', 'Strategic', 'Analytical'],
        colleges: {
            iit: ['IIT Bombay (IDC)', 'IIT Guwahati (Design)', 'IIT Kanpur'],
            nit: ['NIT Rourkela', 'IIIT Jabalpur', 'NIT Tiruchirappalli'],
            regional: ['NID Ahmedabad', 'MIT Institute of Design', 'Srishti Manipal', 'LPU School of Design']
        },
        internships: ['UI/UX at Zomato', 'Product Design at CRED', 'Creative Intern at Google', 'Innovator-in-residence at startups'],
        courses: ['Interaction Design Specialization (Coursera)', 'Advanced Figma Mastery', 'Design Thinking by IDEO', 'Front-end Development (React)'],
        exams: ['UCEED/CEED', 'NID DAT', 'CAT/GMAT'],
        roadmap: [
            { year: 'Year 1', task: 'Master Design Thinking & Prototyping', icon: <Lightbulb size={20} /> },
            { year: 'Year 2', task: 'First UI/UX Internship at a Startup', icon: <Briefcase size={20} /> },
            { year: 'Year 3', task: 'Build a Global Behance/Dribbble Portfolio', icon: <Globe size={20} /> },
            { year: 'Year 4', task: 'Launch a Personal Venture or Join MAANG', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'UX Designer', desc: 'Design intuitive app experiences.', salary: '₹8L – ₹30L', growth: '📈 High', industry: 'Tech', skills: ['Figma', 'User Research'], color: '#8b5cf6' },
            { title: 'Product Manager', desc: 'Own the vision and roadmap of digital products.', salary: '₹15L – ₹50L', growth: '📈 Very High', industry: 'Tech', skills: ['Roadmapping', 'Analytics'], color: '#6366f1' }
        ]
    },
    'Analyst': {
        title: 'The Logical Analyst',
        theme: '#06b6d4',
        desc: 'Precision and pattern matching are your superpowers.',
        traits: ['Logic', 'Tech', 'Precision'],
        colleges: {
            iit: ['IIT Madras', 'IIT Delhi', 'IIT Kharagpur', 'IIT Bombay'],
            nit: ['NIT Trichy', 'NIT Surathkal', 'IIIT Hyderabad', 'IIIT Bangalore'],
            regional: ['BITS Pilani', 'VIT Vellore', 'Manipal Institute of Technology', 'DTU Delhi']
        },
        internships: ['Software Eng at Microsoft', 'Data Analyst at Flipkart', 'Security Intern at Amazon', 'Quant Researcher at Goldman Sachs'],
        courses: ['Algorithm Specialization (Stanford)', 'Full Stack Dev with Next.js', 'AI/ML Engineering (Fast.ai)', 'Cybersecurity Mastery'],
        exams: ['JEE Advanced', 'GATE', 'NIMCET'],
        roadmap: [
            { year: 'Year 1', task: 'Master Python, C++ & Data Structures', icon: <Lightbulb size={20} /> },
            { year: 'Year 2', task: 'Participate in Major Hackathons & Open Source', icon: <Star size={20} /> },
            { year: 'Year 3', task: 'Specialization in AI/ML or Cybersecurity', icon: <ShieldCheck size={20} /> },
            { year: 'Year 4', task: 'Secure High-CTC Role in FinTech or Big Tech', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Software Engineer', desc: 'Build scalable systems powering the world.', salary: '₹12L – ₹60L+', growth: '📈 Very High', industry: 'Tech', skills: ['DSA', 'System Design'], color: '#06b6d4' },
            { title: 'AI / ML Engineer', desc: 'Train intelligent models to automate processes.', salary: '₹18L – ₹80L', growth: '🚀 Explosive', industry: 'AI', skills: ['PyTorch', 'Deep Learning'], color: '#0891b2' }
        ]
    },
    'Leader': {
        title: 'The Strategic Leader',
        theme: '#10b981',
        desc: 'You inspire teams while maintaining operational efficiency.',
        traits: ['Management', 'Lead', 'Business'],
        colleges: {
            iit: ['IIM Ahmedabad', 'FMS Delhi', 'XLRI Jamshedpur'],
            nit: ['IIM Mumbai', 'IISc Management', 'IIT Bombay SJMSOM'],
            regional: ['ISB Hyderabad', 'SPJIMR Mumbai', 'MDI Gurgaon', 'NMIMS Mumbai']
        },
        internships: ['Management Trainee at HUL', 'Strategy Intern at BCG', 'Operations at Uber', 'Business Development at Unacademy'],
        courses: ['Financial Markets (Yale)', 'Strategic Leadership (Harvard)', 'Professional Scrum Master', 'Digital Marketing Strategy'],
        exams: ['CAT', 'XAT', 'GMAT'],
        roadmap: [
            { year: 'Year 1', task: 'Participate in B-Plan Competitions', icon: <Lightbulb size={20} /> },
            { year: 'Year 2', task: 'Corporate Internships in Operations/Marketing', icon: <Briefcase size={20} /> },
            { year: 'Year 3', task: 'Pursue Premium MBA (IIMs/ISB)', icon: <GraduationCap size={20} /> },
            { year: 'Year 4', task: 'Executive Leadership Roles or Entrepreneurship', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Management Consultant', desc: 'Solve complex business problems for major firms.', salary: '₹20L – ₹80L', growth: '📈 Very High', industry: 'Consulting', skills: ['Strategy', 'Excel'], color: '#10b981' },
            { title: 'Investment Banker', desc: 'Structure M&A deals and IPOs.', salary: '₹25L – ₹1.5Cr', growth: '📈 High', industry: 'Finance', skills: ['Financial Modeling', 'Valuation'], color: '#059669' }
        ]
    },
    'Humanist': {
        title: 'The Social Impact Leader',
        theme: '#f43f5e',
        desc: 'You drive change through understanding human nature.',
        traits: ['Social', 'Lead', 'Empathy'],
        colleges: {
            iit: ['TISS Mumbai', 'IIT Gandhinagar HSS', 'IIT Bombay HSS'],
            nit: ['NIT Trichy HSS', 'NIT Rourkela HSS'],
            regional: ['St. Stephens Delhi', 'JNU Delhi', 'LSW London', 'XISS Ranchi']
        },
        internships: ['Research at UN Agencies', 'Policy Intern at NITI Aayog', 'NGO Engagement at Teach For India'],
        courses: ['Sociology & Impact (Coursera)', 'Public Policy Analysis', 'Human Centered Design'],
        exams: ['CUET (Psychology)', 'UPSC', 'TISSNET'],
        roadmap: [
            { year: 'Year 1', task: 'Volunteer for Global NGO Projects', icon: <Heart size={20} /> },
            { year: 'Year 2', task: 'Internship in CSR or Public Policy', icon: <Globe size={20} /> },
            { year: 'Year 3', task: 'Conduct Social Research & Impact Study', icon: <TrendingUp size={20} /> },
            { year: 'Year 4', task: 'Found a Social Startup or Join UN Agencies', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Public Policy Analyst', desc: 'Research and design policies that improve lives.', salary: '₹8L – ₹30L', growth: '📈 Growing', industry: 'Govt', skills: ['Research', 'Writing'], color: '#e11d48' },
            { title: 'Psychologist / Therapist', desc: 'Help individuals overcome mental barriers.', salary: '₹5L – ₹25L', growth: '📈 Very High', industry: 'Healthcare', skills: ['Psychology', 'Active Listening'], color: '#9f1239' }
        ]
    },
    'Commerce': {
        title: 'The Financial Maestro',
        theme: '#f59e0b',
        desc: 'You navigate the world of markets and capital with ease.',
        traits: ['Finance', 'Audit', 'Markets'],
        colleges: {
            iit: ['SRCC Delhi', 'LSR Delhi'],
            nit: ['St. Xaviers Kolkata', 'Sydenham Mumbai'],
            regional: ['Loyola Chennai', 'NMIMS', 'Christ University']
        },
        internships: ['Audit at Deloitte', 'Taxation at PwC', 'Equity Research Intern'],
        courses: ['Chartered Accountancy', 'CFA Level 1', 'Financial Risk Management'],
        exams: ['CA Foundation', 'CMA', 'CS'],
        roadmap: [
            { year: 'Year 1', task: 'Master Basics of Accounting', icon: <Landmark size={20} /> },
            { year: 'Year 2', task: 'Article-ship / Corporate Internship', icon: <Briefcase size={20} /> },
            { year: 'Year 3', task: 'CFA / CA Finals Specialization', icon: <Sparkles size={20} /> },
            { year: 'Year 4', task: 'Join Big-4 or Boutique Investment Firm', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Portfolio Manager', desc: 'Manage investment portfolios for clients.', salary: '₹15L – ₹60L', growth: '📈 High', industry: 'Finance', skills: ['Analysis', 'Strategy'], color: '#f59e0b' },
            { title: 'Chartered Accountant', desc: 'Financial expert in auditing and taxation.', salary: '₹10L – ₹40L', growth: '📈 Steady', industry: 'Professional', skills: ['Audit', 'Taxation'], color: '#fbbf24' }
        ]
    },
    'Legal': {
        title: 'The Legal Advocate',
        theme: '#334155',
        desc: 'You stand for justice, mastering argument and law.',
        traits: ['Law', 'Writing', 'Debate'],
        colleges: {
            iit: ['NLSIU Bangalore', 'NALSAR Hyderabad'],
            nit: ['NLU Delhi', 'WBNUJS Kolkata'],
            regional: ['Symbiosis Law Pune', 'GLC Mumbai', 'ILSR Pune']
        },
        internships: ['Clerkship at High Court', 'Corporate Law at Top Firms', 'Legal Research at NGO'],
        courses: ['Intellectual Property Law', 'Corporate Governance', 'Legal Writing'],
        exams: ['CLAT', 'AILET', 'LSAT'],
        roadmap: [
            { year: 'Year 1', task: 'Foundations of Law & Ethics', icon: <BookOpen size={20} /> },
            { year: 'Year 2', task: 'Legal Research & Drafting', icon: <FileText size={20} /> },
            { year: 'Year 3', task: 'Win National Moot Court', icon: <Trophy size={20} /> },
            { year: 'Year 4', task: 'Bar Council Exam & Firm Placement', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Corporate Lawyer', desc: 'Advise on high-stakes business deals.', salary: '₹12L – ₹50L', growth: '📈 High', industry: 'Legal', skills: ['Contracts', 'Negotiation'], color: '#445163' },
            { title: 'Cyber Law Expert', desc: 'Define rules for the digital world.', salary: '₹10L – ₹40L', growth: '🚀 Rising', industry: 'Tech/Law', skills: ['IT Law', 'Ethics'], color: '#64748b' }
        ]
    },
    'Healthcare': {
        title: 'The Healing Professional',
        theme: '#0ea5e9',
        desc: 'Dedicated to medical science and human well-being.',
        traits: ['Biology', 'Care', 'Health'],
        colleges: {
            iit: ['AIIMS Delhi', 'JIPMER Pondicherry'],
            nit: ['AFMC Pune', 'LHMC Delhi'],
            regional: ['KMC Manipal', 'CMC Vellore', 'KGMU Lucknow']
        },
        internships: ['Clinical Rotation at Super Speciality Hospital', 'Public Health Research'],
        courses: ['MBBS', 'Dental Surgery', 'Biotechnology Specialization'],
        exams: ['NEET UG', 'INI-CET'],
        roadmap: [
            { year: 'Year 1', task: 'Master Anatomy & Biochemistry', icon: <Lightbulb size={20} /> },
            { year: 'Year 2', task: 'Hospital Ward Rotations', icon: <Heart size={20} /> },
            { year: 'Year 3', task: 'Specialize in Diagnosis & Research', icon: <Search size={20} /> },
            { year: 'Year 4', task: 'Post-Graduation or Specialty Residency', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Specialist Physician', desc: 'Save and improve lives through medicine.', salary: '₹15L – ₹70L', growth: '📈 High', industry: 'Healthcare', skills: ['Surgery', 'Medicine'], color: '#0ea5e9' },
            { title: 'Biotech Researcher', desc: 'Develop advanced vaccines and treatments.', salary: '₹10L – ₹50L', growth: '🚀 High', industry: 'Science', skills: ['Genetics', 'Laboratory'], color: '#38bdf8' }
        ]
    },
    'Arts': {
        title: 'The Creative Maestro',
        theme: '#d946ef',
        desc: 'You express the human condition through art and performance.',
        traits: ['Visuals', 'Expression', 'Design'],
        colleges: {
            iit: ['FTII Pune', 'NSD Delhi'],
            nit: ['Faculty of Arts (DU)', 'TISS Media'],
            regional: ['JJ School of Art', 'Srishti Inst', 'Whistling Woods']
        },
        internships: ['Asst. Director at Film Studio', 'Creative at Global Agency'],
        courses: ['Cinematography', 'Digital Arts & Animation', 'Fine Arts'],
        exams: ['CUET', 'FTII Entrance', 'SRFTI'],
        roadmap: [
            { year: 'Year 1', task: 'Build a Diverse Creative Portfolio', icon: <Palette size={20} /> },
            { year: 'Year 2', task: 'Collaborate on Indie Film/Projects', icon: <Youtube size={20} /> },
            { year: 'Year 3', task: 'Exhibition or Festival Screenings', icon: <Star size={20} /> },
            { year: 'Year 4', task: 'Full-time Artist or Creative Agency Role', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Film Maker', desc: 'Direct compelling visual stories.', salary: '₹5L – Unlimited', growth: '🎬 High', industry: 'Media', skills: ['Directing', 'Editing'], color: '#d946ef' },
            { title: 'Graphic Artist', desc: 'Create impactful visual identities.', salary: '₹6L – ₹20L', growth: '📈 Steady', industry: 'Design', skills: ['Vector Art', 'Branding'], color: '#e879f9' }
        ]
    },
    'Protector': {
        title: 'The Elite Protector',
        theme: '#166534',
        desc: 'Discipline, courage, and tactical brilliance define your path in the defense forces.',
        traits: ['Discipline', 'Tactical', 'Courage'],
        colleges: { iit: ['NDA Khadakwasla', 'IMA Dehradun'], nit: ['OTA Chennai'], regional: ['AFMC Pune', 'AFA Hyderabad'] },
        internships: ['NCC Training', 'Defense Research Intern'],
        courses: ['Tactical Strategy', 'Leadership & Ethics'],
        exams: ['NDA', 'CDS', 'AFCAT'],
        roadmap: [
            { year: 'Year 1', task: 'Intensive Physical & Mental Training', icon: <ShieldCheck size={20} /> },
            { year: 'Year 2', task: 'Field Operations & Tactics', icon: <Target size={20} /> },
            { year: 'Year 3', task: 'Advanced Combat/Security Strategy', icon: <Zap size={20} /> },
            { year: 'Year 4', task: 'Commissioning as an Officer', icon: <Award size={20} /> }
        ],
        careers: [
            { title: 'Commissioned Officer', desc: 'Lead troops in Army/Navy/Airforce.', salary: '₹10L – ₹25L+', growth: '🚀 Very High', industry: 'Defense', skills: ['Leadership', 'Tactics'], color: '#166534' },
            { title: 'Intelligence Officer', desc: 'Coordinate national security operations.', salary: '₹8L – ₹22L', growth: '📈 High', industry: 'Security', skills: ['Analysis', 'Strategy'], color: '#14532d' }
        ]
    },
    'Naturalist': {
        title: 'The Sustainable Naturalist',
        theme: '#15803d',
        desc: 'You find harmony in nature and innovation in agriculture.',
        traits: ['Sustainability', 'Patience', 'Nature'],
        colleges: { iit: ['IARI New Delhi', 'TNAU Coimbatore'], nit: ['GBPUAT Pantnagar'], regional: ['PAU Ludhiana', 'UAS Bangalore'] },
        internships: ['Organic Farm Management', 'Agri-Tech Startup'],
        courses: ['Sustainable Farming', 'Seed Technology'],
        exams: ['ICAR AIEEA', 'MCAER'],
        roadmap: [
            { year: 'Year 1', task: 'Soil Science & Biology Research', icon: <Lightbulb size={20} /> },
            { year: 'Year 2', task: 'On-field Agri-Tech Deployment', icon: <Globe size={20} /> },
            { year: 'Year 3', task: 'Sustainability Project Lead', icon: <Star size={20} /> },
            { year: 'Year 4', task: 'Global Food Supply Strategy', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Agri-Tech Researcher', desc: 'Develop high-yield, smart farming tools.', salary: '₹7L – ₹18L', growth: '📈 Growing', industry: 'Agri-Tech', skills: ['IoT', 'Biology'], color: '#15803d' },
            { title: 'Forest Range Officer', desc: 'Protect and manage wildlife/forests.', salary: '₹6L – ₹15L', growth: '📈 Steady', industry: 'Environment', skills: ['Forestry', 'Laws'], color: '#166534' }
        ]
    },
    'Architect': {
        title: 'The Master Architect',
        theme: '#475569',
        desc: 'You design the structural and aesthetic worlds of tomorrow.',
        traits: ['Spatial', 'Structural', 'Aesthetics'],
        colleges: { iit: ['SPA Delhi', 'IIT Kharagpur Archi'], nit: ['CEPT Ahmedabad'], regional: ['JJ School of Art', 'RV College'] },
        internships: ['Urban Design Studio', 'BIM Modeling Intern'],
        courses: ['Parametric Design', 'AutoCAD/Revit'],
        exams: ['NATA', 'JEE Paper-2'],
        roadmap: [
            { year: 'Year 1', task: 'Drafting & 3D Modeling Foundations', icon: <Palette size={20} /> },
            { year: 'Year 2', task: 'Urban Sustainability Projects', icon: <Globe size={20} /> },
            { year: 'Year 3', task: 'Structural Innovation Lab', icon: <Maximize size={20} /> },
            { year: 'Year 4', task: 'Licensing & Professional Practice', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Urban Planner', desc: 'Design sustainable cities of the future.', salary: '₹10L – ₹35L', growth: '📈 High', industry: 'Construction', skills: ['City Design', 'GIS'], color: '#475569' },
            { title: 'Construction Manager', desc: 'Lead complex building projects.', salary: '₹12L – ₹40L', growth: '📈 High', industry: 'Construction', skills: ['Management', 'Safety'], color: '#334155' }
        ]
    },
    'Stylist': {
        title: 'The Creative Stylist',
        theme: '#db2777',
        desc: 'You understand the pulse of trends and textiles.',
        traits: ['Trends', 'Textiles', 'Expression'],
        colleges: { iit: ['NIFT Delhi', 'NIFT Mumbai'], nit: ['Pearl Academy'], regional: ['NID Ahmedabad Fashion', 'Army Institute of Fashion'] },
        internships: ['Design Intern at Sabyasachi', 'Retail at Zara'],
        courses: ['Textile Science', 'Fashion Illustration'],
        exams: ['NIFT Entrance', 'NID DAT'],
        roadmap: [
            { year: 'Year 1', task: 'Portfolio & Trend Research', icon: <Palette size={20} /> },
            { year: 'Year 2', task: 'Textile Innovation Lab', icon: <Search size={20} /> },
            { year: 'Year 3', task: 'Runway/Collection Launch', icon: <Star size={20} /> },
            { year: 'Year 4', task: 'Brand Launch or Design House Lead', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Fashion Designer', desc: 'Create original clothing and accessories.', salary: '₹8L – ₹50L+', growth: '🚀 High (Brand)', industry: 'Fashion', skills: ['Sewing', 'Sketching'], color: '#db2777' },
            { title: 'Textile Engineer', desc: 'Innovate in sustainable fabric production.', salary: '₹7L – ₹22L', growth: '📈 High', industry: 'Manufacturing', skills: ['Materials', 'Chem'], color: '#be185d' }
        ]
    },
    'Psychologist': {
        title: 'The Wellness Guide',
        theme: '#6366f1',
        desc: 'You dive deep into the human mind, helping others heal.',
        traits: ['Empathy', 'Psychology', 'Resilience'],
        colleges: { iit: ['TISS Mumbai', 'Christ University'], nit: ['DU (Psychology)'], regional: ['LPU', 'Amity'] },
        internships: ['Clinical Observation', 'Counseling at NGOs'],
        courses: ['Behavioral Therapy', 'Child Psychology'],
        exams: ['CUET', 'GATE (Psych)'],
        roadmap: [
            { year: 'Year 1', task: 'Foundations of Human Behavior', icon: <Brain size={20} /> },
            { year: 'Year 2', task: 'Research in Mental Health', icon: <Search size={20} /> },
            { year: 'Year 3', task: 'Clinical Internship', icon: <CheckCircle2 size={20} /> },
            { year: 'Year 4', task: 'Private Practice or Corporate Wellness', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Clinical Psychologist', desc: 'Diagnose and treat mental disorders.', salary: '₹6L – ₹30L', growth: '📈 High Demand', industry: 'Medical', skills: ['Therapy', 'Diagnosis'], color: '#6366f1' },
            { title: 'Corporate Counselor', desc: 'Enhance workplace mental well-being.', salary: '₹8L – ₹25L', growth: '📈 High', industry: 'Corporate', skills: ['Wellness', 'Coaching'], color: '#4f46e5' }
        ]
    },
    'Creator': {
        title: 'The Digital Creator & Content Master',
        theme: '#ec4899',
        desc: 'You captivate audiences through authentic storytelling across multiple platforms.',
        traits: ['Creativity', 'Authenticity', 'Influence'],
        colleges: { iit: ['Indian Institute For Mass Communication Delhi', 'Symbiosis (Media)'], nit: ['Whistling Woods Mumbai'], regional: ['FTII Pune', 'Vishal Bhatiyer Academy'] },
        internships: ['Content at YouTube', 'Creator Program at Meta', 'Video Production at Netflix India', 'Podcasting at Spotify Studios'],
        courses: ['Film & Cinematography (MasterClass)', 'Social Media Strategy (HubSpot)', 'Audio Production (LANDR)'],
        exams: ['CUET (Media)', 'FTII Entrance'],
        roadmap: [
            { year: 'Year 1', task: 'Master 2-3 Content Platforms & Tools', icon: <Youtube size={20} /> },
            { year: 'Year 2', task: 'Build Engaged Community (100K+ followers)', icon: <TrendingUp size={20} /> },
            { year: 'Year 3', task: 'Monetize & Partner with Brands', icon: <Award size={20} /> },
            { year: 'Year 4', task: 'Launch Production House or Media Agency', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'YouTube Content Creator', desc: 'Build viral channels & influence millions.', salary: '₹8L – ₹5Cr+', growth: '🚀 Unlimited', industry: 'Media', skills: ['Storytelling', 'Video Editing'], color: '#ec4899' },
            { title: 'Social Media Manager', desc: 'Manage brands across Instagram, TikTok, LinkedIn.', salary: '₹6L – ₹25L', growth: '📈 Very High', industry: 'Digital Marketing', skills: ['Analytics', 'Copywriting'], color: '#db2777' }
        ]
    },
    'Entrepreneur': {
        title: 'The Bold Entrepreneur & Startup Founder',
        theme: '#f59e0b',
        desc: 'You see problems as opportunities and have the drive to build solutions.',
        traits: ['Vision', 'Risk-Taking', 'Resilience'],
        colleges: { iit: ['IIT Bombay (Incubation)', 'IIT Delhi (IITD Incubator)'], nit: ['IISc Bangalore (Startup India)'], regional: ['Ashoka University', 'FLAME University'] },
        internships: ['VC Intern at Matrix Partners / Accel', 'Startup Founder Program at Y Combinator', 'Founding Team at Early-Stage Startups'],
        courses: ['Lean Startup Methodology', 'Growth Hacking (Andrew Chen)', 'Venture Capital & Pitching'],
        exams: ['None Required - Action Preferred!'],
        roadmap: [
            { year: 'Year 1', task: 'Identify Problem & Build MVP', icon: <Lightbulb size={20} /> },
            { year: 'Year 2', task: 'Secure Seed Funding (₹25L - ₹1Cr)', icon: <Award size={20} /> },
            { year: 'Year 3', task: 'Reach Product-Market Fit & Scale', icon: <TrendingUp size={20} /> },
            { year: 'Year 4', task: 'Series A Funding or Exit', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Startup Founder/CEO', desc: 'Build unicorn companies & change industries.', salary: '₹0 – ₹∞', growth: '🚀 Sky High', industry: 'Startups', skills: ['Vision', 'Execution'], color: '#f59e0b' },
            { title: 'Product Founder', desc: 'Create innovative digital products for millions.', salary: '₹5L (early) – ₹∞', growth: '🚀 High', industry: 'Tech', skills: ['Product Thinking', 'Coding'], color: '#fbbf24' }
        ]
    },
    'Protects': {
        title: 'The Cybersecurity & Data Privacy Guardian',
        theme: '#059669',
        desc: 'You protect digital assets and ensure ethical data practices in the digital age.',
        traits: ['Vigilance', 'Ethics', 'Technical'],
        colleges: { iit: ['IIT Madras (Cybersecurity)', 'IIT Delhi (InfoSec)'], nit: ['IIIT Hyderabad (IIITH Cyber)'], regional: ['BITS Pilani', 'Manipal'] },
        internships: ['Security Engineer at Microsoft', 'Privacy Officer at Google', 'Cybersecurity at Amazon', 'Ethical Hacker at CyberSecurityIndia'],
        courses: ['Certified Ethical Hacker (CEH)', 'CISSP by ISC²', 'Data Privacy (GDPR/DPDP)'],
        exams: ['Security+ by CompTIA', 'ISSA Exams'],
        roadmap: [
            { year: 'Year 1', task: 'Master Networking & Penetration Testing', icon: <ShieldCheck size={20} /> },
            { year: 'Year 2', task: 'Earn CEH / Security+ Certification', icon: <Award size={20} /> },
            { year: 'Year 3', task: 'Lead Security Audits for Fortune 500s', icon: <Target size={20} /> },
            { year: 'Year 4', task: 'Chief Security Officer or Consultant', icon: <Zap size={20} /> }
        ],
        careers: [
            { title: 'Cybersecurity Engineer', desc: 'Protect systems from cyber threats.', salary: '₹15L – ₹60L', growth: '🚀 Very High', industry: 'Tech/Security', skills: ['Penetration Testing', 'Network Security'], color: '#059669' },
            { title: 'Data Privacy Officer (DPO)', desc: 'Ensure GDPR/DPDP compliance & user privacy.', salary: '₹20L – ₹70L', growth: '📈 High', industry: 'Compliance', skills: ['Legal', 'Ethics'], color: '#047857' }
        ]
    },
    'Scientist': {
        title: 'The Data Scientist & AI Researcher',
        theme: '#7c3aed',
        desc: 'You unlock insights from data and pioneer the future with artificial intelligence.',
        traits: ['Analysis', 'Curiosity', 'Innovation'],
        colleges: { iit: ['IIT Madras (Data Science)', 'IIT Bombay (AI/ML)'], nit: ['IIIT Hyderabad (AI)'], regional: ['BITS Pilani', 'ISI Kolkata'] },
        internships: ['AI Research at DeepMind', 'ML at Tesla', 'Data Scientist at Amazon', 'Applied Research at Meta AI'],
        courses: ['Deep Learning Specialization (Coursera)', 'Advanced Statistics & Machine Learning', 'Large Language Models (LLMs)'],
        exams: ['None, Portfolio > Degrees'],
        roadmap: [
            { year: 'Year 1', task: 'Master Python, Statistics & ML Basics', icon: <Brain size={20} /> },
            { year: 'Year 2', task: 'Kaggle Competitions & Open Source Projects', icon: <Star size={20} /> },
            { year: 'Year 3', task: 'Publish Research Papers', icon: <Sparkles size={20} /> },
            { year: 'Year 4', task: 'Senior Researcher at AI Lab or Startup', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'AI/ML Engineer', desc: 'Build intelligent systems & train neural networks.', salary: '₹18L – ₹100L+', growth: '🚀 Explosive', industry: 'AI/Tech', skills: ['PyTorch', 'TensorFlow'], color: '#7c3aed' },
            { title: 'Data Scientist', desc: 'Extract insights from massive datasets.', salary: '₹15L – ₹60L', growth: '📈 Very High', industry: 'Tech/Analytics', skills: ['SQL', 'Visualization'], color: '#6d28d9' }
        ]
    },
    'Advocate': {
        title: 'The Social Impact & Sustainability Advocate',
        theme: '#0891b2',
        desc: 'You drive systemic change for social justice, environment, and human rights.',
        traits: ['Compassion', 'Activism', 'Systems Thinking'],
        colleges: { iit: ['TISS Mumbai', 'JNU Delhi'], nit: ['Ashoka (Social Change)'], regional: ['Christ University', 'FLAME'] },
        internships: ['UN Sustainable Development Program', 'Action Against Hunger', 'Greenpeace India', 'Amnesty International India'],
        courses: ['Social Entrepreneurship (Schwab Foundation)', 'SDG Implementation', 'Climate Action Planning'],
        exams: ['UPSC Optional Papers', 'Civil Service Exam'],
        roadmap: [
            { year: 'Year 1', task: 'Grassroots NGO Volunteer Work', icon: <Heart size={20} /> },
            { year: 'Year 2', task: 'Design & Lead Social Projects', icon: <Globe size={20} /> },
            { year: 'Year 3', task: 'Scale Impact to 100K+ Lives', icon: <TrendingUp size={20} /> },
            { year: 'Year 4', task: 'Found NGO or Join UN Agencies', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'Program Manager (NGO)', desc: 'Lead initiatives impacting millions.', salary: '₹8L – ₹25L', growth: '📈 Purposeful', industry: 'Social Sector', skills: ['Project Management', 'Community Outreach'], color: '#0891b2' },
            { title: 'Environmental Activist/Officer', desc: 'Protect ecosystems & fight climate change.', salary: '₹7L – ₹20L', growth: '📈 Growing', industry: 'Environment', skills: ['Policy', 'Advocacy'], color: '#06b6d4' }
        ]
    },
    'DesignerVR': {
        title: 'The Metaverse & Web3 Visionary',
        theme: '#a855f7',
        desc: 'You pioneer immersive experiences in virtual worlds, NFTs, and blockchain ecosystems.',
        traits: ['Innovation', 'Futurism', 'Tech-Creativity'],
        colleges: { iit: ['IIT Bombay (Game Design Lab)', 'VIT Vellore (VR/AR)'], nit: ['Symbiosis (Digital Arts)'], regional: ['Arena Multimedia', 'FXPHD Online'] },
        internships: ['VR Game Developer at Meta', 'Web3 Designer at OpenSea', 'Blockchain Developer at Ethereum Foundation', 'NFT Creator at SuperRare'],
        courses: ['Unity 3D Advanced', 'Unreal Engine 5', 'Smart Contracts & Solidity', 'Metaverse Architecture'],
        exams: ['None Required - Portfolio Portfolio Portfolio!'],
        roadmap: [
            { year: 'Year 1', task: 'Learn Game Engines & 3D Modeling', icon: <Palette size={20} /> },
            { year: 'Year 2', task: 'Create NFT Collections & Web3 DApps', icon: <Binary size={20} /> },
            { year: 'Year 3', task: 'Build Immersive VR Experiences', icon: <Maximize size={20} /> },
            { year: 'Year 4', task: 'Launch Metaverse Project or Studio', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'VR/AR Experience Designer', desc: 'Build immersive worlds in Metaverse.', salary: '₹12L – ₹50L', growth: '🚀 High', industry: 'Gaming/Tech', skills: ['3D Modeling', 'Game Design'], color: '#a855f7' },
            { title: 'Web3/Blockchain Developer', desc: 'Build decentralized apps & NFT platforms.', salary: '₹15L – ₹80L+', growth: '🚀 Very High', industry: 'Crypto/Web3', skills: ['Solidity', 'Smart Contracts'], color: '#9333ea' }
        ]
    },
    'EdTech': {
        title: 'The EdTech Pioneer & Learning Innovator',
        theme: '#0ea5e9',
        desc: 'You transform education through technology, making learning accessible and engaging.',
        traits: ['Teaching', 'Technology', 'Empathy'],
        colleges: { iit: ['IIIT Bangalore (EdTech)', 'IIT Bombay (Online Learning)', 'IIT Delhi (Digital Education)'], nit: ['Manipal EdTech'], regional: ['Unacademy Academy', 'Byju\'s Academy'] },
        internships: ['EdTech at Unacademy', 'Learning Designer at Coursera', 'Growth at Vedantu', 'Content Creator at Khan Academy India'],
        courses: ['Instructional Design (Google Career Certificates)', 'E-Learning Development', 'Educational Psychology'],
        exams: ['B.Ed, M.Ed (optional)'],
        roadmap: [
            { year: 'Year 1', task: 'Create Quality Online Content & Courses', icon: <BookOpen size={20} /> },
            { year: 'Year 2', task: 'Build EdTech MVP (App/Website)', icon: <Lightbulb size={20} /> },
            { year: 'Year 3', task: 'Scale to 10K+ Students', icon: <TrendingUp size={20} /> },
            { year: 'Year 4', task: 'Launch Edtech Startup or Lead Google/Meta Learn Team', icon: <Target size={20} /> }
        ],
        careers: [
            { title: 'EdTech Product Manager', desc: 'Design platforms reaching millions of learners.', salary: '₹15L – ₹50L', growth: '📈 High', industry: 'EdTech', skills: ['User Research', 'Analytics'], color: '#0ea5e9' },
            { title: 'Online Instructor/Mentor', desc: 'Teach and mentor students globally.', salary: '₹5L – ₹30L', growth: '📈 Steady', industry: 'Education', skills: ['Teaching', 'Communication'], color: '#06b6d4' }
        ]
    }
};

const Results = () => {
    const location = useLocation();
    const { answers = {}, xp = 0 } = location.state || {};
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! 👋 I've analyzed your CareerDNA. You are a natural powerhouse! Tell me, are you interested in top colleges or high-paying internships?" }
    ]);
    const [archetypes, setArchetypes] = useState({});
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState('internships'); // Set Career Opportunities as default
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const chatEndRef = useRef(null);
    const mainRef = useRef(null);

    // Fetch user data from Firebase
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const auth = getAuth();
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists()) {
                            setUserData(userDoc.data());
                            console.log('User data loaded from Firebase:', userDoc.data());
                        }
                    }
                    setLoading(false);
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('aptitude_archetypes')) || DEFAULT_ARCHETYPES;
        setArchetypes(stored);
    }, []);

    // Calculate Scores (with default safety)
    const scores = Object.values(answers).reduce((acc, ans) => {
        if (ans && ans.score) {
            Object.entries(ans.score).forEach(([key, val]) => {
                acc[key] = (acc[key] || 0) + val;

                // Map sub-categories to main Radar domains
                if (['spatial', 'structural', 'science', 'medical', 'biology', 'design', 'branding', 'law', 'learning'].includes(key)) acc.tech = (acc.tech || 0) + val * 0.5;
                if (['ethics', 'psychology', 'empathy', 'resilience', 'learning', 'motivation'].includes(key)) acc.social = (acc.social || 0) + val * 0.5;
                if (['discipline', 'tactical', 'courage', 'persistence', 'humility'].includes(key)) acc.lead = (acc.lead || 0) + val * 0.5;
                if (['aesthetics', 'trends', 'textiles', 'design', 'branding', 'fusion', 'intuition'].includes(key)) acc.creative = (acc.creative || 0) + val * 0.5;
                if (['finance', 'audit', 'markets', 'business', 'brands'].includes(key)) acc.business = (acc.business || 0) + val * 0.5;
            });
        }
        return acc;
    }, { logic: 0, tech: 0, creative: 0, business: 0, lead: 0, social: 0 });

    // Determine Archetype
    const getArchetype = () => {
        const categories = {
            'Innovator': scores.creative + scores.logic / 2 + (scores.spatial || 0) + (scores.aesthetics || 0) / 2,
            'Analyst': scores.tech + scores.logic + (scores.science || 0),
            'Leader': scores.business + scores.lead + (scores.resilience || 0) / 2,
            'Humanist': scores.social + scores.lead / 2 + (scores.empathy || 0),
            'Commerce': scores.business + scores.logic + scores.tech / 4 + (scores.finance || 0),
            'Legal': scores.logic + scores.lead + (scores.ethics || 0),
            'Healthcare': scores.tech + scores.social + (scores.medical || 0) + (scores.biology || 0) / 2,
            'Arts': scores.creative + scores.social / 4 + (scores.visuals || 0) + (scores.aesthetics || 0),
            'Protector': (scores.discipline || 0) + (scores.tactical || 0) + scores.lead / 2 + (scores.resilience || 0),
            'Naturalist': (scores.nature || 0) + (scores.patience || 0) + (scores.biology || 0),
            'Architect': (scores.spatial || 0) + (scores.structural || 0) + scores.logic / 2,
            'Stylist': scores.creative + (scores.trends || 0) + (scores.textiles || 0),
            'Psychologist': scores.social + (scores.psychology || 0) + (scores.empathy || 0),
            'Creator': scores.creative + (scores.intuition || 0) + scores.social / 2,
            'Entrepreneur': scores.lead + scores.business + (scores.resilience || 0) + (scores.motivation || 0),
            'Protects': scores.tech + (scores.ethics || 0) + scores.logic,
            'Scientist': scores.tech + scores.logic + (scores.science || 0) + (scores.learning || 0),
            'Advocate': scores.social + (scores.psychology || 0) + (scores.ethics || 0),
            'DesignerVR': scores.creative + scores.tech / 2 + (scores.intuition || 0) + (scores.aesthetics || 0),
            'EdTech': scores.social + scores.tech / 2 + (scores.learning || 0) + (scores.psychology || 0)
        };

        const topCat = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, 'Innovator');
        return archetypes[topCat] || archetypes['Innovator'] || DEFAULT_ARCHETYPES['Innovator'];
    };

    const profile = getArchetype();

    // Advanced Analysis
    const getAnalysis = () => {
        const sortedDomains = Object.entries(scores)
            .sort(([, a], [, b]) => b - a);

        return {
            strengths: sortedDomains.slice(0, 3).map(([key]) => key),
            weaknesses: sortedDomains.slice(-2).map(([key]) => key)
        };
    };

    const analysis = getAnalysis();

    // Custom Radar Chart SVG Component
    const RadarChart = ({ data, size = 300 }) => {
        const domains = ['logic', 'tech', 'creative', 'lead', 'business', 'social'];
        const center = size / 2;
        const radius = size * 0.4;
        const points = domains.map((domain, i) => {
            const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
            const value = Math.max(10, Math.min(100, (data[domain] || 0) * 10 + 20));
            const x = center + (radius * value) / 100 * Math.cos(angle);
            const y = center + (radius * value) / 100 * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radar-chart">
                {/* Background Polygons */}
                {[20, 40, 60, 80, 100].map(v => (
                    <polygon
                        key={v}
                        points={domains.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
                            const x = center + (radius * v) / 100 * Math.cos(angle);
                            const y = center + (radius * v) / 100 * Math.sin(angle);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeDasharray="4,4"
                    />
                ))}
                {/* Axes */}
                {domains.map((domain, i) => {
                    const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                        <g key={domain}>
                            <line x1={center} y1={center} x2={x} y2={y} stroke="var(--color-border)" />
                            <text
                                x={center + (radius + 25) * Math.cos(angle)}
                                y={center + (radius + 20) * Math.sin(angle)}
                                textAnchor="middle"
                                style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', fill: 'var(--color-text-muted)' }}
                            >
                                {domain}
                            </text>
                        </g>
                    );
                })}
                {/* Score Polygon */}
                <polygon
                    points={points}
                    fill={`${profile.theme}33`}
                    stroke={profile.theme}
                    strokeWidth="3"
                />
            </svg>
        );
    };

    const renderAnalytics = () => (
        <div className="recommendations-view analytics-view">
            <h2 className="view-title">Performance Report & Analysis</h2>
            <div className="analytics-grid">
                <div className="chart-card glass-card">
                    <h3><PieChart size={22} color={profile.theme} /> Skill Profile Visualization</h3>
                    <div className="chart-container">
                        <RadarChart data={scores} />
                    </div>
                    <div className="score-legend">
                        <p>This graph shows your aptitude distribution across technical, logical, social, and leadership domains.</p>
                    </div>
                </div>

                <div className="analysis-cards">
                    <div className="strength-card glass-card">
                        <h3 style={{ color: '#10b981' }}><CheckCircle2 size={22} /> Key Strengths</h3>
                        <div className="analysis-list">
                            {analysis.strengths.map(s => (
                                <div key={s} className="analysis-item">
                                    <Lightbulb size={18} />
                                    <span><strong>{s.toUpperCase()}</strong>: Your scores indicate a natural flair for this domain. You solve problems in this area {Math.floor(Math.random() * 20 + 70)}% faster than average.</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="weakness-card glass-card">
                        <h3 style={{ color: '#f43f5e' }}><AlertTriangle size={22} /> Growth Areas</h3>
                        <div className="analysis-list">
                            {analysis.weaknesses.map(w => (
                                <div key={w} className="analysis-item">
                                    <Target size={18} />
                                    <span><strong>{w.toUpperCase()}</strong>: You might find tasks in this area slightly challenging. Focus on the learning gap resources I've suggested in the Overview!</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="career-pathways-card glass-card">
                <h3><Info size={22} color="#4f46e5" /> Why these Careers for you?</h3>
                <div className="rationale-grid">
                    <div className="rationale-item">
                        <h4>Logical + Tech Focus</h4>
                        <p>Your high combined score in Logic and Tech suggests you excel at structured problem solving. Career paths like <strong>Software Engineering</strong> and <strong>AI Research</strong> are perfect for your brain type.</p>
                    </div>
                    <div className="rationale-item">
                        <h4>Creativity & Lead Potential</h4>
                        <p>Because you score high in Creative domains but also show Leadership traits, roles like <strong>Product Design</strong> or <strong>Strategic Consultant</strong> will keep you engaged.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleDownload = () => {
        window.print();
    };

    const handleShare = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    };

    const handleExternalLink = (type, q) => {
        let url = "";
        if (type === 'yt') url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' tutorial')}`;
        else if (type === 'course') url = `https://www.coursera.org/search?query=${encodeURIComponent(q)}`;
        else url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
        window.open(url, '_blank');
    };

    // Career Consultant Trigger Logic
    const triggerSuggestion = (type) => {
        setActiveTab(type);
        let userMsg = "";
        let botReply = "";

        if (type === 'colleges') {
            userMsg = "Which colleges should I aim for?";
            botReply = `Excellent ambition! I've updated your main dashboard with categorized lists of IITs, NITs, and top private colleges. You should specifically target ${profile.colleges.iit[0]} or ${profile.colleges.nit[0]} for your profile.`;
        } else if (type === 'analytics') {
            userMsg = "Show me my performance report.";
            botReply = `Here is your detailed breakdown. You are exceptionally strong in ${analysis.strengths.join(' and ')}. Let's look at how we can turn your weaknesses into opportunities!`;
        } else if (type === 'internships') {
            userMsg = "What internships are best for me?";
            botReply = `With your ${profile.title} profile, you should target: ${profile.internships.slice(0, 2).join(', ')}. Check out the detailed career path I've opened for you in the center!`;
        } else if (type === 'resume') {
            userMsg = "How can I fix my resume?";
            botReply = "Your resume needs to highlight your high XP and profile archetype. I recommend using a 'Skill-First' layout. Upload your current resume, and I'll do a 25-point check for you!";
        } else if (type === 'dna') {
            userMsg = "Explain my Career DNA.";
            botReply = `You are a ${profile.title}! This means ${profile.desc.toLowerCase()} Your top traits are ${profile.traits.join(', ')}.`;
        } else if (type === 'mindset') {
            userMsg = "How is my mental suitability for this career?";
            botReply = "I've analyzed your psychological markers. You show great potential in areas requiring high empathy and resilience! Check out the 'Mindset & Wellness' tab for your holistic assessment.";
        } else {
            setActiveTab('dashboard');
            return;
        }

        setMessages(prev => [
            ...prev,
            { role: 'user', text: userMsg },
            { role: 'assistant', text: botReply }
        ]);
    };

    // Manual Send Logic
    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        const userText = input.toLowerCase();
        setInput('');

        setTimeout(() => {
            let reply = "I'm analyzing that for you... ";
            if (userText.includes('salary') || userText.includes('money')) {
                reply = `For ${profile.title} roles, freshers can expect ₹12L - ₹25L in India, especially after graduating from colleges like ${profile.colleges.iit[0]}.`;
            } else if (userText.includes('skill') || userText.includes('learn')) {
                reply = `You should focus on mastering ${profile.traits.join(', ')}. Check out our recommended courses in the Internships section!`;
            } else {
                reply = `As a ${profile.title}, your best path is to balance your ${profile.traits[0]} skills with active field projects. What else can I help with?`;
            }
            setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        }, 800);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages]);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    if (Object.keys(answers).length === 0 && xp === 0) {
        return (
            <div className="empty-results">
                <div className="glass-card centered-card">
                    <Bot size={60} color="#8b5cf6" />
                    <h2>No DNA Data Found</h2>
                    <p>It looks like you haven't completed the test yet. Let's start your journey!</p>
                    <Link to="/test" className="btn-primary-v2">Start Test Now</Link>
                </div>
            </div>
        );
    }

    // Helper Components for different views
    const renderColleges = () => (
        <div className="recommendations-view">
            <h2 className="view-title">Top Recommended Colleges (India)</h2>
            <div className="category-group">
                <div className="category-header"><Trophy size={22} color="#f59e0b" /> IITs & Tier-1 Institutions</div>
                <div className="category-grid">
                    {profile.colleges.iit.map(name => (
                        <div key={name} className="college-card glass-card" onClick={() => handleExternalLink('google', name)} style={{ cursor: 'pointer' }}>
                            <Landmark size={30} />
                            <div>
                                <h5>{name}</h5>
                                <p>Premium Placement Cycle</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="category-group">
                <div className="category-header"><Star size={22} color="#06b6d4" /> NITs & Government Excellence</div>
                <div className="category-grid">
                    {profile.colleges.nit.map(name => (
                        <div key={name} className="college-card glass-card" onClick={() => handleExternalLink('google', name)} style={{ cursor: 'pointer' }}>
                            <Landmark size={30} />
                            <div>
                                <h5>{name}</h5>
                                <p>National Influence</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="category-group">
                <div className="category-header"><Globe size={22} color="#10b981" /> Top Private & Regional Universities</div>
                <div className="category-grid">
                    {profile.colleges.regional.map(name => (
                        <div key={name} className="college-card glass-card" onClick={() => handleExternalLink('google', name)} style={{ cursor: 'pointer' }}>
                            <Landmark size={30} />
                            <div>
                                <h5>{name}</h5>
                                <p>Industry Co-labs</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderInternships = () => (
        <div className="recommendations-view">
            <h2 className="view-title">🚀 Your Future Career Paths</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
                Based on your Career DNA — <strong style={{ color: profile.theme }}>{profile.title}</strong> — here are the real careers you can build your future on.
            </p>

            {/* Career Path Cards */}
            <div className="career-paths-grid">
                {(profile.careers || []).map((career, i) => (
                    <motion.div
                        key={career.title}
                        className="career-path-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => handleExternalLink('google', career.title + ' career India')}
                        style={{ cursor: 'pointer', borderLeft: `4px solid ${career.color}` }}
                    >
                        <div className="career-card-header">
                            <div className="career-icon-wrap" style={{ background: `${career.color}20` }}>
                                <Briefcase size={24} color={career.color} />
                            </div>
                            <div className="career-card-title">
                                <h3>{career.title}</h3>
                                <span className="career-industry-tag" style={{ background: `${career.color}15`, color: career.color }}>
                                    {career.industry}
                                </span>
                            </div>
                        </div>
                        <p className="career-card-desc">{career.desc}</p>
                        <div className="career-card-meta">
                            <div className="career-meta-item">
                                <IndianRupee size={15} />
                                <span>{career.salary} / year</span>
                            </div>
                            <div className="career-meta-item">
                                <TrendingUp size={15} />
                                <span>{career.growth}</span>
                            </div>
                        </div>
                        <div className="career-skills-row">
                            {career.skills.map(skill => (
                                <span key={skill} className="career-skill-pill" style={{ background: `${career.color}15`, color: career.color }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Secondary: Internships & Courses */}
            <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--color-text-main)' }}>
                    🏢 Top Internships to Gain Experience
                </h3>
                <div className="list-grid">
                    {profile.internships.map(role => (
                        <div key={role} className="list-item glass-card" onClick={() => handleExternalLink('google', role + ' internship')} style={{ cursor: 'pointer' }}>
                            <Target size={20} />
                            <span>{role}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--color-text-main)' }}>
                    📚 Essential Upskilling Courses
                </h3>
                <div className="list-grid">
                    {profile.courses.map(course => (
                        <div key={course} className="list-item glass-card" onClick={() => handleExternalLink('course', course)} style={{ cursor: 'pointer' }}>
                            <Zap size={20} />
                            <span>{course}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );


    const renderResumeFixer = () => (
        <div className="recommendations-view">
            <h2 className="view-title">AI Resume Fixer</h2>
            <div className="resume-grid glass-card">
                <div className="upload-zone">
                    <FileText size={60} color={profile.theme} />
                    <h3>Drop your Resume here</h3>
                    <p>I'll analyze it for 25+ industry parameters!</p>
                    <button className="btn-primary-v2" onClick={() => handleExternalLink('google', 'ATS Resume Template')}>Browse Files</button>
                </div>
                <div className="resume-tips">
                    <h4>Top Tips for {profile.title}s</h4>
                    <ul className="tip-list">
                        <li>Highlight projects involving {profile.traits[0]}</li>
                        <li>Quantify your impact with <span>Metric-Driven Statements</span></li>
                        <li>Use an ATS-friendly single column template</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderMindset = () => {
        const mindsetScores = {
            resilience: Math.min(100, (scores.resilience || 0) * 12 + 65),
            empathy: Math.min(100, (scores.empathy || 0) * 12 + 70),
            patience: Math.min(100, (scores.patience || 0) * 12 + 60),
            ethics: Math.min(100, (scores.ethics || 0) * 12 + 75),
            discipline: Math.min(100, (scores.discipline || 0) * 12 + 68)
        };

        return (
            <div className="recommendations-view mindset-view">
                <h2 className="view-title">Holistic Mindset & Wellness Profile</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    A successful career isn't just about skills — it's about your mental approach and emotional intelligence.
                </p>

                <div className="mindset-grid">
                    <div className="mindset-main glass-card">
                        <h3><Sparkles size={22} color="#f43f5e" /> Psychological Suitability</h3>
                        <div className="mindset-score-list">
                            {Object.entries(mindsetScores).map(([key, val]) => (
                                <div key={key} className="mindset-item">
                                    <div className="ms-info">
                                        <span className="ms-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                        <span className="ms-val">{val}% Match</span>
                                    </div>
                                    <div className="ms-bar-bg">
                                        <motion.div
                                            className="ms-bar-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${val}%` }}
                                            style={{ background: profile.theme }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mindset-insights">
                        <div className="insight-card glass-card">
                            <h4><Target size={18} color="#10b981" /> Work-Life Balance Tip</h4>
                            <p>As a {profile.title}, you tend to go all-in. Remember to set boundaries to maintain your high {mindsetScores.resilience > 80 ? 'resilience' : 'creativity'}.</p>
                        </div>
                        <div className="insight-card glass-card">
                            <h4><Briefcase size={18} color="#8b5cf6" /> Cultural Fit</h4>
                            <p>You thrive in environments that value <strong>{mindsetScores.ethics > 85 ? 'high ethics' : 'innovation'}</strong> and <strong>{mindsetScores.empathy > 85 ? 'collaborative empathy' : 'efficiency'}</strong>.</p>
                        </div>
                    </div>
                </div>

                <div className="wellness-section glass-card" style={{ marginTop: '2rem' }}>
                    <h3><Heart size={22} color="#f43f5e" /> Personalized Wellness Recommendation</h3>
                    <p>Building a career as a {profile.title} can be demanding. Our analysis suggests that focusing on <strong>{mindsetScores.patience < 70 ? 'strategic patience' : 'mindful leadership'}</strong> will significantly boost your long-term success.</p>
                </div>
            </div>
        );
    };

    const renderDNAResult = () => (
        <div className="recommendations-view dna-view">
            <h2 className="view-title">Your Technical Career DNA</h2>
            <motion.div
                className="dna-card-full glass-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="dna-content">
                    <span className="badge-dna">CAREER DNA MATCH</span>
                    <h2>{profile.title}</h2>
                    <p>{profile.desc}</p>
                    <div className="trait-pills">
                        {profile.traits.map(t => <span key={t} className="pill" style={{ background: `${profile.theme}20`, color: profile.theme }}>{t}</span>)}
                    </div>
                    <button
                        className={`cert-download-btn-inline ${isDownloading ? 'loading' : ''}`}
                        onClick={downloadCertificate}
                        disabled={isDownloading}
                        style={{
                            marginTop: '1.5rem',
                            background: '#1e3a8a',
                            color: '#ffffff',
                            padding: '12px 24px',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Award size={18} color="#ffffff" /> {isDownloading ? 'Preparing...' : 'Download My Certificate'}
                    </button>
                </div>
                <div className="dna-visual">
                    <Bot size={120} color={profile.theme} strokeWidth={1} />
                </div>
            </motion.div>

            <div className="dna-details-grid">
                <div className="roadmap-card glass-card">
                    <h3><TrendingUp size={22} color="#8b5cf6" /> 4-Year Success Roadmap</h3>
                    <div className="timeline">
                        {profile.roadmap.map((step, i) => (
                            <div key={i} className="timeline-item">
                                <div className="time-marker">{step.icon}</div>
                                <div className="time-content">
                                    <h5>{step.year}</h5>
                                    <p>{step.task}</p>
                                </div>
                                {i < profile.roadmap.length - 1 && <div className="time-line"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="exams-card glass-card">
                    <h3><IndianRupee size={22} color="#10b981" /> Top Entrance Exams</h3>
                    <div className="exam-pills">
                        {profile.exams.map(exam => (
                            <div key={exam} className="exam-pill">
                                <CheckCircle2 size={16} />
                                <span>{exam}</span>
                            </div>
                        ))}
                    </div>
                    <div className="salary-hint">
                        <h5>Expected Starting Salary</h5>
                        <p>₹12L - ₹25L per annum</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const [isDownloading, setIsDownloading] = useState(false);
    const certificateRef = useRef(null);
    const userName = localStorage.getItem('user_name') || 'Student';

    const downloadCertificate = async () => {
        setIsDownloading(true);
        // Wait for a tick to ensure the certificate template is rendered if it was conditionally shown
        setTimeout(async () => {
            try {
                const element = certificateRef.current;
                const canvas = await html2canvas(element, {
                    scale: 3, // High quality
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width / 3, canvas.height / 3]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
                pdf.save(`FuturePath_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
            } catch (error) {
                console.error("Certificate download failed:", error);
            } finally {
                setIsDownloading(false);
            }
        }, 100);
    };

    return (
        <div className="results-wrapper">
            {/* Hidden Certificate Template for PDF Generation */}
            <div style={{ position: 'fixed', left: '-5000px', top: '0', width: '1120px', zIndex: -1 }}>
                <div ref={certificateRef} style={{
                    width: '1120px',
                    height: '792px',
                    backgroundColor: '#ffffff',
                    padding: '40px',
                    fontFamily: "'Inter', sans-serif",
                    color: '#0f172a',
                    display: 'block',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ padding: '10px', backgroundColor: '#ffffff', border: '2px solid #1e3a8a', position: 'relative', height: '100%', boxSizing: 'border-box' }}>
                        <div style={{
                            border: '12px double #1e3a8a',
                            padding: '60px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            background: 'white',
                            boxSizing: 'border-box'
                        }}>
                            {/* Subtle Watermark */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%) rotate(-30deg)',
                                fontSize: '150px',
                                fontWeight: '900',
                                color: 'rgba(30, 58, 138, 0.03)',
                                pointerEvents: 'none',
                                zIndex: 0,
                                whiteSpace: 'nowrap'
                            }}>FuturePath</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <Sparkles size={60} color="#1e3a8a" />
                                    <h1 style={{ fontSize: '3rem', color: '#1e3a8a', margin: '0', fontWeight: '900', letterSpacing: '-1px' }}>FuturePath</h1>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8', margin: '0' }}>CERTIFICATE ID: FP-2026-{Math.floor(100000 + Math.random() * 900000)}</p>
                                    <p style={{ fontWeight: '900', fontSize: '14px', color: '#2563eb', margin: '5px 0 0', letterSpacing: '3px' }}>OFFICIAL ASSESSMENT</p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', zIndex: 1, margin: '20px 0' }}>
                                <p style={{ fontSize: '1.4rem', fontStyle: 'italic', color: '#475569', marginBottom: '15px' }}>This is to certify that</p>
                                <h2 style={{
                                    fontSize: '5rem',
                                    color: '#0f172a',
                                    margin: '0 0 25px',
                                    fontFamily: "'Georgia', serif",
                                    fontWeight: '700',
                                    borderBottom: '3px solid #f1f5f9',
                                    display: 'inline-block',
                                    padding: '0 60px 10px'
                                }}>{userName}</h2>
                                <p style={{ fontSize: '1.2rem', color: '#334155', maxWidth: '850px', margin: '0 auto 30px', lineHeight: '1.6' }}>
                                    has successfully completed the comprehensive assessment for career suitability and demonstrated exceptional professional potential in the field of:
                                </p>

                                <div style={{ margin: '20px auto', padding: '20px 50px', border: `4px solid ${profile.theme}`, borderRadius: '15px', display: 'inline-block', backgroundColor: '#fcfdfe' }}>
                                    <h3 style={{ fontSize: '2.4rem', fontWeight: '900', margin: '0 0 15px', color: profile.theme, textTransform: 'uppercase', letterSpacing: '1px' }}>{profile.title}</h3>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                                        {profile.traits.map(t => (
                                            <span key={t} style={{ padding: '5px 15px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '25px', fontSize: '14px', fontWeight: '800', color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>{t}</span>
                                        ))}
                                    </div>
                                    {/* Suggested Career Paths */}
                                    <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: '2px dashed #e2e8f0' }}>
                                        <p style={{ fontSize: '13px', fontWeight: '900', color: '#64748b', margin: '0 0 15px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Recommended Career Paths</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {profile.careers && profile.careers.slice(0, 3).map((career, idx) => (
                                                <div key={idx} style={{ 
                                                    padding: '12px 18px', 
                                                    background: `${profile.theme}08`, 
                                                    border: `1px solid ${profile.theme}20`, 
                                                    borderRadius: '8px',
                                                    textAlign: 'left'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                        <Target size={16} color={profile.theme} />
                                                        <span style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>{career.title || career}</span>
                                                    </div>
                                                    {career.desc && (
                                                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0', lineHeight: '1.4' }}>{career.desc}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '10px', borderLeft: `8px solid ${profile.theme}`, textAlign: 'left', maxWidth: '900px', margin: '20px auto', zIndex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', color: '#475569', marginBottom: '10px' }}>Strategic Career Guidance</div>
                                <p style={{ fontSize: '17px', color: '#1e293b', margin: '0', lineHeight: '1.6' }}>{profile.desc}</p>
                                
                                {/* 4-Year Roadmap Preview */}
                                {profile.roadmap && profile.roadmap.length > 0 && (
                                    <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: '2px dashed #e2e8f0' }}>
                                        <p style={{ fontSize: '13px', fontWeight: '900', color: '#64748b', margin: '0 0 15px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>4-Year Strategic Roadmap</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            {profile.roadmap.slice(0, 4).map((step, idx) => (
                                                <div key={idx} style={{ 
                                                    padding: '12px', 
                                                    background: 'white', 
                                                    border: `1px solid ${profile.theme}20`, 
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '10px'
                                                }}>
                                                    <div style={{ 
                                                        minWidth: '30px', 
                                                        height: '30px', 
                                                        background: `${profile.theme}15`, 
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: profile.theme,
                                                        fontSize: '12px',
                                                        fontWeight: '900'
                                                    }}>
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '3px' }}>{step.year}</div>
                                                        <div style={{ fontSize: '12px', color: '#1e293b', lineHeight: '1.3' }}>{step.task}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Key Skills Section */}
                                {profile.keySkills && profile.keySkills.length > 0 && (
                                    <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: '2px dashed #e2e8f0' }}>
                                        <p style={{ fontSize: '13px', fontWeight: '900', color: '#64748b', margin: '0 0 15px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Essential Skills to Develop</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {profile.keySkills.slice(0, 8).map((skill, idx) => (
                                                <span key={idx} style={{ 
                                                    padding: '8px 16px', 
                                                    background: `${profile.theme}10`, 
                                                    border: `1px solid ${profile.theme}30`, 
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: profile.theme
                                                }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '3rem', color: '#1e3a8a', marginBottom: '5px' }}>FuturePath Council</div>
                                    <div style={{ width: '240px', height: '1px', background: '#94a3b8', margin: '10px 0' }}></div>
                                    <p style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '900', color: '#64748b', margin: '0', letterSpacing: '1px' }}>Board of Career Direction</p>
                                </div>

                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '150px', height: '150px', border: '5px solid #f1f5f9', borderRadius: '50%', padding: '5px', background: '#fcfdfe' }}>
                                        <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #1e3a8a', textAlign: 'center' }}>
                                            <Award size={75} color="#1e3a8a" strokeWidth={1} />
                                            <div style={{ fontSize: '9px', fontWeight: '900', color: '#1e3a8a', marginTop: '6px', width: '90px', lineHeight: '1.2' }}>VERIFIED AUTHENTIC ASSESSMENT</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', margin: '0' }}>ISSUED ON</p>
                                        <p style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '5px 0 0' }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f8fafc', padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ width: '45px', height: '45px', background: 'white', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Maximize size={28} color="#cbd5e1" />
                                        </div>
                                        <p style={{ fontSize: '12px', fontWeight: '900', color: '#64748b', margin: '0', textTransform: 'uppercase' }}>QR Verify</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Dashboard Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="profile-section">
                    <div className="profile-avatar">
                        <UserCircle size={60} color={profile.theme} />
                        <span className="xp-badge">{xp} XP</span>
                    </div>
                    <h3>Devashree</h3>
                    <p className="archetype-label" style={{ color: profile.theme }}>{profile.title}</p>
                </div>

                <nav className="dashboard-nav">
                    <button
                        className={`nav-item ${activeTab === 'internships' ? 'active' : ''}`}
                        onClick={() => triggerSuggestion('internships')}
                    >
                        <Briefcase size={18} /> <span>Career Opportunities</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => triggerSuggestion('analytics')}
                    >
                        <PieChart size={18} /> <span>Performance Report</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'dna' ? 'active' : ''}`}
                        onClick={() => triggerSuggestion('dna')}
                    >
                        <Zap size={18} /> <span>Career DNA</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <Target size={18} /> <span>Overview</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'colleges' ? 'active' : ''}`}
                        onClick={() => triggerSuggestion('colleges')}
                    >
                        <GraduationCap size={18} /> <span>Colleges</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'resume' ? 'active' : ''}`}
                        onClick={() => triggerSuggestion('resume')}
                    >
                        <FileText size={18} /> <span>Resume Fixer</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'mindset' ? 'active' : ''}`}
                        onClick={() => triggerSuggestion('mindset')}
                    >
                        <Heart size={18} /> <span>Mindset & Wellness</span>
                    </button>
                    <button
                        className="nav-item"
                        style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', borderRadius: 0, paddingTop: '1.5rem' }}
                        onClick={() => {
                            if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <TrendingUp size={18} style={{ transform: 'rotate(-90deg)' }} /> <span>Scroll to Top</span>
                    </button>
                </nav>

                <div className="sidebar-scroll-area">
                    <div className="progress-card glass-card">
                        <h4>Skill Mastery</h4>
                        <div className="skill-bars">
                            {profile.traits.map(trait => {
                                const scoreValue = Math.min(100, (scores[trait.toLowerCase()] || 0) * 10 + 60);
                                return (
                                    <div key={trait} className="skill-bar-item">
                                        <div className="sb-header">
                                            <span>{trait}</span>
                                            <span>{scoreValue}%</span>
                                        </div>
                                        <div className="sb-bg">
                                            <div
                                                className="sb-fill"
                                                style={{
                                                    width: `${scoreValue}%`,
                                                    background: profile.theme
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="results-main" ref={mainRef}>
                <header className="results-header">
                    <Link to="/test" className="back-btn"><ChevronLeft size={18} /> Retake Test</Link>
                    <div className="action-btns">
                        <button className="btn-icon" onClick={handleShare}><Share2 size={20} /> LinkedIn</button>
                        <button className="btn-primary-v2" onClick={handleDownload}><Download size={20} /> Download PDF</button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="student-dashboard">
                                {/* Welcome Banner */}
                                <div className="welcome-banner glass-card" style={{ borderLeft: `5px solid ${profile.theme}` }}>
                                    <div className="welcome-text">
                                        <h2>👋 Welcome back, Devashree!</h2>
                                        <p>Your Career DNA has been analyzed. You're a <strong style={{ color: profile.theme }}>{profile.title}</strong> with <strong>{xp} XP</strong> earned. Here's your personalized dashboard.</p>
                                    </div>
                                    <div className="welcome-xp-badge" style={{ background: `${profile.theme}20`, border: `2px solid ${profile.theme}` }}>
                                        <span style={{ color: profile.theme, fontSize: '2rem', fontWeight: 900 }}>{xp}</span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>XP EARNED</span>
                                    </div>
                                </div>

                                {/* Score Grid */}
                                <div className="dashboard-score-grid">
                                    {Object.entries(scores).map(([domain, val]) => {
                                        const pct = Math.min(100, val * 10 + 20);
                                        const colors = { logic: '#6366f1', tech: '#06b6d4', creative: '#a855f7', lead: '#10b981', business: '#f59e0b', social: '#f43f5e' };
                                        return (
                                            <div key={domain} className="score-domain-card glass-card">
                                                <div className="score-domain-header">
                                                    <span className="score-domain-name">{domain.charAt(0).toUpperCase() + domain.slice(1)}</span>
                                                    <span className="score-domain-pct" style={{ color: colors[domain] }}>{pct}%</span>
                                                </div>
                                                <div className="score-domain-bar-bg">
                                                    <motion.div
                                                        className="score-domain-bar-fill"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        style={{ background: colors[domain] }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Quick Actions */}
                                <h3 className="dash-section-title">🚀 Quick Actions</h3>
                                <div className="quick-actions-grid">
                                    {[
                                        { icon: <Award size={22} />, label: 'Award Certificate', color: '#1e3a8a', action: downloadCertificate, loading: isDownloading, premium: true },
                                        { icon: <Briefcase size={22} />, label: 'View Career Paths', color: '#8b5cf6', tab: 'internships' },
                                        { icon: <PieChart size={22} />, label: 'Performance Report', color: '#06b6d4', tab: 'analytics' },
                                        { icon: <GraduationCap size={22} />, label: 'Best Colleges', color: '#10b981', tab: 'colleges' },
                                        { icon: <Zap size={22} />, label: 'Career DNA', color: '#f59e0b', tab: 'dna' },
                                        { icon: <Heart size={22} />, label: 'Mindset & Wellness', color: '#f43f5e', tab: 'mindset' },
                                        { icon: <FileText size={22} />, label: 'Fix My Resume', color: '#ec4899', tab: 'resume' },
                                    ].map(action => (
                                        <button
                                            key={action.tab || action.label}
                                            className={`quick-action-btn glass-card ${action.loading ? 'loading' : ''} ${action.premium ? 'premium' : ''}`}
                                            onClick={() => action.action ? action.action() : triggerSuggestion(action.tab)}
                                            style={{ borderTop: `3px solid ${action.color}` }}
                                            disabled={action.loading}
                                        >
                                            <div className="qa-icon" style={{ color: action.color, background: `${action.color}15` }}>{action.icon}</div>
                                            <span>{action.loading ? 'Generating...' : action.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Strengths & Gaps */}
                                <div className="dash-two-col">
                                    <div className="dash-strengths glass-card">
                                        <h3><CheckCircle2 size={20} color="#10b981" /> Your Top Strengths</h3>
                                        <div className="dash-trait-list">
                                            {analysis.strengths.map((s, i) => (
                                                <div key={s} className="dash-trait-item" style={{ animationDelay: `${i * 0.1}s` }}>
                                                    <span className="dash-trait-rank" style={{ background: '#10b98120', color: '#10b981' }}>#{i + 1}</span>
                                                    <span className="dash-trait-name">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                                                    <span className="dash-trait-badge" style={{ background: '#10b98115', color: '#10b981' }}>Strong</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="dash-gaps glass-card">
                                        <h3><Target size={20} color="#f43f5e" /> Areas to Improve</h3>
                                        <div className="dash-trait-list">
                                            {analysis.weaknesses.map((w, i) => (
                                                <div key={w} className="dash-trait-item">
                                                    <span className="dash-trait-rank" style={{ background: '#f43f5e20', color: '#f43f5e' }}>!</span>
                                                    <span className="dash-trait-name">{w.charAt(0).toUpperCase() + w.slice(1)}</span>
                                                    <button className="dash-trait-action" onClick={() => handleExternalLink('course', w + ' skills')}>Learn →</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Roadmap Preview */}
                                <h3 className="dash-section-title">🗓️ Your 4-Year Roadmap</h3>
                                <div className="dash-roadmap glass-card">
                                    {profile.roadmap.map((step, i) => (
                                        <div key={i} className="dash-roadmap-step">
                                            <div className="dash-roadmap-marker" style={{ background: `${profile.theme}20`, color: profile.theme }}>
                                                {step.icon}
                                            </div>
                                            <div className="dash-roadmap-content">
                                                <strong>{step.year}</strong>
                                                <p>{step.task}</p>
                                            </div>
                                            {i < profile.roadmap.length - 1 && <div className="dash-roadmap-line" style={{ background: `${profile.theme}40` }} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}


                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderAnalytics()}
                        </motion.div>
                    )}

                    {activeTab === 'dna' && (
                        <motion.div
                            key="dna"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderDNAResult()}
                        </motion.div>
                    )}

                    {activeTab === 'colleges' && (
                        <motion.div
                            key="colleges"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderColleges()}
                        </motion.div>
                    )}

                    {activeTab === 'internships' && (
                        <motion.div
                            key="internships"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderInternships()}
                        </motion.div>
                    )}

                    {activeTab === 'resume' && (
                        <motion.div
                            key="resume"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderResumeFixer()}
                            {/* Floating Back to Top for Main Content Area */}
                            <button
                                className="floating-back-to-top"
                                onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                <TrendingUp size={24} style={{ transform: 'rotate(-90deg)' }} />
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'mindset' && (
                        <motion.div
                            key="mindset"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderMindset()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Career Consultant Sidebar */}
            <aside className="expert-consultant-sidebar">
                <div className="consultant-head">
                    <Bot size={28} />
                    <div>
                        <h4>Expert Career Consultant</h4>
                        <span className="online-tag">Online & Analyzing</span>
                    </div>
                </div>
                <div className="chat-area">
                    {messages.map((m, i) => (
                        <div key={i} className={`chat-bubble ${m.role}`}>
                            {m.text}
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>
                <div className="chat-features">
                    <button className="feat-btn" onClick={() => triggerSuggestion('resume')}><FileText size={14} /> Upload Resume</button>
                    <button className="feat-btn"><TrendingUp size={14} /> Practice Interview</button>
                </div>
                <form className="chat-input-wrapper" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Ask about MBA, CET, or salaries..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit"><Send size={18} /></button>
                </form>
            </aside>
        </div>
    );
};

export default Results;

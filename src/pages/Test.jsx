import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, ArrowLeft, Timer, Award, Zap, Target, Star, ShieldCheck, Heart, Sparkles, Binary, PenTool, TrendingUp } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import './Test.css';

const DEFAULT_QUESTIONS = [
    // 1. Psychological Fact - Cognitive Bias
    {
        id: 1,
        type: 'personality',
        text: "Psychological Fact: 'Confirmation Bias' means people seek info that confirms their beliefs. How do you typically make decisions?",
        options: [
            { id: 'a', text: 'I actively seek opposing viewpoints before deciding', score: { logic: 10, social: 8, psychology: 10 } },
            { id: 'b', text: 'I go with my gut feeling first, then research', score: { intuition: 8, creative: 6 } },
            { id: 'c', text: 'I analyze all data systematically, regardless of bias', score: { logic: 10, tech: 8, psychology: 5 } },
            { id: 'd', text: 'I follow what experts or mentors suggest', score: { social: 8, lead: 4 } }
        ],
        timeLimit: 60
    },
    // 2. Creative Art Concept
    {
        id: 2,
        type: 'image',
        text: "Art Theory: In design, what does 'negative space' primarily serve?",
        image: '/pattern2.png',
        options: [
            { id: 'a', text: 'Fills the canvas with more visual elements', score: { creative: 2 } },
            { id: 'b', text: 'Creates focus, balance, and breathing room in composition', score: { creative: 10, aesthetics: 10, psychology: 8 } },
            { id: 'c', text: 'Represents sadness in abstract art', score: { creative: 3 } },
            { id: 'd', text: 'Makes the design look incomplete', score: { creative: 1 } }
        ],
        timeLimit: 60
    },
    // 3. Legal Concept - Contract Law
    {
        id: 3,
        type: 'puzzle',
        text: "Contract Law: Which element is NOT required for a valid contract?",
        options: [
            { id: 'a', text: 'Offer & Acceptance', score: { logic: 5 } },
            { id: 'b', text: 'Consideration (exchange of value)', score: { logic: 5 } },
            { id: 'c', text: 'Both parties wearing formal clothes', score: { logic: 10, ethics: 10, law: 10 } },
            { id: 'd', text: 'Legal intent', score: { logic: 5 } }
        ],
        timeLimit: 60
    },
    // 4. Psychological Fact - Memory & Learning
    {
        id: 4,
        type: 'scenario',
        text: "Psych Fact: 'Spaced Repetition' improves memory retention by 90%+. How do you prefer to learn complex skills?",
        options: [
            { id: 'a', text: 'One intensive workshop for 8 hours', score: { business: 5, lead: 3 } },
            { id: 'b', text: 'Multiple short sessions over weeks with practice', score: { psychology: 10, learning: 10, persistence: 8 } },
            { id: 'c', text: 'Reading a book once thoroughly', score: { tech: 4 } },
            { id: 'd', text: 'Teach it to others immediately', score: { social: 8, lead: 6 } }
        ],
        timeLimit: 60
    },
    // 5. Artistic Perspective - Color Psychology
    {
        id: 5,
        type: 'interest',
        text: "Color Psychology: Which color palette would best represent 'trust & stability' for a new tech startup logo?",
        options: [
            { id: 'a', text: 'Bright neon pink & yellow', score: { creative: 3 } },
            { id: 'b', text: 'Deep blue with white accents', score: { creative: 10, design: 10, psychology: 9 } },
            { id: 'c', text: 'Red and black only', score: { creative: 5 } },
            { id: 'd', text: 'Rainbow gradient', score: { creative: 6 } }
        ],
        timeLimit: 60
    },
    // 6. Law & Ethics - Intellectual Property
    {
        id: 6,
        type: 'aptitude',
        text: "IP Law: If you create an artwork digitally, who typically owns the copyright initially?",
        options: [
            { id: 'a', text: 'The company that hosts it online', score: { logic: 2 } },
            { id: 'b', text: 'The creator of the work themselves', score: { law: 10, ethics: 10, creative: 8 } },
            { id: 'c', text: 'The general public automatically', score: { logic: 1 } },
            { id: 'd', text: 'The government', score: { logic: 2 } }
        ],
        timeLimit: 60
    },
    // 7. Psychological Fact - Motivation
    {
        id: 7,
        type: 'personality',
        text: "Psych Fact: Intrinsic motivation (internal drive) outperforms extrinsic (rewards). What motivates you most?",
        options: [
            { id: 'a', text: 'Money and external recognition', score: { motivation: 4, psychology: 2 } },
            { id: 'b', text: 'Mastery, purpose, and personal growth', score: { motivation: 10, psychology: 10, resilience: 9 } },
            { id: 'c', text: 'Competition with peers', score: { motivation: 5, psychology: 3 } },
            { id: 'd', text: 'Fear of failure', score: { motivation: 3, psychology: 4 } }
        ],
        timeLimit: 60
    },
    // 8. Creative Problem Solving
    {
        id: 8,
        type: 'scenario',
        text: "Art Challenge: A client wants a poster showing 'progress over time' visually. Your approach?",
        options: [
            { id: 'a', text: 'Use arrows pointing upward', score: { creative: 5, design: 4 } },
            { id: 'b', text: 'Design steps/mountain metaphor with growth imagery', score: { creative: 10, design: 10, psychology: 8 } },
            { id: 'c', text: 'Just write the word Progress large', score: { creative: 1 } },
            { id: 'd', text: 'Use a simple bar chart', score: { tech: 6, creative: 3 } }
        ],
        timeLimit: 60
    },
    // 9. Legal - Constitutional Rights
    {
        id: 9,
        type: 'aptitude',
        text: "Constitutional Law: In India, the Right to Freedom of Speech is guaranteed under which article?",
        options: [
            { id: 'a', text: 'Article 19(1)(a)', score: { law: 10, logic: 9, civics: 10 } },
            { id: 'b', text: 'Article 25(a)', score: { law: 3 } },
            { id: 'c', text: 'Article 32', score: { law: 5 } },
            { id: 'd', text: 'Article 44', score: { law: 2 } }
        ],
        timeLimit: 60
    },
    // 10. Psychological Fact - Cognitive Load
    {
        id: 10,
        type: 'interest',
        text: "Psych Fact: humans can only hold 4 chunks of info in working memory. In UI design, you'd apply this by:",
        options: [
            { id: 'a', text: 'Showing 20+ options to give users choices', score: { logic: 1 } },
            { id: 'b', text: 'Grouping info into 3-4 categories with clear hierarchy', score: { psychology: 10, creative: 10, tech: 8, design: 9 } },
            { id: 'c', text: 'Adding flashing animations to capture attention', score: { creative: 5, design: 3 } },
            { id: 'd', text: 'Making the interface as dense as possible', score: { logic: 2 } }
        ],
        timeLimit: 60
    },
    // 11. Artistic Style & Medium
    {
        id: 11,
        type: 'image',
        text: "Art Styles: Which medium best blends traditional hand-craft with modern digital tools?",
        image: '/pattern3.png',
        options: [
            { id: 'a', text: 'Only pure oil painting', score: { creative: 5 } },
            { id: 'b', text: 'Only digital art on tablets', score: { tech: 8, creative: 7 } },
            { id: 'c', text: 'Hand-drawn sketches scanned & digitally enhanced', score: { creative: 10, aesthetics: 10, fusion: 10 } },
            { id: 'd', text: 'AI-generated art only', score: { tech: 8, creative: 3 } }
        ],
        timeLimit: 60
    },
    // 12. Legal - Data Privacy
    {
        id: 12,
        type: 'scenario',
        text: "Data Protection Law: A company must get user consent before using their data. This principle is from:",
        options: [
            { id: 'a', text: 'GDPR (EU) & Digital Personal Data Protection Act (India)', score: { law: 10, ethics: 10, tech: 8 } },
            { id: 'b', text: 'Marketing guidelines only', score: { logic: 2 } },
            { id: 'c', text: 'Suggestions, not requirements', score: { ethics: 1 } },
            { id: 'd', text: 'Only applies to banks', score: { law: 3 } }
        ],
        timeLimit: 60
    },
    // 13. Psychological Concepts - Flow State
    {
        id: 13,
        type: 'personality',
        text: "Psych Concept: 'Flow' happens when challenge level matches skill. When do you feel most productive?",
        options: [
            { id: 'a', text: 'Tasks that are way too easy', score: { psychology: 2 } },
            { id: 'b', text: 'When challenge slightly exceeds current skill level', score: { psychology: 10, resilience: 10, learning: 9 } },
            { id: 'c', text: 'Relaxing without any challenge', score: { psychology: 3 } },
            { id: 'd', text: 'When tasks are impossible', score: { psychology: 1 } }
        ],
        timeLimit: 60
    },
    // 14. Creative Typography & Branding
    {
        id: 14,
        type: 'interest',
        text: "Brand Identity: How does typography communicate personality in brand design?",
        options: [
            { id: 'a', text: 'All fonts look the same', score: { creative: 1 } },
            { id: 'b', text: 'Font choice (serif=traditional, sans=modern) conveys brand values instantly', score: { creative: 10, design: 10, psychology: 9, branding: 10 } },
            { id: 'c', text: 'Bigger letters always mean more importance', score: { creative: 3 } },
            { id: 'd', text: 'Typography is just decoration', score: { creative: 2 } }
        ],
        timeLimit: 60
    },
    // 15. Law & Protection - Worker Rights
    {
        id: 15,
        type: 'puzzle',
        text: "Labor Law: A startup founder reduces employee pay by 40% without notice. This likely violates:",
        options: [
            { id: 'a', text: 'Nothing, employers can do this anytime', score: { law: 1 } },
            { id: 'b', text: 'Industrial Disputes Act & minimum wage regulations', score: { law: 10, ethics: 10, social: 9 } },
            { id: 'c', text: 'Only if it\'s on a Tuesday', score: { logic: 0 } },
            { id: 'd', text: 'Employee choice only', score: { law: 2 } }
        ],
        timeLimit: 60
    },
    // 16. Psychological - Emotional Intelligence
    {
        id: 16,
        type: 'scenario',
        text: "Emotional Intelligence: A colleague failed publicly. How do you respond?",
        options: [
            { id: 'a', text: 'Laugh at their mistake', score: { empathy: 0 } },
            { id: 'b', text: 'Offer private support & constructive feedback later', score: { empathy: 10, psychology: 10, social: 10, lead: 9 } },
            { id: 'c', text: 'Tell them to toughen up', score: { empathy: 2 } },
            { id: 'd', text: 'Ignore it completely', score: { social: 2 } }
        ],
        timeLimit: 60
    },
    // 17. Art Movement & Cultural Significance
    {
        id: 17,
        type: 'interest',
        text: "Art History: Renaissance art emphasized 'humanism.' Modern digital art emphasizes what?",
        options: [
            { id: 'a', text: 'Realism only', score: { creative: 3 } },
            { id: 'b', text: 'Human connection through interactivity & accessibility', score: { creative: 10, design: 10, social: 9, psychology: 8 } },
            { id: 'c', text: 'Maximum complexity at expense of clarity', score: { creative: 4 } },
            { id: 'd', text: 'Machines replacing artists', score: { creative: 2, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 18. Legal - Copyright vs Fair Use
    {
        id: 18,
        type: 'aptitude',
        text: "Fair Use Doctrine: Using a 10-second clip from a copyrighted song in your parody video is usually:",
        options: [
            { id: 'a', text: 'Always illegal', score: { law: 3 } },
            { id: 'b', text: 'Always free', score: { law: 2 } },
            { id: 'c', text: 'May be fair use if transformative & non-commercial', score: { law: 10, creative: 8, ethics: 9 } },
            { id: 'd', text: 'Only if you ask permission 30 days in advance', score: { law: 4 } }
        ],
        timeLimit: 60
    },
    // 19. Psychological Bias - Dunning-Kruger Effect
    {
        id: 19,
        type: 'personality',
        text: "Dunning-Kruger Effect: Beginners often overestimate competence. When learning something new, you typically:",
        options: [
            { id: 'a', text: 'Assume you\'ll be great immediately', score: { psychology: 1 } },
            { id: 'b', text: 'Recognize expertise gaps & seek mentorship early', score: { psychology: 10, learning: 10, humility: 10 } },
            { id: 'c', text: 'Judge others as less skilled', score: { psychology: 2 } },
            { id: 'd', text: 'Avoid anything challenging', score: { psychology: 3 } }
        ],
        timeLimit: 60
    },
    // 20. Creative Problem-Solving (Design Thinking)
    {
        id: 20,
        type: 'scenario',
        text: "Design Challenge: Design a sustainable packaging for a luxury chocolate brand. Your first step?",
        options: [
            { id: 'a', text: 'Jump to making prototypes immediately', score: { creative: 4 } },
            { id: 'b', text: 'Interview customers about their values & pain points', score: { creative: 10, design: 10, psychology: 9, business: 8 } },
            { id: 'c', text: 'Copy competitor packaging', score: { creativity: 1 } },
            { id: 'd', text: 'Use the cheapest materials possible', score: { logic: 2, ethics: 1 } }
        ],
        timeLimit: 60
    },
    // 21. Law & Online Behavior
    {
        id: 21,
        type: 'puzzle',
        text: "Cyber Law: Cyberbullying & harassment online can result in:",
        options: [
            { id: 'a', text: 'No consequences since it\'s online', score: { law: 1 } },
            { id: 'b', text: 'Criminal charges under IT Act Section 66A & civil liability', score: { law: 10, ethics: 10, social: 9 } },
            { id: 'c', text: 'Only warnings from social media', score: { law: 2 } },
            { id: 'd', text: 'Nothing if you use a fake name', score: { law: 1 } }
        ],
        timeLimit: 60
    },
    // 22. Psychological Resilience & Growth Mindset
    {
        id: 22,
        type: 'scenario',
        text: "Psych Fact: Carol Dweck's 'Growth Mindset' shows challenges build ability. How do you view setbacks?",
        options: [
            { id: 'a', text: 'Proof I\'m not talented', score: { psychology: 1, resilience: 0 } },
            { id: 'b', text: 'Opportunities to expand skills & knowledge', score: { psychology: 10, resilience: 10, learning: 10 } },
            { id: 'c', text: 'Bad luck', score: { psychology: 3 } },
            { id: 'd', text: 'Time to blame others', score: { psychology: 2, social: 0 } }
        ],
        timeLimit: 60
    },
    // 23. Art Activism & Social Commentary
    {
        id: 23,
        type: 'interest',
        text: "Activist Art: Artists like Banksy use street art for social change. This represents art's role as:",
        options: [
            { id: 'a', text: 'Pure decoration with no message', score: { creative: 2 } },
            { id: 'b', text: 'A powerful tool for awareness & activism on social issues', score: { creative: 10, social: 10, psychology: 8, ethics: 10 } },
            { id: 'c', text: 'Only entertainment', score: { creative: 5 } },
            { id: 'd', text: 'To make artists wealthy', score: { creative: 3 } }
        ],
        timeLimit: 60
    },
    // 24. Legal - Consent & Ethics in Business
    {
        id: 24,
        type: 'aptitude',
        text: "Business Ethics: In which scenario is informed consent legally & ethically required?",
        options: [
            { id: 'a', text: 'Only when signing contracts', score: { ethics: 4 } },
            { id: 'b', text: 'Before collecting personal data, medical treatment, or entering agreements', score: { law: 10, ethics: 10, business: 9 } },
            { id: 'c', text: 'Never, employers/companies decide for you', score: { ethics: 0 } },
            { id: 'd', text: 'Only for donations', score: { ethics: 3 } }
        ],
        timeLimit: 60
    },
    // 25. Psychological Concept - Purpose & Meaning
    {
        id: 25,
        type: 'personality',
        text: "Positive Psychology: Research shows purposeful work increases happiness by 31%. Your ideal career path would:",
        options: [
            { id: 'a', text: 'Maximize salary only', score: { psychology: 2 } },
            { id: 'b', text: 'Align personal values with meaningful impact on society', score: { psychology: 10, purpose: 10, resilience: 9, social: 8 } },
            { id: 'c', text: 'Be whatever\'s easiest', score: { psychology: 2 } },
            { id: 'd', text: 'Choose based on parent expectations', score: { psychology: 3 } }
        ],
        timeLimit: 60
    }
];

const levels = [
    { name: 'Beginner', minXp: 0, icon: <Zap size={16} /> },
    { name: 'Explorer', minXp: 30, icon: <Target size={16} /> },
    { name: 'Achiever', minXp: 60, icon: <Star size={16} /> },
    { name: 'Mastermind', minXp: 100, icon: <ShieldCheck size={16} /> }
];

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [xp, setXp] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [scrolledToTop, setScrolledToTop] = useState(false);
    const answeredIndices = useRef(new Set());
    const navigate = useNavigate();
    const timerRef = useRef(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('aptitude_questions')) || DEFAULT_QUESTIONS;
        setQuestions(stored);
        if (stored.length > 0) setTimeLeft(stored[0].timeLimit || 0);
    }, []);

    const currentQuestion = questions[currentStep] || { type: '', text: '', options: [] };

    const handleNext = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsFinished(true);
            
            // Save test results to Firebase
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                
                if (user) {
                    // Calculate career profile from answers
                    const careerProfile = calculateCareerProfile(answers);
                    
                    // Save to Firestore
                    const userRef = doc(db, 'users', user.uid);
                    await updateDoc(userRef, {
                        testResults: arrayUnion({
                            date: new Date().toISOString(),
                            answers: answers,
                            xp: xp,
                            careerProfile: careerProfile
                        })
                    });
                    
                    console.log('Test results saved to Firebase!');
                }
            } catch (error) {
                console.error('Error saving test results:', error);
            }
            
            setTimeout(() => {
                navigate('/results', { state: { answers, xp } });
            }, 1000);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (currentQuestion.timeLimit) {
            setTimeLeft(currentQuestion.timeLimit);
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        // Using functional update for currentStep or stable handleNext
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setTimeLeft(0);
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentStep, currentQuestion.timeLimit]);

    // Handle timer expiration
    useEffect(() => {
        if (timeLeft === 0 && currentQuestion.timeLimit) {
            handleNext();
        }
    }, [timeLeft]);

    const handleSelect = (option) => {
        const newAnswers = { ...answers, [currentStep]: option };
        setAnswers(newAnswers);

        // Calculate dynamic XP only if not already answered
        if (!answeredIndices.current.has(currentStep)) {
            let bonus = (currentQuestion.timeLimit && timeLeft > 0) ? (timeLeft / currentQuestion.timeLimit) * 10 : 0;
            setXp(prev => prev + 10 + Math.round(bonus));
            answeredIndices.current.add(currentStep);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const progress = ((currentStep + 1) / questions.length) * 100;
    const currentLevel = [...levels].reverse().find(l => xp >= l.minXp) || levels[0];

    return (
        <div className="test-page">
            <div className="gamified-header-overlay">
                <div className="xp-container">
                    <Award className="xp-icon" />
                    <span>{xp} XP</span>
                </div>
                <div className="level-badge">
                    {currentLevel.icon}
                    <span>{currentLevel.name}</span>
                </div>
                {timeLeft > 0 && (
                    <div className={`timer-ring ${timeLeft < 10 ? 'urgent' : ''}`}>
                        <Timer size={24} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                )}
            </div>

            <div className="test-container">
                <div className="test-header">
                    <div className="brain-logo-wrapper">
                        <Brain className="test-icon" />
                    </div>
                    <h1>FuturePath Assessment</h1>
                    <div className="progress-bar-container">
                        <div className="progress-bar-bg">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="progress-text">{Math.round(progress)}% Complete</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        className="question-card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="question-type-label">{currentQuestion.type.toUpperCase()} CHALLENGE</div>
                        <h3>{currentQuestion.text}</h3>

                        {currentQuestion.type === 'image' && (
                            <div className="question-image-container">
                                <img src={currentQuestion.image || "/pattern4.png"} alt="Challenge Visual" />
                            </div>
                        )}

                        <div className="options-grid">
                            {currentQuestion.options.map(option => (
                                <button
                                    key={option.id}
                                    className={`option-btn-v2 ${answers[currentStep]?.id === option.id ? 'active' : ''}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    <div className="option-id">{option.id.toUpperCase()}</div>
                                    <span className="option-text">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="test-nav">
                    <button className="back-btn" onClick={handlePrev} disabled={currentStep === 0}>
                        <ArrowLeft size={18} /> Previous
                    </button>
                    <button
                        className="next-btn-main"
                        onClick={handleNext}
                        disabled={!answers[currentStep]}
                    >
                        {currentStep === questions.length - 1 ? 'Analyze My DNA' : 'Lock & Continue'}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Test;

// Helper function to calculate career profile from answers
function calculateCareerProfile(answers) {
    // Aggregate scores from all answers
    const scores = {};
    
    Object.values(answers).forEach(answer => {
        if (answer && answer.score) {
            Object.entries(answer.score).forEach(([trait, value]) => {
                scores[trait] = (scores[trait] || 0) + value;
            });
        }
    });
    
    // Determine top traits
    const sortedTraits = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([trait]) => trait);
    
    // Simple archetype matching based on top traits
    let archetype = 'Innovator'; // Default
    
    if (sortedTraits.includes('logic') && sortedTraits.includes('tech')) {
        archetype = 'Technologist';
    } else if (sortedTraits.includes('creative') && sortedTraits.includes('aesthetics')) {
        archetype = 'Artist';
    } else if (sortedTraits.includes('social') && sortedTraits.includes('lead')) {
        archetype = 'Leader';
    } else if (sortedTraits.includes('psychology') && sortedTraits.includes('intuition')) {
        archetype = 'Counselor';
    }
    
    return {
        archetype,
        topTraits: sortedTraits,
        scores
    };
}

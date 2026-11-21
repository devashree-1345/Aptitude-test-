import { motion } from 'framer-motion';
import { Brain, BookOpen, BarChart3, Maximize, Users } from 'lucide-react';
import './AptitudeSections.css';

const sections = [
    {
        title: "Logical Reasoning",
        description: "Builds deductive and inductive thinking skills. Essential for analyzing complex patterns and making fast, systematic decisions.",
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
        icon: <Brain size={24} />,
        color: "#4f46e5"
    },
    {
        title: "Verbal Ability",
        description: "Measures proficiency in language, comprehension, and communication. Crucial for reporting, negotiation, and high-level leadership roles.",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
        icon: <BookOpen size={24} />,
        color: "#0891b2"
    },
    {
        title: "Quantitative Aptitude",
        description: "Evaluates analytical reasoning and quantitative decision-making. The foundation for success in engineering, finance, and data science.",
        image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800",
        icon: <BarChart3 size={24} />,
        color: "#10b981"
    },
    {
        title: "Spatial Ability",
        description: "Assesses visual-spatial manipulation and pattern recognition. Important for design, architecture, and innovative product creation.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
        icon: <Maximize size={24} />,
        color: "#7c3aed"
    },
    {
        title: "Situation Judgment",
        description: "Tests your ability to navigate workplace challenges and ethical dilemmas. Measures leadership readiness and professional emotional intelligence.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
        icon: <Users size={24} />,
        color: "#ea580c"
    }
];

const AptitudeSections = () => {
    return (
        <section className="aptitude-sections container">
            <div className="section-header">
                <h2 className="section-title">Aptitude Test Categories</h2>
                <p className="section-subtitle">
                    Our tests encompass a range of question types, commonly categorized into five areas.
                    Explore how each category helps you build a strong professional foundation.
                </p>
            </div>
            <div className="sections-grid">
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        className="section-card glass-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="card-image-container">
                            <img src={section.image} alt={section.title} className="card-image" />
                            <div className="card-icon-floating" style={{ backgroundColor: `${section.color}20`, color: section.color }}>
                                {section.icon}
                            </div>
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{section.title}</h3>
                            <p className="card-description">{section.description}</p>
                            <div className="card-benefit">
                                <span className="benefit-tag">Growth Benefit</span>
                                <p>Enhances analytical speed and logic.</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AptitudeSections;

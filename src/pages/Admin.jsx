import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Database, Briefcase, TrendingUp, Plus, Edit, Trash2,
    Save, X, ChevronRight, LayoutDashboard, Brain, Award,
    Activity, ArrowLeft, BarChart3, PieChart, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

// Default Data for Initialisation
const DEFAULT_QUESTIONS = [
    // 1. Logic/Math Puzzle
    {
        id: 1,
        type: 'puzzle',
        text: "Number Sequence: 2, 6, 12, 20, 30, ?",
        options: [
            { id: 'a', text: '40', score: { logic: 5, tech: 3 } },
            { id: 'b', text: '42', score: { logic: 10, tech: 5 } },
            { id: 'c', text: '44', score: { logic: 5 } },
            { id: 'd', text: '38', score: { logic: 2 } }
        ],
        timeLimit: 60
    },
    // 2. Personality/Work Archetype
    {
        id: 2,
        type: 'personality',
        text: "In a team meeting with a complex problem, you usually:",
        options: [
            { id: 'a', text: 'Analyze the data for hidden errors', score: { logic: 8, tech: 5 } },
            { id: 'b', text: 'Sketch a bold new vision for the project', score: { creative: 10, business: 3 } },
            { id: 'c', text: 'Coordinate roles to ensure group efficiency', score: { lead: 10, business: 5 } },
            { id: 'd', text: 'Focus on how the solution affects people', score: { social: 10, lead: 4 } }
        ],
        timeLimit: 60
    },
    // 3. Scenario/Management
    {
        id: 3,
        type: 'scenario',
        text: "Management Challenge: A project is 3 days behind. The team is demotivated. What's your move?",
        options: [
            { id: 'a', text: 'Schedule an extra-hour sprint to finish', score: { business: 5, lead: 2 } },
            { id: 'b', text: 'Streamline the scope and cut non-essentials', score: { lead: 10, business: 8 } },
            { id: 'c', text: 'Organize a morale-boosting team workshop', score: { social: 10, lead: 5 } },
            { id: 'd', text: 'Automate the bottleneck task yourself', score: { tech: 10, logic: 5 } }
        ],
        timeLimit: 60
    },
    // 4. Visual/Spatial
    {
        id: 4,
        type: 'image',
        text: "Spatial Design: Which abstract pattern feels most 'harmonious' for a new app?",
        image: '/pattern2.png',
        options: [
            { id: 'a', text: 'Symmetrical & Pure', score: { logic: 5, creative: 5 } },
            { id: 'b', text: 'Organic & Flowing', score: { creative: 10, social: 3 } },
            { id: 'c', text: 'Geometric & Bold', score: { tech: 8, creative: 4 } },
            { id: 'd', text: 'Minimal & Light', score: { creative: 8, logic: 2 } }
        ],
        timeLimit: 60
    },
    // 5. Interest/Passion
    {
        id: 5,
        type: 'interest',
        text: "If you had a weekend to learn anything, it would be:",
        options: [
            { id: 'a', text: 'Deep Learning & Neural Networks', score: { tech: 10, logic: 8 } },
            { id: 'b', text: 'Financial Modeling & Stock Markets', score: { business: 10, logic: 5 } },
            { id: 'c', text: 'Advanced UI Design & Color Psychology', score: { creative: 10, tech: 4 } },
            { id: 'd', text: 'Psychology & Public Speaking', score: { social: 10, lead: 6 } }
        ],
        timeLimit: 60
    },
    // 6. Verbal/Analogy
    {
        id: 6,
        type: 'puzzle',
        text: "Analogy: CODE is to DEVELOPER as BLUEPRINT is to:",
        options: [
            { id: 'a', text: 'Architect', score: { creative: 10, logic: 5, tech: 3 } },
            { id: 'b', text: 'Building', score: { logic: 2 } },
            { id: 'c', text: 'Hammer', score: { business: 1 } },
            { id: 'd', text: 'Design', score: { creative: 5 } }
        ],
        timeLimit: 60
    },
    // 7. Math/Pattern
    {
        id: 7,
        type: 'puzzle',
        text: "Mathematical Pattern: 1, 4, 9, 16, 25, ?",
        options: [
            { id: 'a', text: '35', score: { logic: 2 } },
            { id: 'b', text: '36', score: { logic: 10, tech: 5 } },
            { id: 'c', text: '49', score: { logic: 5 } },
            { id: 'd', text: '30', score: { logic: 1 } }
        ],
        timeLimit: 60
    },
    // 8. Work Style
    {
        id: 8,
        type: 'personality',
        text: "When starting a big project, your first priority is:",
        options: [
            { id: 'a', text: 'Setting up the infrastructure/tools', score: { tech: 10, logic: 4 } },
            { id: 'b', text: 'Defining the high-level strategy', score: { lead: 8, business: 8 } },
            { id: 'c', text: 'Creating the visual moodboard', score: { creative: 10, social: 2 } },
            { id: 'd', text: 'Talking to potential users for empathy', score: { social: 10, creative: 4 } }
        ],
        timeLimit: 60
    },
    // 9. Logic Deduction
    {
        id: 9,
        type: 'scenario',
        text: "Deduction: All A are B. No B are C. Therefore?",
        options: [
            { id: 'a', text: 'All A are C', score: { logic: 1 } },
            { id: 'b', text: 'Some A are C', score: { logic: 2 } },
            { id: 'c', text: 'No A are C', score: { logic: 10, tech: 4 } },
            { id: 'd', text: 'Cannot be determined', score: { logic: 4 } }
        ],
        timeLimit: 60
    },
    // 10. Social Ethics
    {
        id: 10,
        type: 'scenario',
        text: "Ethical Choice: Your AI model has a slight bias. Fixing it delays the launch by 1 month. You:",
        options: [
            { id: 'a', text: 'Launch now, fix later in updates', score: { business: 8, lead: 4 } },
            { id: 'b', text: 'Delay the launch to ensure fairness', score: { social: 10, lead: 5 } },
            { id: 'c', text: 'Inform users about the bias clearly', score: { lead: 8, social: 5 } },
            { id: 'd', text: 'Resign and find a better team', score: { social: 4 } }
        ],
        timeLimit: 60
    },
    // 11. Creative Fluidity
    {
        id: 11,
        type: 'puzzle',
        text: "Find the odd one out: Circle, Square, Sphere, Triangle",
        options: [
            { id: 'a', text: 'Square', score: { logic: 2 } },
            { id: 'b', text: 'Sphere', score: { creative: 8, logic: 10, tech: 4 } },
            { id: 'c', text: 'Circle', score: { logic: 2 } },
            { id: 'd', text: 'Triangle', score: { logic: 2 } }
        ],
        timeLimit: 60
    },
    // 12. Future Interest
    {
        id: 12,
        type: 'interest',
        text: "The tech trend that excites you most is:",
        options: [
            { id: 'a', text: 'Generative Art & Content', score: { creative: 10, tech: 5 } },
            { id: 'b', text: 'Autonomous Robots & Tesla Bot', score: { tech: 10, logic: 5 } },
            { id: 'c', text: 'Global Supply Chain Optimization', score: { business: 10, logic: 6 } },
            { id: 'd', text: 'Universal Basic Income & Social Policy', score: { social: 10, lead: 7 } }
        ],
        timeLimit: 60
    },
    // 13. Leadership Style
    {
        id: 13,
        type: 'personality',
        text: "Your ideal leadership role would be:",
        options: [
            { id: 'a', text: 'Chief Technology Officer (CTO)', score: { tech: 10, logic: 7 } },
            { id: 'b', text: 'Chief Executive Officer (CEO)', score: { lead: 10, business: 10 } },
            { id: 'c', text: 'Chief Creative Officer (CCO)', score: { creative: 10, artistic: 5 } },
            { id: 'd', text: 'Director of Social Impact', score: { social: 10, lead: 8 } }
        ],
        timeLimit: 60
    },
    // 14. Tactical Readiness (Defense)
    {
        id: 14,
        type: 'logic',
        text: "In a high-pressure situation, your first instinct is to:",
        options: [
            { id: 'a', text: 'Analyze all tactical risks and form a plan.', score: { tactical: 10, logic: 5 } },
            { id: 'b', text: 'Follow established protocols and maintain discipline.', score: { discipline: 10, lead: 5 } },
            { id: 'c', text: 'Protect others and ensure safety first.', score: { social: 10, tactical: 4 } },
            { id: 'd', text: 'Adapt quickly and improvise a solution.', score: { creative: 8, tactical: 6 } }
        ],
        timeLimit: 30
    },
    // 15. Nature & Environment (Farming)
    {
        id: 15,
        type: 'interest',
        text: "You find the most satisfaction in:",
        options: [
            { id: 'a', text: 'Watching something grow from a seed to harvest.', score: { nature: 10, patience: 5 } },
            { id: 'b', text: 'Using technology to optimize crop yields.', score: { tech: 8, nature: 8 } },
            { id: 'c', text: 'Designing beautiful sustainable landscapes.', score: { spatial: 7, nature: 7, creative: 6 } },
            { id: 'd', text: 'Protecting wild animals and forest ecosystems.', score: { nature: 10, social: 5 } }
        ],
        timeLimit: 60
    },
    // 16. Structural Design (Architecture)
    {
        id: 16,
        type: 'aptitude',
        text: "When you look at a building, you primarily notice its:",
        options: [
            { id: 'a', text: 'Structural integrity and engineering.', score: { structural: 10, tech: 5 } },
            { id: 'b', text: 'Aesthetic beauty and style.', score: { spatial: 8, creative: 8 } },
            { id: 'c', text: 'Functionality and space utilization.', score: { logic: 7, spatial: 10 } },
            { id: 'd', text: 'Impact on the environment.', score: { nature: 8, structural: 5 } }
        ],
        timeLimit: 45
    },
    // 17. Fashion & Style
    {
        id: 17,
        type: 'creative',
        text: "Your approach to fashion is best described as:",
        options: [
            { id: 'a', text: 'Trend-setting and experimental.', score: { trends: 10, creative: 8 } },
            { id: 'b', text: 'Classic, timeless, and high-quality.', score: { aesthetics: 10, business: 5 } },
            { id: 'c', text: 'Focusing on sustainable and ethical materials.', score: { nature: 8, textiles: 8 } },
            { id: 'd', text: 'Functional, technical, and high-performance.', score: { tech: 7, textiles: 10 } }
        ],
        timeLimit: 60
    },
    // 18. Mental Health & Psychology
    {
        id: 18,
        type: 'personality',
        text: "When a friend is going through a hard time, you usually:",
        options: [
            { id: 'a', text: 'Listen deeply and offer emotional support.', score: { empathy: 10, psychology: 8 } },
            { id: 'b', text: 'Help them analyze the problem logically.', score: { logic: 10, psychology: 5 } },
            { id: 'c', text: 'Provide practical solutions and guidance.', score: { lead: 8, social: 7 } },
            { id: 'd', text: 'Research professional treatments/paths for them.', score: { tech: 6, psychology: 10 } }
        ],
        timeLimit: 60
    },
    // 19. Discipline & Order (Defense)
    {
        id: 19,
        type: 'personality',
        text: "Your preferred way to work is:",
        options: [
            { id: 'a', text: 'Sticking to a strict schedule and routine.', score: { discipline: 10, logic: 5 } },
            { id: 'b', text: 'Having a general plan but staying flexible.', score: { lead: 7, creative: 5 } },
            { id: 'c', text: 'Collaborating in a loose, creative environment.', score: { social: 8, creative: 8 } },
            { id: 'd', text: 'Taking direct orders and executing them perfectly.', score: { discipline: 10, tactical: 7 } }
        ],
        timeLimit: 45
    },
    // 20. Agri-Tech (Farming)
    {
        id: 20,
        type: 'tech',
        text: "The use of drones in farming for soil analysis is:",
        options: [
            { id: 'a', text: 'A revolutionary tool for modern farmers.', score: { tech: 10, nature: 7 } },
            { id: 'b', text: 'Interesting but too expensive for most.', score: { business: 8, tech: 5 } },
            { id: 'c', text: 'Necessary for global food security.', score: { social: 9, nature: 6 } },
            { id: 'd', text: 'Something I would love to operate and manage.', score: { tech: 8, nature: 10 } }
        ],
        timeLimit: 60
    },
    // 21. Urban Sustainability (Architecture)
    {
        id: 21,
        type: 'interest',
        text: "The most important part of a 'Smart City' is:",
        options: [
            { id: 'a', text: 'Green spaces and sustainable water systems.', score: { nature: 10, spatial: 5 } },
            { id: 'b', text: 'High-speed automated public transport.', score: { structural: 8, tech: 8 } },
            { id: 'c', text: 'Efficient high-rise residential buildings.', score: { structural: 10, business: 5 } },
            { id: 'd', text: 'Advanced data tracking for city services.', score: { tech: 10, lead: 5 } }
        ],
        timeLimit: 60
    },
    // 22. Textile Innovation (Fashion)
    {
        id: 22,
        type: 'aptitude',
        text: "If you were to innovate in clothing, you would focus on:",
        options: [
            { id: 'a', text: 'Bio-fabricated leather from mushrooms.', score: { nature: 10, textiles: 10 } },
            { id: 'b', text: 'Smart fabrics with embedded sensors.', score: { tech: 10, textiles: 8 } },
            { id: 'c', text: 'Modular designs that can be reshaped.', score: { spatial: 10, creative: 7 } },
            { id: 'd', text: 'Recycling plastic waste into high-end items.', score: { nature: 8, business: 7 } }
        ],
        timeLimit: 60
    },
    // 23. Stress Resilience (Psychology)
    {
        id: 23,
        type: 'personality',
        text: "When you feel overwhelmed by many tasks, you:",
        options: [
            { id: 'a', text: 'Pause, breathe, and prioritize calmly.', score: { resilience: 10, psychology: 7 } },
            { id: 'b', text: 'Dive in and work harder until it\'s done.', score: { discipline: 8, lead: 5 } },
            { id: 'c', text: 'Talk it out with someone to decompress.', score: { social: 10, empathy: 5 } },
            { id: 'd', text: 'Break it into tiny, solvable logical steps.', score: { logic: 10, resilience: 6 } }
        ],
        timeLimit: 45
    },
    // 24. Medical Ethics (Healthcare)
    {
        id: 24,
        type: 'personality',
        text: "In a medical crisis, the most important factor is:",
        options: [
            { id: 'a', text: 'Quick, decisive life-saving action.', score: { medical: 10, tactical: 8 } },
            { id: 'b', text: 'Ensuring the patient feels safe and heard.', score: { empathy: 10, medical: 7 } },
            { id: 'c', text: 'Following strict ethical and legal protocols.', score: { ethics: 10, logic: 5 } },
            { id: 'd', text: 'Using the best technology for diagnosis.', score: { tech: 10, medical: 6 } }
        ],
        timeLimit: 30
    },
    // 25. System Architecture (IT Tech)
    {
        id: 25,
        type: 'aptitude',
        text: "When designing a software system, you focus most on:",
        options: [
            { id: 'a', text: 'Scalability and handling millions of users.', score: { tech: 10, structural: 7 } },
            { id: 'b', text: 'Security and protecting user data.', score: { logic: 8, tactical: 8 } },
            { id: 'c', text: 'Making the user interface beautiful.', score: { creative: 10, spatial: 5 } },
            { id: 'd', text: 'The business model and monetization.', score: { business: 10, lead: 5 } }
        ],
        timeLimit: 60
    },
    // 26. Conflict Resolution (Leadership)
    {
        id: 26,
        type: 'personality',
        text: "When two team members disagree, you:",
        options: [
            { id: 'a', text: 'Mediate to find a win-win compromise.', score: { lead: 10, social: 8 } },
            { id: 'b', text: 'Hear both sides and make a firm final decision.', score: { lead: 8, discipline: 7 } },
            { id: 'c', text: 'Let them work it out themselves.', score: { patience: 8, social: 5 } },
            { id: 'd', text: 'Use data/evidence to settle the argument.', score: { logic: 10, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 27. Market Risk (Commerce)
    {
        id: 27,
        type: 'logic',
        text: "A sharp dip in the stock market occurs. You think:",
        options: [
            { id: 'a', text: 'Time to analyze and buy the dip.', score: { business: 10, logic: 7 } },
            { id: 'b', text: 'Evaluate the macro-economic risk factors.', score: { logic: 10, tech: 5 } },
            { id: 'c', text: 'Stick to the long-term diversified plan.', score: { discipline: 10, patience: 8 } },
            { id: 'd', text: 'Wonder how this affects normal employees.', score: { social: 10, empathy: 5 } }
        ],
        timeLimit: 45
    },
    // 28. Navigation & Tactics (Navy/Defense)
    {
        id: 28,
        type: 'aptitude',
        text: "If lost with only a map and compass, you feel:",
        options: [
            { id: 'a', text: 'Confident in your ability to navigate.', score: { tactical: 10, spatial: 10 } },
            { id: 'b', text: 'Excited by the challenge of the unknown.', score: { creative: 7, lead: 6 } },
            { id: 'c', text: 'Determined to follow established survival steps.', score: { discipline: 10, tactical: 6 } },
            { id: 'd', text: 'Calmly coordinating the group to stay safe.', score: { lead: 10, social: 7 } }
        ],
        timeLimit: 30
    },
    // 29. Research Methods (Science)
    {
        id: 29,
        type: 'logic',
        text: "The best way to prove a theory is through:",
        options: [
            { id: 'a', text: 'Rigorous, repeatable experimentation.', score: { logic: 10, tech: 8 } },
            { id: 'b', text: 'Historical data and pattern analysis.', score: { logic: 8, business: 5 } },
            { id: 'c', text: 'Field observation in natural settings.', score: { nature: 10, patience: 7 } },
            { id: 'd', text: 'Theoretical mathematical proofs.', score: { logic: 10, spatial: 4 } }
        ],
        timeLimit: 60
    },
    // 30. Media Arts (Creative)
    {
        id: 30,
        type: 'creative',
        text: "Your dream creative project is:",
        options: [
            { id: 'a', text: 'Directing a multi-million dollar film.', score: { creative: 10, lead: 7 } },
            { id: 'b', text: 'An immersive digital VR experience.', score: { tech: 10, spatial: 8 } },
            { id: 'c', text: 'A social media campaign for a cause.', score: { social: 10, visual: 7 } },
            { id: 'd', text: 'Designing the architecture of a new museum.', score: { spatial: 10, structural: 10 } }
        ],
        timeLimit: 60
    },
    // 31. Maritime Strategy (Navy)
    {
        id: 31,
        type: 'logic',
        text: "In naval operations, maintaining 'Sea Control' is most important because:",
        options: [
            { id: 'a', text: 'It secures global trade routes.', score: { tactical: 10, business: 5 } },
            { id: 'b', text: 'It allows for project of power anywhere.', score: { tactical: 10, lead: 6 } },
            { id: 'c', text: 'It protects the coastal ecosystem.', score: { nature: 8, social: 5 } },
            { id: 'd', text: 'It minimizes fuel costs for the fleet.', score: { tech: 7, logic: 6 } }
        ],
        timeLimit: 45
    },
    // 32. Cloud Infrastructure (IT Tech)
    {
        id: 32,
        type: 'tech',
        text: "The main benefit of a serverless architecture is:",
        options: [
            { id: 'a', text: 'Auto-scaling based on real-time demand.', score: { tech: 10, logic: 7 } },
            { id: 'b', text: 'Lowering physical maintenance costs.', score: { business: 9, tech: 6 } },
            { id: 'c', text: 'Making the app look more modern to users.', score: { creative: 5, tech: 4 } },
            { id: 'd', text: 'Eliminating the need for any code at all.', score: { tech: 2, logic: 2 } }
        ],
        timeLimit: 60
    },
    // 33. Diagnostic Intuition (Healthcare)
    {
        id: 33,
        type: 'aptitude',
        text: "A patient shows conflicting symptoms. Your priority is:",
        options: [
            { id: 'a', text: 'Run extensive lab tests for hard data.', score: { medical: 10, tech: 8 } },
            { id: 'b', text: 'Compare with rare medical case studies.', score: { logic: 10, medical: 7 } },
            { id: 'c', text: 'Spend more time listening to the patient\'s history.', score: { empathy: 10, psychology: 8 } },
            { id: 'd', text: 'Consult with a multi-disciplinary team.', score: { social: 10, lead: 8 } }
        ],
        timeLimit: 45
    },
    // 34. Soil Health (Farming)
    {
        id: 34,
        type: 'interest',
        text: "To improve a farm's productivity long-term, you would:",
        options: [
            { id: 'a', text: 'Rotate crops to maintain soil minerals naturally.', score: { nature: 10, patience: 8 } },
            { id: 'b', text: 'Use chemical fertilizers for immediate high yield.', score: { business: 10, nature: 2 } },
            { id: 'c', text: 'Install an automated AI-driven irrigation system.', score: { tech: 10, nature: 8 } },
            { id: 'd', text: 'Focus on selling high-value niche organic produce.', score: { business: 10, social: 7 } }
        ],
        timeLimit: 60
    },
    // 35. BIM Modeling (Architecture)
    {
        id: 35,
        type: 'tech',
        text: "Building Information Modeling (BIM) is essential for:",
        options: [
            { id: 'a', text: 'Detecting structural clashes during design.', score: { structural: 10, tech: 8 } },
            { id: 'b', text: 'Creating pretty 3D pictures for clients.', score: { creative: 10, spatial: 7 } },
            { id: 'c', text: 'Reducing raw material waste on site.', score: { nature: 9, structural: 7 } },
            { id: 'd', text: 'Managing the building\'s lifecycle after construction.', score: { management: 10, structural: 6 } }
        ],
        timeLimit: 60
    },
    // 36. Fashion Merchandising
    {
        id: 36,
        type: 'business',
        text: "A new trend is fading fast. As a brand manager, you:",
        options: [
            { id: 'a', text: 'Discount stock immediately to clear space.', score: { business: 10, trends: 5 } },
            { id: 'b', text: 'Repurpose the materials for a new collection.', score: { nature: 8, creative: 10, textiles: 10 } },
            { id: 'c', text: 'Run an aggressive ad campaign to stay relevant.', score: { lead: 8, creative: 7 } },
            { id: 'd', text: 'Analyze why the trend failed to predict the next one.', score: { logic: 10, trends: 8 } }
        ],
        timeLimit: 45
    },
    // 37. Group Psychology
    {
        id: 37,
        type: 'personality',
        text: "In a team meeting, you usually:",
        options: [
            { id: 'a', text: 'Notice who is NOT speaking and invite their input.', score: { empathy: 10, lead: 8, psychology: 9 } },
            { id: 'b', text: 'Present a clear, data-backed agenda.', score: { logic: 10, tech: 5 } },
            { id: 'c', text: 'Keep everyone energized and motivated.', score: { social: 10, lead: 10 } },
            { id: 'd', text: 'Critically analyze ideas for potential flaws.', score: { logic: 10, tactical: 6 } }
        ],
        timeLimit: 60
    },
    // 38. Survival Discipline (Army)
    {
        id: 38,
        type: 'personality',
        text: "When facing a difficult physical challenge, you:",
        options: [
            { id: 'a', text: 'Focus on the objective and ignore the pain.', score: { discipline: 10, tactical: 8 } },
            { id: 'b', text: 'Find the most efficient way to finish.', score: { logic: 10, tech: 6 } },
            { id: 'c', text: 'Help your slowest teammate finish with you.', score: { social: 10, lead: 10 } },
            { id: 'd', text: 'Visualize the end result to keep going.', score: { creative: 8, psychology: 7 } }
        ],
        timeLimit: 30
    },
    // 39. Seed Technology (Farming)
    {
        id: 39,
        type: 'aptitude',
        text: "If you could create a new plant, you would make one that:",
        options: [
            { id: 'a', text: 'Grows in extreme salt-water conditions.', score: { nature: 10, biology: 10 } },
            { id: 'b', text: 'Produces double the vitamins per gram.', score: { medical: 8, nature: 10 } },
            { id: 'c', text: 'Absorbs 10x more CO2 from the air.', score: { nature: 10, social: 8 } },
            { id: 'd', text: 'Grows perfectly in indoor vertical farms.', score: { tech: 9, spatial: 8 } }
        ],
        timeLimit: 60
    },
    // 40. Interior Spatial Planning
    {
        id: 40,
        type: 'aptitude',
        text: "A small studio apartment needs multiple 'zones'. You:",
        options: [
            { id: 'a', text: 'Use multi-functional, folding furniture.', score: { spatial: 10, structural: 8 } },
            { id: 'b', text: 'Use light and color to define areas.', score: { creative: 10, spatial: 7 } },
            { id: 'c', text: 'Keep it minimal and open to maximize space.', score: { logic: 8, aesthetics: 9 } },
            { id: 'd', text: 'Add glass partitions for sound isolation.', score: { structural: 10, creative: 5 } }
        ],
        timeLimit: 45
    },
    // 41. Ethical AI (Psychology/Tech)
    {
        id: 41,
        type: 'logic',
        text: "An AI making hiring decisions shows bias. Your fix is:",
        options: [
            { id: 'a', text: 'Diversify the training dataset immediately.', score: { psychology: 10, tech: 10 } },
            { id: 'b', text: 'Shut it down and return to human review.', score: { ethics: 10, social: 7 } },
            { id: 'c', text: 'Build a second AI to audit the first one.', score: { tech: 10, logic: 8 } },
            { id: 'd', text: 'Adjust the algorithm weights manually.', score: { logic: 10, lead: 5 } }
        ],
        timeLimit: 60
    },
    // 42. Naval Engineering (Navy)
    {
        id: 42,
        type: 'tech',
        text: "Designing a hull for speed and stability requires:",
        options: [
            { id: 'a', text: 'Complex fluid dynamic simulations.', score: { tech: 10, structural: 10, tactical: 7 } },
            { id: 'b', text: 'Testing physical models in a water tank.', score: { patience: 10, tech: 8 } },
            { id: 'c', text: 'Using lightweight composite materials.', score: { textiles: 5, tech: 9, structural: 10 } },
            { id: 'd', text: 'Optimizing for fuel efficiency at cruising speed.', score: { business: 8, nature: 5 } }
        ],
        timeLimit: 60
    },
    // 43. Public Health Awareness
    {
        id: 43,
        type: 'social',
        text: "To stop a disease outbreak, you prioritize:",
        options: [
            { id: 'a', text: 'Mass vaccination and clinic rollouts.', score: { medical: 10, lead: 8 } },
            { id: 'b', text: 'Clear public communication and myth-busting.', score: { social: 10, psychology: 10 } },
            { id: 'c', text: 'Deep data tracking of patient contacts.', score: { tech: 10, logic: 8 } },
            { id: 'd', text: 'Stricter border and quarantine laws.', score: { discipline: 10, tactical: 7 } }
        ],
        timeLimit: 45
    },
    // 44. Hydroponics (Farming/Tech)
    {
        id: 44,
        type: 'tech',
        text: "The perfect nutrient solution for plants should be:",
        options: [
            { id: 'a', text: 'Manually balanced by an expert grower.', score: { nature: 10, patience: 10 } },
            { id: 'b', text: 'Automated using pH and EC sensors.', score: { tech: 10, logic: 8 } },
            { id: 'c', text: 'Derived entirely from organic waste.', score: { nature: 10, aesthetics: 5 } },
            { id: 'd', text: 'Cheaper than traditional soil-based methods.', score: { business: 10, logic: 6 } }
        ],
        timeLimit: 60
    },
    // 45. Sustainable Fashion
    {
        id: 45,
        type: 'interest',
        text: "You are most interested in 'Slow Fashion' because:",
        options: [
            { id: 'a', text: 'It prevents environmental degradation.', score: { nature: 10, ethics: 10 } },
            { id: 'b', text: 'It creates unique, high-value artisanal pieces.', score: { creative: 10, aesthetics: 10 } },
            { id: 'c', text: 'It supports fair wages for garment workers.', score: { social: 10, empathy: 8 } },
            { id: 'd', text: 'It encourages people to buy less, but better.', score: { business: 8, logic: 7 } }
        ],
        timeLimit: 60
    },
    // 46. Behavioral Economics (Business/Psych)
    {
        id: 46,
        type: 'logic',
        text: "People choose a free gift over a better value paid one because:",
        options: [
            { id: 'a', text: "The irrational 'zero price' effect.", score: { psychology: 10, business: 8 } },
            { id: 'b', text: "They don't understand the math of value.", score: { logic: 10, tech: 5 } },
            { id: 'c', text: 'The instant gratification of receiving.', score: { creative: 7, social: 5 } },
            { id: 'd', text: 'Fear of losing time on the decision.', score: { tactical: 7, psychology: 8 } }
        ],
        timeLimit: 45
    },
    // 47. Military Strategic Planning (Army)
    {
        id: 47,
        type: 'logic',
        text: "A logistical bottleneck is delaying supplies. You:",
        options: [
            { id: 'a', text: 'Divert resources to create a secondary route.', score: { tactical: 10, structural: 8 } },
            { id: 'b', text: 'Strictly enforce new efficiency quotas.', score: { discipline: 10, lead: 7 } },
            { id: 'c', text: 'Use data analytics to find the root cause.', score: { tech: 10, logic: 10 } },
            { id: 'd', text: 'Lead from the front to clear the blockage.', score: { lead: 10, courage: 10 } }
        ],
        timeLimit: 30
    },
    // 48. Adaptive Reuse (Architecture)
    {
        id: 48,
        type: 'creative',
        text: "Turning an old factory into an art gallery requires:",
        options: [
            { id: 'a', text: 'Preserving the raw, industrial character.', score: { creative: 10, aesthetics: 10 } },
            { id: 'b', text: 'Total structural reinforcement for safety.', score: { structural: 10, tech: 7 } },
            { id: 'c', text: 'Maximizing the light for artwork display.', score: { spatial: 10, visual: 9 } },
            { id: 'd', text: 'Sustainability features like solar/ventilation.', score: { nature: 10, structural: 6 } }
        ],
        timeLimit: 60
    },
    // 49. Cybersecurity Defense
    {
        id: 49,
        type: 'tech',
        text: "A 'Zero Trust' security model means:",
        options: [
            { id: 'a', text: 'No user is trusted by default, even inside.', score: { logic: 10, tactical: 10 } },
            { id: 'b', text: 'Enciphering every single bit of data.', score: { tech: 10, logic: 7 } },
            { id: 'c', text: 'Having no reliance on third-party software.', score: { business: 8, lead: 5 } },
            { id: 'd', text: 'Building a giant firewall around the company.', score: { structural: 7, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 50. Empathy in Leadership
    {
        id: 50,
        type: 'personality',
        text: "Meeting a high-performing employee who is burnt out:",
        options: [
            { id: 'a', text: 'Incentivize them with a bonus or raise.', score: { business: 10, logic: 5 } },
            { id: 'b', text: 'Mandate a week off for mental recovery.', score: { psychology: 10, empathy: 10, lead: 8 } },
            { id: 'c', text: 'Redesign their role to reduce stress.', score: { lead: 10, spatial: 5 } },
            { id: 'd', text: 'Ask them to push through just one more week.', score: { discipline: 10, tactical: 5 } }
        ],
        timeLimit: 60
    },
    // 51. Pediatric Care (Healthcare)
    {
        id: 51,
        type: 'aptitude',
        text: "When working with children in a medical setting, the key is:",
        options: [
            { id: 'a', text: 'Patience and making them feel safe.', score: { empathy: 10, patience: 10, medical: 7 } },
            { id: 'b', text: 'Fast diagnosis to minimize their stress.', score: { logic: 8, medical: 10 } },
            { id: 'c', text: 'Using distraction techniques like toys/games.', score: { creative: 9, social: 8 } },
            { id: 'd', text: 'Strictly following the treatment protocol.', score: { discipline: 10, medical: 6 } }
        ],
        timeLimit: 60
    },
    // 52. Database Sharding (IT Tech)
    {
        id: 52,
        type: 'tech',
        text: "Scaling a database using sharding helps by:",
        options: [
            { id: 'a', text: 'Splitting data across multiple physical servers.', score: { tech: 10, structural: 10 } },
            { id: 'b', text: 'Creating redundant backups of every record.', score: { logic: 7, tech: 6 } },
            { id: 'c', text: 'Simplifying the code for front-end developers.', score: { tech: 2, creative: 4 } },
            { id: 'd', text: 'Automatically fixing corrupted data files.', score: { tech: 5, logic: 5 } }
        ],
        timeLimit: 60
    },
    // 53. Permaculture Design (Farming)
    {
        id: 53,
        type: 'creative',
        text: "The main principle of permaculture is:",
        options: [
            { id: 'a', text: 'Designing systems that mimic natural patterns.', score: { nature: 10, spatial: 10, creative: 10 } },
            { id: 'b', text: 'Using the maximum amount of land for one crop.', score: { business: 8, nature: 2 } },
            { id: 'c', text: 'Relying entirely on advanced chemical sprays.', score: { tech: 5, nature: 1 } },
            { id: 'd', text: 'Exporting produce to global markets only.', score: { business: 10, logic: 5 } }
        ],
        timeLimit: 60
    },
    // 54. Logistics and Supply Chain (Army)
    {
        id: 54,
        type: 'logic',
        text: "A breakdown in the fuel supply line occurs. You:",
        options: [
            { id: 'a', text: 'Prioritize essential units and ration strictly.', score: { tactical: 10, lead: 8, logic: 7 } },
            { id: 'b', text: 'Search for local emergency alternatives.', score: { creative: 9, tactical: 8 } },
            { id: 'c', text: 'Commandeer civilian resources if necessary.', score: { discipline: 10, tactical: 6 } },
            { id: 'd', text: 'Wait for a central command decision.', score: { discipline: 8, social: 4 } }
        ],
        timeLimit: 30
    },
    // 55. Financial Audit (Commerce)
    {
        id: 55,
        type: 'aptitude',
        text: "Uncovering a mismatch in corporate accounts requires:",
        options: [
            { id: 'a', text: 'Deep attention to detail and ledger tracking.', score: { business: 10, logic: 10, patience: 8 } },
            { id: 'b', text: 'Using AI to flag suspicious transactions.', score: { tech: 10, business: 7 } },
            { id: 'c', text: 'Interviewing employees for behavioral clues.', score: { psychology: 9, social: 8 } },
            { id: 'd', text: 'Relying on the company\'s reputation.', score: { business: 2, trust: 10 } }
        ],
        timeLimit: 60
    },
    // 56. Fashion Illustration
    {
        id: 56,
        type: 'creative',
        text: "To convey a mood in a fashion sketch, you use:",
        options: [
            { id: 'a', text: 'Dynamic lines and expressive colors.', score: { creative: 10, visuals: 10, aesthetics: 9 } },
            { id: 'b', text: 'Precise technical measurements for sewing.', score: { structural: 8, textiles: 10 } },
            { id: 'c', text: 'Hyper-realistic digital rendering.', score: { tech: 10, visuals: 8 } },
            { id: 'd', text: 'Sticking to standard industry templates.', score: { business: 8, logic: 5 } }
        ],
        timeLimit: 60
    },
    // 57. Structural Integrity (Architecture)
    {
        id: 57,
        type: 'aptitude',
        text: "In an earthquake-prone zone, the best design is:",
        options: [
            { id: 'a', text: 'Flexible frames with base isolation tech.', score: { structural: 10, tech: 10, logic: 8 } },
            { id: 'b', text: 'Using thick, rigid concrete walls.', score: { structural: 6, logic: 4 } },
            { id: 'c', text: 'Building shorter, lighter structures.', score: { structural: 8, spatial: 7 } },
            { id: 'd', text: 'Focusing on deep, solid rock foundations.', score: { structural: 9, nature: 5 } }
        ],
        timeLimit: 60
    },
    // 58. Crisis Counseling (Psychology)
    {
        id: 58,
        type: 'personality',
        text: "In the first 10 minutes of a crisis call, you:",
        options: [
            { id: 'a', text: 'De-escalate the situation and build trust.', score: { empathy: 10, psychology: 10, resilience: 9 } },
            { id: 'b', text: 'Immediately ask for legal identification.', score: { discipline: 8, logic: 5 } },
            { id: 'c', text: 'Tell them exactly what to do next.', score: { lead: 10, tactical: 6 } },
            { id: 'd', text: 'Analyze their speech for medical symptoms.', score: { medical: 8, psychology: 7 } }
        ],
        timeLimit: 45
    },
    // 59. Ship Hull Maintenance (Navy)
    {
        id: 59,
        type: 'tech',
        text: "Barnacle growth on a ship's hull is best managed by:",
        options: [
            { id: 'a', text: 'Self-cleaning biomimetic coatings.', score: { tech: 10, nature: 10, structural: 8 } },
            { id: 'b', text: 'Regular manual cleaning by divers.', score: { discipline: 10, tactical: 6 } },
            { id: 'c', text: 'Increasing ship speed to shake them off.', score: { logic: 4, tech: 2 } },
            { id: 'd', text: 'Using strong chemical toxins in the paint.', score: { business: 10, nature: 1 } }
        ],
        timeLimit: 60
    },
    // 60. Full-Stack Performance (IT Tech)
    {
        id: 60,
        type: 'tech',
        text: "A webpage is loading slowly. You first check:",
        options: [
            { id: 'a', text: 'The size of media assets and images.', score: { tech: 10, creative: 5 } },
            { id: 'b', text: 'Database query execution times.', score: { tech: 10, logic: 10 } },
            { id: 'c', text: 'The user\'s browser version.', score: { tech: 7, social: 5 } },
            { id: 'd', text: 'The marketing copy on the landing page.', score: { business: 8, logic: 2 } }
        ],
        timeLimit: 60
    },
    // 61. Irrigation Efficiency (Farming)
    {
        id: 61,
        type: 'logic',
        text: "Drip irrigation is superior to flood irrigation because:",
        options: [
            { id: 'a', text: 'It delivers water directly to the roots.', score: { nature: 10, tech: 8, logic: 7 } },
            { id: 'b', text: 'It prevents weed growth between rows.', score: { nature: 8, biology: 6 } },
            { id: 'c', text: 'It is much cheaper to install initially.', score: { business: 10, logic: 3 } },
            { id: 'd', text: 'It makes the farm look more organized.', score: { aesthetics: 8, spatial: 5 } }
        ],
        timeLimit: 60
    },
    // 62. Field Medicine (Army/Navy)
    {
        id: 62,
        type: 'aptitude',
        text: "In a combat zone, the priority for a medic is:",
        options: [
            { id: 'a', text: 'Stop catastrophic bleeding (Tourniquet).', score: { medical: 10, tactical: 10, discipline: 9 } },
            { id: 'b', text: 'Perform a detailed physical exam.', score: { medical: 6, logic: 4 } },
            { id: 'c', text: 'Set up a clean, sterile field for surgery.', score: { medical: 8, spatial: 5 } },
            { id: 'd', text: 'Comfort the patient and offer hope.', score: { empathy: 10, psychology: 7 } }
        ],
        timeLimit: 20
    },
    // 63. Forensic Accounting (Commerce)
    {
        id: 63,
        type: 'logic',
        text: "Benford's Law is used in auditing to detect:",
        options: [
            { id: 'a', text: 'Anomalies in the distribution of leading digits.', score: { logic: 10, tech: 8, business: 9 } },
            { id: 'b', text: 'The total value of a company\'s assets.', score: { business: 8, logic: 5 } },
            { id: 'c', text: 'The probability of a market crash.', score: { business: 10, logic: 6 } },
            { id: 'd', text: 'Potential employee theft in retail.', score: { psychology: 7, social: 5 } }
        ],
        timeLimit: 60
    },
    // 64. Fast Fashion Impact
    {
        id: 64,
        type: 'interest',
        text: "Developing a 'Circular Fashion' model means:",
        options: [
            { id: 'a', text: 'Garments are designed to be fully recycled.', score: { nature: 10, creative: 10, textiles: 10 } },
            { id: 'b', text: 'Producing clothes in a circular factory layout.', score: { spatial: 8, structural: 5 } },
            { id: 'c', text: 'Sharing clothes between friends to save money.', score: { social: 10, business: 5 } },
            { id: 'd', text: 'Selling the same designs every 10 years.', score: { business: 8, trends: 4 } }
        ],
        timeLimit: 60
    },
    // 65. Lighting Design (Architecture)
    {
        id: 65,
        type: 'creative',
        text: "In a museum, lighting should focus on:",
        options: [
            { id: 'a', text: 'Preserving the art from UV degradation.', score: { nature: 9, structural: 7, visuals: 10 } },
            { id: 'b', text: 'Creating high-contrast dramatic shadows.', score: { creative: 10, aesthetics: 10 } },
            { id: 'c', text: "Guiding the visitor's path through the space.", score: { spatial: 10, psychology: 8 } },
            { id: 'd', text: 'Lowering the electricity bill significantly.', score: { business: 10, tech: 6 } }
        ],
        timeLimit: 60
    },
    // 66. Behavioral Therapy (Psychology)
    {
        id: 66,
        type: 'aptitude',
        text: "Cognitive Behavioral Therapy (CBT) focuses on:",
        options: [
            { id: 'a', text: 'Changing negative thought patterns to behavior.', score: { psychology: 10, resilience: 10, logic: 8 } },
            { id: 'b', text: 'Exploring deep childhood memories.', score: { psychology: 8, empathy: 7 } },
            { id: 'c', text: 'Prescribing the right chemical treatment.', score: { medical: 10, tech: 5 } },
            { id: 'd', text: 'Analyzing group dynamics in families.', score: { social: 10, psychology: 7 } }
        ],
        timeLimit: 60
    },
    // 67. Strategic Depth (Navy)
    {
        id: 67,
        type: 'logic',
        text: "A submarine's greatest tactical advantage is:",
        options: [
            { id: 'a', text: 'Stealth and the element of surprise.', score: { tactical: 10, patience: 10, discipline: 8 } },
            { id: 'b', text: 'High speed on the ocean surface.', score: { tech: 6, logic: 4 } },
            { id: 'c', text: 'Large scale carrying capacity for cargo.', score: { structural: 8, business: 5 } },
            { id: 'd', text: 'Visibility and psychological deterrence.', score: { lead: 10, social: 7 } }
        ],
        timeLimit: 45
    },
    // 68. API Security (IT Tech)
    {
        id: 68,
        type: 'tech',
        text: "The main risk of an exposed API key is:",
        options: [
            { id: 'a', text: 'Unauthorized access to private user data.', score: { tech: 10, logic: 10, tactical: 9 } },
            { id: 'b', text: 'A minor delay in app response time.', score: { tech: 5, business: 2 } },
            { id: 'c', text: 'The code looking messy to other developers.', score: { creative: 4, social: 3 } },
            { id: 'd', text: 'Users being able to change the app colors.', score: { aesthetics: 6, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 69. Livestock Welfare (Farming)
    {
        id: 69,
        type: 'interest',
        text: "Happy, healthy livestock lead to:",
        options: [
            { id: 'a', text: 'High-quality produce and fewer diseases.', score: { nature: 10, biology: 10, medical: 8 } },
            { id: 'b', text: 'Higher maintenance costs and lower profit.', score: { business: 10, patience: 2 } },
            { id: 'c', text: 'A better reputation for the brand.', score: { business: 8, social: 9 } },
            { id: 'd', text: 'Less work for the farm employees.', score: { management: 10, logic: 5 } }
        ],
        timeLimit: 60
    },
    // 70. Command & Control (Army)
    {
        id: 70,
        type: 'personality',
        text: "When a subordinate makes a minor mistake, you:",
        options: [
            { id: 'a', text: 'Correct them immediately and explain why.', score: { lead: 10, discipline: 10, empathy: 7 } },
            { id: 'b', text: 'Issue a formal warning for future records.', score: { discipline: 10, business: 5 } },
            { id: 'c', text: 'Ignore it to keep morale high.', score: { social: 8, lead: 4 } },
            { id: 'd', text: 'Make them redo the task until it\'s perfect.', score: { discipline: 10, spatial: 3 } }
        ],
        timeLimit: 30
    },
    // 71. Supply and Demand (Commerce)
    {
        id: 71,
        type: 'logic',
        text: "If supply decreases while demand stays high:",
        options: [
            { id: 'a', text: 'Prices will inevitably rise.', score: { business: 10, logic: 10 } },
            { id: 'b', text: 'The quality of the product will increase.', score: { logistics: 8, tech: 5 } },
            { id: 'c', text: 'Competition will stop immediately.', score: { business: 4, social: 2 } },
            { id: 'd', text: 'Innovation will slow down.', score: { creative: 6, lead: 4 } }
        ],
        timeLimit: 45
    },
    // 72. Textile Engineering
    {
        id: 72,
        type: 'tech',
        text: "The tensile strength of a fabric depends on:",
        options: [
            { id: 'a', text: 'The fiber type and the weaving pattern.', score: { textiles: 10, tech: 10, structural: 8 } },
            { id: 'b', text: 'The color and pattern of the dye.', score: { aesthetics: 10, visuals: 8 } },
            { id: 'c', text: 'The name of the designer on the label.', score: { business: 10, social: 5 } },
            { id: 'd', text: 'The humidity in the showroom.', score: { nature: 8, logic: 5 } }
        ],
        timeLimit: 60
    },
    // 73. Interior Ergonomics (Architecture)
    {
        id: 73,
        type: 'aptitude',
        text: "Designing an office for productivity requires:",
        options: [
            { id: 'a', text: 'Adjustable furniture and natural lighting.', score: { spatial: 10, medical: 8, nature: 8 } },
            { id: 'b', text: 'Maximizing the number of desks per room.', score: { business: 10, spatial: 6 } },
            { id: 'c', text: 'Using bright, high-energy neon colors.', score: { creative: 10, visuals: 7 } },
            { id: 'd', text: 'Strict soundproof pods for every worker.', score: { structural: 10, psychology: 7 } }
        ],
        timeLimit: 60
    },
    // 74. Child Development (Psychology)
    {
        id: 74,
        type: 'personality',
        text: "A toddler having a tantrum needs:",
        options: [
            { id: 'a', text: 'Calm, firm boundaries and emotional safety.', score: { empathy: 10, patience: 10, psychology: 10 } },
            { id: 'b', text: 'Immediate logical explanation of why they are wrong.', score: { logic: 10, lead: 5 } },
            { id: 'c', text: 'A small reward to stop the noise.', score: { business: 8, social: 4 } },
            { id: 'd', text: 'Strict physical isolation (time-out).', score: { discipline: 10, tactical: 6 } }
        ],
        timeLimit: 60
    },
    // 75. Search & Rescue (Navy/Army)
    {
        id: 75,
        type: 'tactical',
        text: "Searching for a person lost at sea requires:",
        options: [
            { id: 'a', text: 'Systematic grid patterns and heat sensors.', score: { tactical: 10, tech: 10, logic: 8 } },
            { id: 'b', text: 'Speeding in the last known direction.', score: { tactical: 6, courage: 8 } },
            { id: 'c', text: 'Asking local fishing boats for rumors.', score: { social: 10, lead: 7 } },
            { id: 'd', text: 'Waiting for high tide to bring them in.', score: { nature: 8, patience: 6 } }
        ],
        timeLimit: 30
    },
    // 76. Radiology Assessment (Healthcare)
    {
        id: 76,
        type: 'aptitude',
        text: "Identifying a fracture in a complex X-ray requires:",
        options: [
            { id: 'a', text: 'High-resolution visual pattern matching.', score: { medical: 10, visuals: 8, tech: 7 } },
            { id: 'b', text: 'Reading the patient\'s history first.', score: { psychology: 6, medical: 5 } },
            { id: 'c', text: 'Using AI to highlight potential cracks.', score: { tech: 10, medical: 7 } },
            { id: 'd', text: 'Comparing with a healthy reference image.', score: { logic: 10, spatial: 8 } }
        ],
        timeLimit: 45
    },
    // 77. Mobile App Lifecycle (IT Tech)
    {
        id: 77,
        type: 'tech',
        text: "The main purpose of a 'Minimum Viable Product' (MVP) is:",
        options: [
            { id: 'a', text: 'Gathering user feedback with minimal effort.', score: { business: 10, logic: 8, tech: 7 } },
            { id: 'b', text: 'Releasing a bug-free final product.', score: { tech: 2, logic: 5 } },
            { id: 'c', text: 'Impressing investors with high-end features.', score: { creative: 8, lead: 6 } },
            { id: 'd', text: "Testing the app's theoretical security limit.", score: { tactical: 7, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 78. Vertical Farming (Farming)
    {
        id: 78,
        type: 'interest',
        text: "Growing crops in stacked layers indoors helps by:",
        options: [
            { id: 'a', text: 'Saving land space and controlling climate.', score: { spatial: 10, nature: 10, tech: 9 } },
            { id: 'b', text: 'Reducing the cost of sunlight.', score: { logic: 2, tech: 1 } },
            { id: 'c', text: 'Making the plants grow faster naturally.', score: { biology: 8, nature: 5 } },
            { id: 'd', text: 'Eliminating the need for any water.', score: { tech: 1, nature: 1 } }
        ],
        timeLimit: 60
    },
    // 79. Coastal Defense strategy (Navy)
    {
        id: 79,
        type: 'logic',
        text: "To protect a harbor from intrusion, you prioritize:",
        options: [
            { id: 'a', text: 'Underwater acoustic sensor networks.', score: { tactical: 10, tech: 10, nature: 5 } },
            { id: 'b', text: 'Visible patrolling by armed frigates.', score: { discipline: 10, lead: 8 } },
            { id: 'c', text: 'Deep intelligence gathering in foreign ports.', score: { psychology: 9, tactical: 8 } },
            { id: 'd', text: 'Building a giant concrete breakwater.', score: { structural: 10, spatial: 6 } }
        ],
        timeLimit: 45
    },
    // 80. Market Volatility (Commerce)
    {
        id: 80,
        type: 'logic',
        text: "In a 'Bear Market', a wise investor usually:",
        options: [
            { id: 'a', text: 'Holds cash and looks for undervalued assets.', score: { business: 10, logic: 10, patience: 9 } },
            { id: 'b', text: 'Sells everything to prevent further loss.', score: { psychology: 4, business: 2 } },
            { id: 'c', text: 'Takes high-risk bets to recover quickly.', score: { courage: 8, business: 5 } },
            { id: 'd', text: 'Ignores the market entirely for months.', score: { patience: 10, discipline: 7 } }
        ],
        timeLimit: 60
    },
    // 81. Visual Merchandising (Fashion)
    {
        id: 81,
        type: 'creative',
        text: "A storefront window display should focus on:",
        options: [
            { id: 'a', text: 'Telling a compelling visual story.', score: { creative: 10, aesthetics: 10, visuals: 10 } },
            { id: 'b', text: 'Displaying as many products as possible.', score: { spatial: 5, business: 4 } },
            { id: 'c', text: 'Using the brightest possible flashing lights.', score: { tech: 6, visuals: 4 } },
            { id: 'd', text: 'Promoting the seasonal discount percentage.', score: { business: 10, logic: 7 } }
        ],
        timeLimit: 60
    },
    // 82. Modern Materials (Architecture)
    {
        id: 82,
        type: 'tech',
        text: "Self-healing concrete works by using:",
        options: [
            { id: 'a', text: 'Bacteria that produce limestone when wet.', score: { tech: 10, nature: 10, structural: 9 } },
            { id: 'b', text: 'Tiny mechanical robots inside the walls.', score: { tech: 8, creative: 5 } },
            { id: 'c', text: 'A special type of super-glue in the mix.', score: { textiles: 4, structural: 6 } },
            { id: 'd', text: 'Magnets that pull the cracks together.', score: { logic: 6, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 83. Developmental Psychology
    {
        id: 83,
        type: 'aptitude',
        text: "The 'Theory of Mind' in children refers to:",
        options: [
            { id: 'a', text: "Understanding that others have different beliefs.", score: { psychology: 10, empathy: 10, logic: 9 } },
            { id: 'b', text: 'Being able to solve complex math problems.', score: { logic: 8, tech: 5 } },
            { id: 'c', text: 'The ability to remember long sequences.', score: { patience: 8, logic: 7 } },
            { id: 'd', text: "Recognizing one's own reflection in a mirror.", score: { psychology: 8, biology: 6 } }
        ],
        timeLimit: 60
    },
    // 84. Fleet Management (Navy)
    {
        id: 84,
        type: 'personality',
        text: "To coordinate ten ships in a storm, you must:",
        options: [
            { id: 'a', text: 'Provide clear, concise, and reachable orders.', score: { lead: 10, discipline: 10, tactical: 9 } },
            { id: 'b', text: 'Let each captain decide their own best path.', score: { lead: 2, social: 5 } },
            { id: 'c', text: 'Prioritize the safety of the flagship only.', score: { tactical: 4, lead: 3 } },
            { id: 'd', text: 'Calculate the probability of survival for each.', score: { logic: 10, tech: 8 } }
        ],
        timeLimit: 45
    },
    // 85. Responsive Design (IT Tech)
    {
        id: 85,
        type: 'aptitude',
        text: "A website must work on both 4K monitors and old phones. You:",
        options: [
            { id: 'a', text: "Use a flexible 'Mobile First' grid system.", score: { tech: 10, spatial: 10, creative: 8 } },
            { id: 'b', text: 'Design two completely separate websites.', score: { business: 5, tech: 4 } },
            { id: 'c', text: 'Ask users on old phones to upgrade.', score: { social: 1, logic: 2 } },
            { id: 'd', text: 'Hide most features for mobile users.', score: { creative: 4, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 86. Organic Certification (Farming)
    {
        id: 86,
        type: 'interest',
        text: "Getting an 'Organic' label requires:",
        options: [
            { id: 'a', text: 'Three years of chemical-free soil transformation.', score: { nature: 10, patience: 10, ethics: 9 } },
            { id: 'b', text: 'Simply paying a certification fee.', score: { business: 10, ethics: 1 } },
            { id: 'c', text: 'Using only traditional wooden tools.', score: { aesthetics: 8, nature: 5 } },
            { id: 'd', text: 'Keeping all animals in indoor clean rooms.', score: { medical: 7, nature: 3 } }
        ],
        timeLimit: 60
    },
    // 87. Battlefield Awareness (Army)
    {
        id: 87,
        type: 'aptitude',
        text: "In a foggy environment, you rely most on:",
        options: [
            { id: 'a', text: 'Thermal imaging and audio cues.', score: { tactical: 10, tech: 10, discipline: 8 } },
            { id: 'b', text: 'Your memory of the local terrain.', score: { spatial: 10, logic: 7 } },
            { id: 'c', text: "Staying close to your teammate's voice.", score: { social: 10, lead: 8 } },
            { id: 'd', text: 'Charging forward to maintain momentum.', score: { courage: 10, tactical: 4 } }
        ],
        timeLimit: 30
    },
    // 88. Tax Compliance (Commerce)
    {
        id: 88,
        type: 'logic',
        text: "A 'Tax Loophole' is best described as:",
        options: [
            { id: 'a', text: 'Using legal rules in ways unintended by law.', score: { business: 10, logic: 10, ethics: 5 } },
            { id: 'b', text: 'Illegally hiding cash in offshore accounts.', score: { ethics: 1, business: 8 } },
            { id: 'c', text: 'A mistake made by the tax office.', score: { logic: 5, tech: 2 } },
            { id: 'd', text: 'A government-approved incentive for growth.', score: { lead: 8, business: 7 } }
        ],
        timeLimit: 60
    },
    // 89. Haute Couture (Fashion)
    {
        id: 89,
        type: 'creative',
        text: "Haute Couture is primarily about:",
        options: [
            { id: 'a', text: 'Exquisite hand-craftsmanship and unique fit.', score: { creative: 10, textiles: 10, aesthetics: 10 } },
            { id: 'b', text: 'Mass production at a lower cost.', score: { business: 10, logic: 6 } },
            { id: 'c', text: 'Using the most expensive fabric available.', score: { business: 8, aesthetics: 6 } },
            { id: 'd', text: 'Following the latest streetwear trends.', score: { trends: 8, creative: 5 } }
        ],
        timeLimit: 60
    },
    // 90. Parametric Architecture
    {
        id: 90,
        type: 'tech',
        text: "Using algorithms to generate building shapes allows for:",
        options: [
            { id: 'a', text: 'Optimization of light, wind, and structure.', score: { tech: 10, structural: 10, logic: 9 } },
            { id: 'b', text: 'Making buildings look like random blobs.', score: { creative: 8, aesthetics: 5 } },
            { id: 'c', text: 'Saving money on hiring actual architects.', score: { business: 5, tech: 3 } },
            { id: 'd', text: 'Using only one type of building material.', score: { logic: 4, structural: 5 } }
        ],
        timeLimit: 60
    },
    // 91. Neuroplasticity (Psychology)
    {
        id: 91,
        type: 'aptitude',
        text: "The brain's ability to reorganize itself means:",
        options: [
            { id: 'a', text: 'Recovery from injury and learning is always possible.', score: { psychology: 10, resilience: 10, biology: 9 } },
            { id: 'b', text: 'Adults can never learn new skills.', score: { logic: 2, psychology: 1 } },
            { id: 'c', text: 'Memories are stored in a physical hard drive.', score: { tech: 5, biology: 3 } },
            { id: 'd', text: 'The brain stops growing at age 18.', score: { biology: 4, medical: 2 } }
        ],
        timeLimit: 60
    },
    // 92. Supply Chain Resilience (Commerce)
    {
        id: 92,
        type: 'logic',
        text: "To avoid a total shutdown if one supplier fails, you:",
        options: [
            { id: 'a', text: "Maintain a 'Multi-Sourcing' strategy.", score: { business: 10, logic: 10, tactical: 8 } },
            { id: 'b', text: 'Only use the cheapest possible supplier.', score: { business: 5, logic: 4 } },
            { id: 'c', text: 'Build a giant warehouse to store everything.', score: { spatial: 8, business: 7 } },
            { id: 'd', text: "Personally oversee the supplier's factory.", score: { lead: 10, patience: 8 } }
        ],
        timeLimit: 60
    },
    // 93. Sustainable Urbanism (Architecture)
    {
        id: 93,
        type: 'interest',
        text: "The '15-Minute City' concept focuses on:",
        options: [
            { id: 'a', text: 'Accessing all needs within a 15-minute walk.', score: { spatial: 10, nature: 10, social: 9 } },
            { id: 'b', text: 'Making sure cars can cross the city in 15 minutes.', score: { structural: 8, tech: 5 } },
            { id: 'c', text: 'Having 15-minute high-speed internet everywhere.', score: { tech: 10, business: 6 } },
            { id: 'd', text: 'Working only 15 hours per week.', score: { social: 10, creative: 8 } }
        ],
        timeLimit: 60
    },
    // 94. Forensic Psychology
    {
        id: 94,
        type: 'aptitude',
        text: "A criminal profiler's main tool is:",
        options: [
            { id: 'a', text: 'Analyzing behavioral patterns and motivation.', score: { psychology: 10, logic: 10, tactical: 8 } },
            { id: 'b', text: 'Looking at high-resolution DNA evidence.', score: { biology: 10, tech: 8 } },
            { id: 'c', text: 'Using intuition and gut feeling only.', score: { creative: 8, social: 4 } },
            { id: 'd', text: 'Negotiating a lower bail for the suspect.', score: { lead: 8, business: 5 } }
        ],
        timeLimit: 45
    },
    // 95. Hydroelectric Power (Navy/Tech)
    {
        id: 95,
        type: 'tech',
        text: "Harnessing ocean tides for energy requires:",
        options: [
            { id: 'a', text: 'Turbines that can withstand high salinity.', score: { tech: 10, nature: 10, structural: 9 } },
            { id: 'b', text: 'Building a giant dam across the entire ocean.', score: { structural: 5, nature: 2 } },
            { id: 'c', text: 'Using the heat from the sun on the water.', score: { nature: 8, tech: 5 } },
            { id: 'd', text: 'Capturing the bubbles from crashing waves.', score: { creative: 7, biology: 4 } }
        ],
        timeLimit: 60
    },
    // 96. Docker Containers (IT Tech)
    {
        id: 96,
        type: 'tech',
        text: "Containerization (Docker) is used to:",
        options: [
            { id: 'a', text: 'Ensure code runs the same on any machine.', score: { tech: 10, logic: 9, discipline: 8 } },
            { id: 'b', text: 'Compress large files for faster email.', score: { tech: 4, business: 2 } },
            { id: 'c', text: 'Hide code from other developers.', score: { tactical: 5, logic: 3 } },
            { id: 'd', text: 'Automatically write the documentation.', score: { creative: 8, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 97. Precision Agriculture (Farming)
    {
        id: 97,
        type: 'tech',
        text: "GPS-guided tractors improve farming by:",
        options: [
            { id: 'a', text: 'Avoiding overlap in seed and fuel usage.', score: { tech: 10, business: 10, nature: 8 } },
            { id: 'b', text: 'Letting the farmer sleep while it works.', score: { patience: 10, lead: 4 } },
            { id: 'c', text: 'Making the rows look perfectly straight.', score: { aesthetics: 10, spatial: 8 } },
            { id: 'd', text: 'Preventing birds from eating the seeds.', score: { logic: 4, nature: 4 } }
        ],
        timeLimit: 60
    },
    // 98. Battlefield Command (Army)
    {
        id: 98,
        type: 'aptitude',
        text: "In a chaotic environment, a leader must:",
        options: [
            { id: 'a', text: 'Filter irrelevant info and give one priority.', score: { lead: 10, tactical: 10, logic: 9 } },
            { id: 'b', text: 'Gather all subordinates for a consensus.', score: { social: 10, lead: 6 } },
            { id: 'c', text: 'Follow the plan exactly as written pre-fog.', score: { discipline: 10, logic: 4 } },
            { id: 'd', text: 'Wait for the fog to clear before moving.', score: { patience: 10, tactical: 5 } }
        ],
        timeLimit: 30
    },
    // 99. Intellectual Property (Commerce)
    {
        id: 99,
        type: 'logic',
        text: "A 'Patent' protects an invention primarily by:",
        options: [
            { id: 'a', text: 'Granting a temporary legal monopoly.', score: { business: 10, logic: 10, ethics: 8 } },
            { id: 'b', text: 'Keeping the details a secret from everyone.', score: { tactical: 7, business: 4 } },
            { id: 'c', text: 'Proving that the inventor is a genius.', score: { creative: 8, lead: 5 } },
            { id: 'd', text: 'Giving it a cool, unique brand name.', score: { aesthetics: 9, business: 6 } }
        ],
        timeLimit: 60
    },
    // 100. Trend Forecasting (Fashion)
    {
        id: 100,
        type: 'creative',
        text: "Predicting the next big color requires:",
        options: [
            { id: 'a', text: 'Analyzing social changes and global art.', score: { trends: 10, psychology: 10, creative: 10 } },
            { id: 'b', text: 'Picking your favorite color and hoping.', score: { creative: 4, business: 2 } },
            { id: 'c', text: 'Asking current teenagers what they like.', score: { social: 10, trends: 8 } },
            { id: 'd', text: 'Looking at what stayed in stock last year.', score: { logic: 10, business: 8 } }
        ],
        timeLimit: 60
    },
    // 101. Marine Biology (Navy/Farming)
    {
        id: 101,
        type: 'interest',
        text: "The acidification of the ocean primarily threatens:",
        options: [
            { id: 'a', text: 'Coral reefs and calcium-based life.', score: { nature: 10, biology: 10, social: 7 } },
            { id: 'b', text: 'Large scale naval ship navigation.', score: { tactical: 5, tech: 4 } },
            { id: 'c', text: 'The salinity of coastal farming soil.', score: { nature: 8, biology: 7 } },
            { id: 'd', text: 'The speed of underwater sound waves.', score: { tech: 10, tactical: 6 } }
        ],
        timeLimit: 60
    },
    // 102. Cloud Cost Optimization (IT/Business)
    {
        id: 102,
        type: 'logic',
        text: "Using 'Spot Instances' in the cloud is best for:",
        options: [
            { id: 'a', text: 'Non-critical background batch processing.', score: { tech: 10, business: 10, logic: 8 } },
            { id: 'b', text: 'Hosting a database that must be 100% up.', score: { logic: 2, tech: 4 } },
            { id: 'c', text: 'Building a new user interface.', score: { creative: 5, tech: 3 } },
            { id: 'd', text: 'Testing the security of a firewall.', score: { tactical: 7, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 103. Patient Privilege (Legal/Medical)
    {
        id: 103,
        type: 'logic',
        text: "A doctor must break confidentiality only when:",
        options: [
            { id: 'a', text: 'The patient poses an immediate threat to others.', score: { ethics: 10, medical: 10, social: 8 } },
            { id: 'b', text: 'An insurance company asks for the records.', score: { business: 8, ethics: 2 } },
            { id: 'c', text: 'The patient\'s family wants to know.', score: { social: 7, ethics: 4 } },
            { id: 'd', text: 'The doctor wants to write a medical book.', score: { creative: 5, medical: 4 } }
        ],
        timeLimit: 60
    },
    // 104. Sustainable Crop Protection (Farming)
    {
        id: 104,
        type: 'interest',
        text: "Using ladybugs to control aphids is an example of:",
        options: [
            { id: 'a', text: 'Biological pest control in organic farming.', score: { nature: 10, biology: 10, ethics: 9 } },
            { id: 'b', text: 'A low-tech way to save on chemical costs.', score: { business: 8, logic: 7 } },
            { id: 'c', text: 'Creating a mini zoo for the farm visitors.', score: { social: 10, aesthetics: 6 } },
            { id: 'd', text: 'Using advanced robotics for harvesting.', score: { tech: 2, nature: 3 } }
        ],
        timeLimit: 60
    },
    // 105. Acoustic Engineering (Architecture/Navy)
    {
        id: 105,
        type: 'tech',
        text: "Controlling echo in a large hall requires:",
        options: [
            { id: 'a', text: 'Absorption, diffusion, and clever geometry.', score: { structural: 10, spatial: 10, tech: 8 } },
            { id: 'b', text: 'Painting all the walls a dark, flat color.', score: { aesthetics: 6, logic: 4 } },
            { id: 'c', text: 'Using microphones to cancel the sound.', score: { tech: 10, physics: 7 } },
            { id: 'd', text: 'Building the hall entirely out of solid glass.', score: { aesthetics: 10, structural: 4 } }
        ],
        timeLimit: 60
    },
    // 106. Supply Chain Logistics (Army/Navy)
    {
        id: 106,
        type: 'logic',
        text: "A 'Just-In-Time' supply strategy fails during:",
        options: [
            { id: 'a', text: 'Unforeseen global transport disruptions.', score: { business: 10, tactical: 10, logic: 8 } },
            { id: 'b', text: 'Periods of unusually low demand.', score: { logic: 4, business: 2 } },
            { id: 'c', text: 'When the warehouse is already full.', score: { spatial: 8, logic: 5 } },
            { id: 'd', text: 'A minor computer glitch in the office.', score: { tech: 10, logic: 6 } }
        ],
        timeLimit: 45
    },
    // 107. Trend Archeology (Fashion)
    {
        id: 107,
        type: 'creative',
        text: "Vintage fashion is making a comeback primarily because:",
        options: [
            { id: 'a', text: 'Nostalgia and a desire for sustainability.', score: { trends: 10, psychology: 10, ethics: 9 } },
            { id: 'b', text: 'New designers have run out of original ideas.', score: { creative: 2, social: 4 } },
            { id: 'c', text: 'Old clothes are much cheaper to buy now.', score: { business: 10, social: 7 } },
            { id: 'd', text: 'Modern fabrics are of much lower quality.', score: { textiles: 10, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 108. Structural Mechanics (Architecture)
    {
        id: 108,
        type: 'aptitude',
        text: "The 'Cantilever' in architecture allows for:",
        options: [
            { id: 'a', text: 'A beam supported on only one end.', score: { structural: 10, spatial: 10, physics: 9 } },
            { id: 'b', text: 'Making a building as tall as possible.', score: { structural: 7, spatial: 5 } },
            { id: 'c', text: 'Using less material in the foundation.', score: { business: 8, structural: 6 } },
            { id: 'd', text: 'Adding more windows to the base.', score: { aesthetics: 10, creative: 7 } }
        ],
        timeLimit: 30
    },
    // 109. Resilience Training (Psychology/Army)
    {
        id: 109,
        type: 'personality',
        text: "Developing 'Mental Toughness' requires:",
        options: [
            { id: 'a', text: 'Reframing failure as a learning opportunity.', score: { resilience: 10, psychology: 10, courage: 9 } },
            { id: 'b', text: 'Simply working longer hours without sleep.', score: { discipline: 10, medical: 2 } },
            { id: 'c', text: 'Ignoring all emotions to stay focused.', score: { tactical: 8, psychology: 4 } },
            { id: 'd', text: 'Relying on a strong leader to tell you what to do.', score: { social: 8, lead: 5 } }
        ],
        timeLimit: 60
    },
    // 110. Bio-fabrication (Fashion/Biology)
    {
        id: 110,
        type: 'tech',
        text: "Growing leather in a lab using animal cells:",
        options: [
            { id: 'a', text: 'Eliminates the need for livestock and slaughter.', score: { nature: 10, ethics: 10, textiles: 9 } },
            { id: 'b', text: 'Creates a fabric that is strictly for robots.', score: { tech: 10, creative: 4 } },
            { id: 'c', text: 'Is a much slower way to produce material.', score: { patience: 10, business: 2 } },
            { id: 'd', text: 'Prevents the fabric from getting wet.', score: { textiles: 8, biology: 5 } }
        ],
        timeLimit: 60
    },
    // 111. Urban Micro-climates (Architecture/Farming)
    {
        id: 111,
        type: 'interest',
        text: "Rooftop gardens in cities help primarily by:",
        options: [
            { id: 'a', text: "Reducing the 'Heat Island' effect.", score: { nature: 10, spatial: 10, structural: 8 } },
            { id: 'b', text: 'Providing free food for everyone in the building.', score: { social: 10, business: 5 } },
            { id: 'c', text: 'Making the elevators run faster.', score: { tech: 2, logic: 1 } },
            { id: 'd', text: 'Hiding the building from satellite view.', score: { tactical: 10, spatial: 5 } }
        ],
        timeLimit: 60
    },
    // 112. GraphQL Federation (IT Tech)
    {
        id: 112,
        type: 'tech',
        text: "A 'Federated' GraphQL architecture allows:",
        options: [
            { id: 'a', text: 'Combining multiple microservices into one API.', score: { tech: 10, structural: 10, logic: 8 } },
            { id: 'b', text: 'Having a single giant database for everything.', score: { logic: 2, tech: 4 } },
            { id: 'c', text: 'Reducing the cost of cloud storage.', score: { business: 8, tech: 5 } },
            { id: 'd', text: 'Encrypting the code for end users.', score: { tactical: 7, tech: 6 } }
        ],
        timeLimit: 60
    },
    // 113. Market Arbitrage (Commerce)
    {
        id: 113,
        type: 'logic',
        text: "Arbitrage is the practice of:",
        options: [
            { id: 'a', text: 'Buying low in one market and selling high in another.', score: { business: 10, logic: 10, tactical: 7 } },
            { id: 'b', text: 'Betting that a company\'s stock will fail.', score: { business: 10, psychology: 8 } },
            { id: 'c', text: 'Influencing a government to lower taxes.', score: { lead: 8, social: 7 } },
            { id: 'd', text: 'Creating a new product from scratch.', score: { creative: 10, business: 5 } }
        ],
        timeLimit: 45
    },
    // 114. Medical Triage (Healthcare/Defense)
    {
        id: 114,
        type: 'aptitude',
        text: "In a 'Mass Casualty' event, triage means:",
        options: [
            { id: 'a', text: 'Prioritizing patients who have the best chance of survival.', score: { medical: 10, tactical: 10, ethics: 9 } },
            { id: 'b', text: 'Treating the most visible injuries first.', score: { medical: 6, logic: 4 } },
            { id: 'c', text: 'Waiting for all ambulances to arrive before starting.', score: { discipline: 10, patience: 5 } },
            { id: 'd', text: 'Asking for payment before any treatment.', score: { business: 10, ethics: 1 } }
        ],
        timeLimit: 30
    },
    // 115. Cryptographic Protocols (IT/Defense)
    {
        id: 115,
        type: 'tech',
        text: "Asymmetric encryption (Public/Private Keys) solves:",
        options: [
            { id: 'a', text: 'Securely sharing secrets without a prior meeting.', score: { tech: 10, logic: 10, tactical: 9 } },
            { id: 'b', text: 'Making the data much smaller in size.', score: { tech: 5, business: 2 } },
            { id: 'c', text: 'Speeding up the internet connection.', score: { tech: 6, logic: 5 } },
            { id: 'd', text: 'Verifying the physically location of the server.', score: { spatial: 7, tech: 6 } }
        ],
        timeLimit: 60
    },
    // 116. Soil Microbiotics (Farming)
    {
        id: 116,
        type: 'interest',
        text: "Mycorrhizal fungi in the soil are essential for:",
        options: [
            { id: 'a', text: 'Helping roots absorb water and nutrients.', score: { nature: 10, biology: 10, patience: 8 } },
            { id: 'b', text: 'Killing all insects that crawl on the ground.', score: { medical: 8, nature: 2 } },
            { id: 'c', text: 'Providing light for plants at night.', score: { tech: 4, creative: 5 } },
            { id: 'd', text: 'Stabilizing the PH of the atmosphere.', score: { biology: 8, nature: 7 } }
        ],
        timeLimit: 60
    },
    // 117. Vernacular Design (Architecture)
    {
        id: 117,
        type: 'creative',
        text: "Vernacular architecture is based on:",
        options: [
            { id: 'a', text: 'Local materials and cultural traditions.', score: { creative: 10, nature: 9, aesthetics: 9 } },
            { id: 'b', text: 'Global standards and high-end imports.', score: { business: 8, spatial: 5 } },
            { id: 'c', text: 'A single famous architect\'s style.', score: { visuals: 10, creative: 7 } },
            { id: 'd', text: 'Building everything in a circular shape.', score: { spatial: 10, logic: 6 } }
        ],
        timeLimit: 60
    },
    // 118. Apparel Merchandising (Fashion/Business)
    {
        id: 118,
        type: 'business',
        text: "An 'Open-to-Buy' plan is used to:",
        options: [
            { id: 'a', text: 'Manage inventory and budget for NEW stock.', score: { business: 10, logic: 10, trends: 8 } },
            { id: 'b', text: 'Open a new store in a different country.', score: { lead: 10, spatial: 7 } },
            { id: 'c', text: 'Let customers try on clothes for free.', score: { social: 10, empathy: 7 } },
            { id: 'd', text: 'Calculate the total taxes for the month.', score: { business: 8, logic: 9 } }
        ],
        timeLimit: 60
    },
    // 119. Clinical Supervision (Psychology)
    {
        id: 119,
        type: 'personality',
        text: "Working as a therapist requires you to:",
        options: [
            { id: 'a', text: 'Regularly meet with a mentor to avoid burnout.', score: { psychology: 10, resilience: 10, social: 8 } },
            { id: 'b', text: 'Never experience any emotions yourself.', score: { tactical: 7, ethics: 5 } },
            { id: 'c', text: 'Become best friends with your patients.', score: { social: 10, empathy: 2 } },
            { id: 'd', text: 'Strictly follow their social media accounts.', score: { tech: 6, psychology: 1 } }
        ],
        timeLimit: 60
    },
    // 120. Defensive Cyber Ops (IT/Defense)
    {
        id: 120,
        type: 'tech',
        text: "A 'Honeypot' in cybersecurity is used to:",
        options: [
            { id: 'a', text: 'Lure and study attackers in a decoy system.', score: { tactical: 10, tech: 10, psychology: 9 } },
            { id: 'b', text: 'Store the most valuable company data.', score: { logic: 2, tactical: 4 } },
            { id: 'c', text: 'Slow down the internet for employees.', score: { discipline: 10, business: 5 } },
            { id: 'd', text: 'Collect user passwords automatically.', score: { tactical: 1, tech: 1 } }
        ],
        timeLimit: 60
    },
    // 121. Crop Breeding (Farming/Science)
    {
        id: 121,
        type: 'aptitude',
        text: "Developing a drought-resistant seed requires:",
        options: [
            { id: 'a', text: 'Identifying and isolating specific genetic traits.', score: { biology: 10, nature: 10, tech: 8 } },
            { id: 'b', text: 'Watering the plant less and less every day.', score: { patience: 10, logic: 4 } },
            { id: 'c', text: 'Using more sunlight than traditional crops.', score: { nature: 5, tech: 4 } },
            { id: 'd', text: 'Asking the farmer for their expert opinion.', score: { social: 10, logic: 7 } }
        ],
        timeLimit: 60
    },
    // 122. Maritime Law (Legal/Navy)
    {
        id: 122,
        type: 'logic',
        text: "In the 'Exclusive Economic Zone' (EEZ), a nation has:",
        options: [
            { id: 'a', text: 'Sole rights to exploit all natural resources.', score: { business: 10, legal: 10, tactical: 9 } },
            { id: 'b', text: 'Total control over all passing foreign ships.', score: { tactical: 8, discipline: 7 } },
            { id: 'c', text: 'The duty to clean up all plastic waste.', score: { nature: 10, social: 8 } },
            { id: 'd', text: 'Right to build artificial islands for tourists.', score: { structural: 10, business: 7 } }
        ],
        timeLimit: 60
    },
    // 123. Interior Biophilia (Architecture/Psychology)
    {
        id: 123,
        type: 'creative',
        text: "Using plants and natural light in hospitals leads to:",
        options: [
            { id: 'a', text: 'Faster patient recovery and lower stress.', score: { aesthetics: 10, empathy: 10, medical: 9 } },
            { id: 'b', text: 'Higher maintenance costs for the hospital.', score: { business: 10, structural: 5 } },
            { id: 'c', text: 'More insects in the patient rooms.', score: { biology: 10, nature: 5 } },
            { id: 'd', text: 'A desire for patients to stay longer.', score: { social: 8, psychology: 7 } }
        ],
        timeLimit: 60
    },
    // 124. Behavioral Nudging (Psychology/Business)
    {
        id: 124,
        type: 'logic',
        text: "A 'Nudge' influences behavior by:",
        options: [
            { id: 'a', text: 'Changing the initial choice architecture slightly.', score: { psychology: 10, logic: 10, business: 9 } },
            { id: 'b', text: 'Taking away all other possible options.', score: { lead: 10, discipline: 6 } },
            { id: 'c', text: 'Giving people a large cash reward.', score: { business: 10, social: 5 } },
            { id: 'd', text: 'Scaring people with potential consequences.', score: { tactical: 10, discipline: 8 } }
        ],
        timeLimit: 60
    },
    // 125. Strategic Reconnaissance (Army/Navy)
    {
        id: 125,
        type: 'aptitude',
        text: "The main goal of a 'Scout' is to:",
        options: [
            { id: 'a', text: 'Gather info on the enemy without being seen.', score: { tactical: 10, patience: 10, discipline: 9 } },
            { id: 'b', text: 'Attack the enemy head-on to test their strength.', score: { courage: 10, tactical: 6 } },
            { id: 'c', text: 'Protect the main force from rear attacks.', score: { discipline: 10, lead: 8 } },
            { id: 'd', text: 'Negotiate a peace treaty with local leaders.', score: { social: 10, lead: 9 } }
        ],
        timeLimit: 30
    },
    // 126. Telemedicine Infrastructure (Healthcare/IT)
    {
        id: 126,
        type: 'tech',
        text: "The main challenge of high-quality telemedicine is:",
        options: [
            { id: 'a', text: 'Low-latency video and data synchronization.', score: { tech: 10, medical: 10, logic: 8 } },
            { id: 'b', text: 'Convincing doctors to work from home.', score: { psychology: 6, business: 4 } },
            { id: 'c', text: 'The cost of the patient\'s internet bill.', score: { business: 7, social: 5 } },
            { id: 'd', text: 'Printing prescriptions on paper remotely.', score: { tech: 5, medical: 4 } }
        ],
        timeLimit: 60
    },
    // 127. Kubernetes Orchestration (IT Tech)
    {
        id: 127,
        type: 'tech',
        text: "A 'Kubernetes Cluster' helps manage software by:",
        options: [
            { id: 'a', text: 'Automating deployment, scaling, and operations.', score: { tech: 10, structural: 10, logic: 9 } },
            { id: 'b', text: 'Making the code run faster on one computer.', score: { logic: 2, tech: 3 } },
            { id: 'c', text: 'Designing the user interface automatically.', score: { creative: 5, tech: 2 } },
            { id: 'd', text: 'Backing up all emails for the company.', score: { business: 8, tech: 1 } }
        ],
        timeLimit: 60
    },
    // 128. Option Greeks (Commerce)
    {
        id: 128,
        type: 'logic',
        text: "In options trading, 'Delta' measures:",
        options: [
            { id: 'a', text: 'The rate of change of price relative to the asset.', score: { business: 10, logic: 10, tech: 8 } },
            { id: 'b', text: 'The time remaining until the option expires.', score: { patience: 10, business: 7 } },
            { id: 'c', text: 'The total number of shares in the world.', score: { business: 5, logic: 2 } },
            { id: 'd', text: 'The probability that the company goes bankrupt.', score: { tactical: 7, business: 6 } }
        ],
        timeLimit: 60
    },
    // 129. Venture Capital Deal Flow (Commerce/Business)
    {
        id: 129,
        type: 'logic',
        text: "VCs look for 'Unicorn' startups, which means:",
        options: [
            { id: 'a', text: 'Privately held companies valued over $1 billion.', score: { business: 10, logic: 10, lead: 9 } },
            { id: 'b', text: 'Companies that have no competition.', score: { tactical: 8, business: 6 } },
            { id: 'c', text: 'Startups that focus on magical branding.', score: { creative: 10, business: 4 } },
            { id: 'd', text: 'Firms that rely entirely on government grants.', score: { lead: 8, ethics: 5 } }
        ],
        timeLimit: 45
    },
    // 130. Seed Priming (Farming)
    {
        id: 130,
        type: 'tech',
        text: "Seed priming involves hydrating seeds to:",
        options: [
            { id: 'a', text: 'Trigger metabolic activity for faster germination.', score: { nature: 10, biology: 10, patience: 8 } },
            { id: 'b', text: 'Make them heavier so they don\'t blow away.', score: { logic: 4, nature: 2 } },
            { id: 'c', text: 'Clean off all potential chemical residues.', score: { ethics: 9, nature: 6 } },
            { id: 'd', text: 'Change their color for easier sorting.', score: { aesthetics: 8, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 131. Jungle Survival (Army)
    {
        id: 131,
        type: 'aptitude',
        text: "In a dense jungle, navigating without a compass requires:",
        options: [
            { id: 'a', text: 'Following water flows or sun/moon positions.', score: { tactical: 10, nature: 10, logic: 9 } },
            { id: 'b', text: 'Climbing the tallest tree every hour.', score: { courage: 10, tactical: 6 } },
            { id: 'c', text: 'Walking in a straight line regardless of terrain.', score: { discipline: 10, tactical: 4 } },
            { id: 'd', text: 'Building a fire to attract aircraft.', score: { tactical: 8, lead: 7 } }
        ],
        timeLimit: 30
    },
    // 132. Electronic Support Measures (Navy)
    {
        id: 132,
        type: 'tech',
        text: "Naval ESM (Electronic Support Measures) are used to:",
        options: [
            { id: 'a', text: 'Detect and identify electronic emissions (Radar).', score: { tech: 10, tactical: 10, logic: 9 } },
            { id: 'b', text: 'Jam the enemy\'s television signals.', score: { tech: 8, social: 4 } },
            { id: 'c', text: 'Communicate with submarines at deep depths.', score: { tech: 10, physical: 7 } },
            { id: 'd', text: 'Calculate the salinity of the ocean automatically.', score: { nature: 8, tech: 6 } }
        ],
        timeLimit: 45
    },
    // 133. Visual Branding (Fashion/Business)
    {
        id: 133,
        type: 'creative',
        text: "A brand's 'Visual DNA' refers to:",
        options: [
            { id: 'a', text: 'Consistent use of colors, patterns, and logos.', score: { creative: 10, aesthetics: 10, visuals: 9 } },
            { id: 'b', text: 'The actual genetic makeup of the designer.', score: { biology: 10, creative: 1 } },
            { id: 'c', text: 'The number of followers they have on social media.', score: { social: 10, business: 4 } },
            { id: 'd', text: 'The physical location of their flagship store.', score: { spatial: 10, business: 7 } }
        ],
        timeLimit: 60
    },
    // 134. BIM Level 2 (Architecture)
    {
        id: 134,
        type: 'tech',
        text: "Building Information Modeling (BIM) Level 2 focuses on:",
        options: [
            { id: 'a', text: 'Collaborative data sharing between all parties.', score: { tech: 10, structural: 10, social: 8 } },
            { id: 'b', text: 'Designing a building that is 2D only.', score: { logic: 2, tech: 1 } },
            { id: 'c', text: 'Using only two types of building materials.', score: { structural: 5, business: 4 } },
            { id: 'd', text: 'Building the world\'s smallest skyscrapers.', score: { creative: 10, aesthetics: 7 } }
        ],
        timeLimit: 60
    },
    // 135. Industrial Psychology (Psychology/Business)
    {
        id: 135,
        type: 'aptitude',
        text: "I/O Psychology aims primarily to:",
        options: [
            { id: 'a', text: 'Enhance workplace productivity and well-being.', score: { psychology: 10, business: 10, social: 9 } },
            { id: 'b', text: 'Trick employees into working for less money.', score: { ethics: 1, business: 8 } },
            { id: 'c', text: 'Predict the winner of an election.', score: { social: 10, logic: 7 } },
            { id: 'd', text: 'Design better machines in a factory.', score: { tech: 10, spatial: 8 } }
        ],
        timeLimit: 60
    },
    // 136. Trauma-Informed Care (Healthcare/Psychology)
    {
        id: 136,
        type: 'personality',
        text: "Trauma-informed care means assuming:",
        options: [
            { id: 'a', text: 'Every patient may have a history of trauma.', score: { empathy: 10, psychology: 10, medical: 9 } },
            { id: 'b', text: 'Patients are always lying about their pain.', score: { ethics: 2, logic: 1 } },
            { id: 'c', text: 'Trauma can be cured with a single pill.', score: { medical: 10, tech: 2 } },
            { id: 'd', text: 'Psychology is only for children.', score: { social: 4, psychology: 1 } }
        ],
        timeLimit: 60
    },
    // 137. Serverless Cold Starts (IT Tech)
    {
        id: 137,
        type: 'tech',
        text: "A 'Cold Start' in serverless computing causes:",
        options: [
            { id: 'a', text: 'Higher latency on the first request after idle.', score: { tech: 10, logic: 10, business: 7 } },
            { id: 'b', text: 'The computer to literally freeze in winter.', score: { nature: 2, tech: 1 } },
            { id: 'c', text: 'The code to be deleted automatically.', score: { tactical: 4, tech: 3 } },
            { id: 'd', text: 'A sudden burst of energy for the server.', score: { tech: 5, logic: 4 } }
        ],
        timeLimit: 60
    },
    // 138. Hydroponics pH Balance (Farming)
    {
        id: 138,
        type: 'aptitude',
        text: "If the pH in a hydroponic tank is too high:",
        options: [
            { id: 'a', text: 'Plants cannot absorb essential nutrients.', score: { nature: 10, biology: 10, tech: 9 } },
            { id: 'b', text: 'The water will turn into a solid block.', score: { physics: 8, logic: 2 } },
            { id: 'c', text: 'The plants will grow much larger leaves.', score: { nature: 6, biology: 5 } },
            { id: 'd', text: 'The electricity bill will increase.', score: { business: 8, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 139. Guerilla Warfare Tactics (Army)
    {
        id: 139,
        type: 'logic',
        text: "Asymmetric warfare focuses on:",
        options: [
            { id: 'a', text: 'Using mobile, small-unit tactics against larger forces.', score: { tactical: 10, patience: 10, logic: 9 } },
            { id: 'b', text: 'Building a giant fortress to stay inside.', score: { structural: 8, tactical: 4 } },
            { id: 'c', text: 'Relying on superior number of tanks.', score: { tech: 8, tactical: 2 } },
            { id: 'd', text: 'Announcing your location to the enemy.', score: { social: 4, courage: 2 } }
        ],
        timeLimit: 45
    },
    // 140. Apparel Quality Assurance (Fashion)
    {
        id: 140,
        type: 'aptitude',
        text: "To check the quality of a seam, a QA expert:",
        options: [
            { id: 'a', text: 'Performs a pull-test to check stitch strength.', score: { textiles: 10, structural: 10, discipline: 9 } },
            { id: 'b', text: 'Smells the fabric for any chemical odor.', score: { nature: 8, biology: 5 } },
            { id: 'c', text: 'Checks if the price tag is correctly attached.', score: { business: 10, logic: 4 } },
            { id: 'd', text: 'Asks the celebrity who endorsed the piece.', score: { social: 10, business: 2 } }
        ],
        timeLimit: 45
    },
    // 141. LEED Certification (Architecture)
    {
        id: 141,
        type: 'interest',
        text: "A LEED-certified building must have:",
        options: [
            { id: 'a', text: 'High energy efficiency and sustainable sourcing.', score: { nature: 10, structural: 10, ethics: 9 } },
            { id: 'b', text: 'A giant neon sign on the roof.', score: { aesthetics: 10, creative: 5 } },
            { id: 'c', text: 'At least 50 elevators for speed.', score: { tech: 8, business: 6 } },
            { id: 'd', text: 'A physical library for all residents.', score: { social: 10, aesthetics: 7 } }
        ],
        timeLimit: 60
    },
    // 142. Cognitive Distortions (Psychology)
    {
        id: 142,
        type: 'aptitude',
        text: "'Catastrophizing' means:",
        options: [
            { id: 'a', text: 'Assuming the worst possible outcome will happen.', score: { psychology: 10, resilience: 10, logic: 1 } },
            { id: 'b', text: 'Being an expert in handling real disasters.', score: { tactical: 10, courage: 8 } },
            { id: 'c', text: 'Designing a building that can withstand a bomb.', score: { structural: 10, tech: 7 } },
            { id: 'd', text: 'Forgetting where you parked your car.', score: { patience: 4, logic: 2 } }
        ],
        timeLimit: 30
    },
    // 143. Quantitative Easing (Commerce)
    {
        id: 143,
        type: 'logic',
        text: "QE (Quantitative Easing) is done to:",
        options: [
            { id: 'a', text: 'Increase the money supply and lower interest rates.', score: { business: 10, logic: 10, lead: 8 } },
            { id: 'b', text: 'Make everyone feel better about the economy.', score: { social: 10, psychology: 7 } },
            { id: 'c', text: 'Slow down the production of paper money.', score: { nature: 9, ethics: 6 } },
            { id: 'd', text: 'Punish banks that take too many risks.', score: { discipline: 10, business: 5 } }
        ],
        timeLimit: 60
    },
    // 144. Distributed Ledger (IT Tech)
    {
        id: 144,
        type: 'tech',
        text: "A 'Blockchain' is essentially:",
        options: [
            { id: 'a', text: 'A decentralized, immutable record of data.', score: { tech: 10, logic: 10, structural: 9 } },
            { id: 'b', text: 'A way to make the internet much faster.', score: { tech: 2, business: 4 } },
            { id: 'c', text: 'A giant wall of code for security.', score: { tactical: 10, tech: 6 } },
            { id: 'd', text: "Something that only exists for 'Bitcoin'.", score: { business: 10, logic: 2 } }
        ],
        timeLimit: 60
    },
    // 145. Sustainable Textile Dyeing (Fashion)
    {
        id: 145,
        type: 'interest',
        text: "'Waterless' dyeing is revolutionary because:",
        options: [
            { id: 'a', text: 'It prevents massive toxic runoff into rivers.', score: { nature: 10, ethics: 10, textiles: 9 } },
            { id: 'b', text: 'It makes the clothes feel dry after washing.', score: { textiles: 8, creative: 4 } },
            { id: 'c', text: 'It uses more electricity than water.', score: { tech: 10, business: 5 } },
            { id: 'd', text: 'It allows for only two colors: black and white.', score: { aesthetics: 6, logic: 4 } }
        ],
        timeLimit: 60
    },
    // 146. Adaptive Reuse Zoning (Architecture)
    {
        id: 146,
        type: 'logic',
        text: "'Mixed-Use' zoning allows for:",
        options: [
            { id: 'a', text: 'Residential, commercial, and social in one area.', score: { spatial: 10, social: 10, business: 9 } },
            { id: 'b', text: 'Building as many schools as possible.', score: { human: 10, structural: 6 } },
            { id: 'c', text: 'Hiding all factories underground.', score: { tactical: 10, spatial: 7 } },
            { id: 'd', text: 'Making everyone live in the same building.', score: { social: 8, logic: 4 } }
        ],
        timeLimit: 60
    },
    // 147. Bio-Defense (Army/Science)
    {
        id: 147,
        type: 'aptitude',
        text: "Responding to a biological threat requires:",
        options: [
            { id: 'a', text: 'Rapid containment, vaccination, and clear communication.', score: { medical: 10, tactical: 10, lead: 9 } },
            { id: 'b', text: 'Running away as fast as possible.', score: { courage: 2, tactical: 1 } },
            { id: 'c', text: 'Using more chemicals to kill the pathogen.', score: { tech: 10, nature: 2 } },
            { id: 'd', text: 'Waiting for high heat to naturally kill the virus.', score: { nature: 8, patience: 6 } }
        ],
        timeLimit: 45
    },
    // 148. Community Health Outreach (Humanist)
    {
        id: 148,
        type: 'personality',
        text: "Building trust in a community requires:",
        options: [
            { id: 'a', text: 'Listening to local needs and consistent presence.', score: { empathy: 10, social: 10, psychology: 9 } },
            { id: 'b', text: 'Showing up once with a lot of money.', score: { business: 10, social: 2 } },
            { id: 'c', text: 'Issuing strict medical orders to everyone.', score: { medical: 10, discipline: 7 } },
            { id: 'd', text: 'Advertising the clinic on giant billboards.', score: { business: 8, visuals: 6 } }
        ],
        timeLimit: 60
    },
    // 149. User Journey Mapping (Innovator)
    {
        id: 149,
        type: 'creative',
        text: "A 'User Journey' map visualization focuses on:",
        options: [
            { id: 'a', text: 'The steps a person takes to achieve a goal.', score: { creative: 10, psychology: 10, logic: 8 } },
            { id: 'b', text: 'The fastest path for the user to spend money.', score: { business: 10, tech: 5 } },
            { id: 'c', text: 'The color scheme of the entire website.', score: { aesthetics: 10, visuals: 7 } },
            { id: 'd', text: 'The location of the company\'s physical servers.', score: { tech: 8, spatial: 4 } }
        ],
        timeLimit: 60
    },
    // 150. Precision Surgical Robotics (Healthcare/IT)
    {
        id: 150,
        type: 'tech',
        text: "Robotic surgery is superior for:",
        options: [
            { id: 'a', text: 'Providing microscopic precision and small incisions.', score: { tech: 10, medical: 10, structural: 9 } },
            { id: 'b', text: 'Performing surgery ten times faster.', score: { medical: 2, tech: 1 } },
            { id: 'c', text: 'Replacing the need for a surgeon entirely.', score: { tech: 1, medical: 1 } },
            { id: 'd', text: 'Making the surgery much cheaper for the patient.', score: { business: 10, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 151. Post-Partum Care (Healthcare)
    {
        id: 151,
        type: 'aptitude',
        text: "The primary focus of post-partum care is:",
        options: [
            { id: 'a', text: 'Physical and emotional recovery of the mother.', score: { medical: 10, empathy: 10, psychology: 9 } },
            { id: 'b', text: 'Only the health of the newborn baby.', score: { medical: 8, social: 5 } },
            { id: 'c', text: 'The hospital\'s administrative efficiency.', score: { business: 10, logic: 4 } },
            { id: 'd', text: 'Scheduling future elective surgeries.', score: { medical: 5, business: 4 } }
        ],
        timeLimit: 60
    },
    // 152. Continuous Integration (IT Tech)
    {
        id: 152,
        type: 'tech',
        text: "CI/CD stands for:",
        options: [
            { id: 'a', text: 'Continuous Integration and Continuous Deployment.', score: { tech: 10, logic: 10, discipline: 8 } },
            { id: 'b', text: 'Code Inspection and Data Cleaning.', score: { tech: 4, logic: 2 } },
            { id: 'c', text: 'Consistent Innovation and Creative Design.', score: { creative: 10, aesthetics: 6 } },
            { id: 'd', text: 'Cloud Infrastructure and Database Connectivity.', score: { tech: 7, structural: 5 } }
        ],
        timeLimit: 60
    },
    // 153. Hedging with Futures (Commerce)
    {
        id: 153,
        type: 'logic',
        text: "A company hedges its fuel costs using futures to:",
        options: [
            { id: 'a', text: 'Lock in a price and reduce budget uncertainty.', score: { business: 10, logic: 10, tactical: 8 } },
            { id: 'b', text: 'Try to make a huge profit on price drops.', score: { business: 8, logic: 4 } },
            { id: 'c', text: 'Avoid paying any taxes on fuel.', score: { ethics: 2, logic: 1 } },
            { id: 'd', text: 'Impress the board with complex math.', score: { lead: 5, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 154. Organic Weed Management (Farming)
    {
        id: 154,
        type: 'interest',
        text: "Suppressing weeds in organic farming often uses:",
        options: [
            { id: 'a', text: 'Mulching and precise cover cropping.', score: { nature: 10, patience: 10, biology: 9 } },
            { id: 'b', text: 'Flamethrowers to burn everything periodically.', score: { tactical: 10, nature: 2 } },
            { id: 'c', text: 'Hiring as many workers as possible for hand pulling.', score: { business: 10, social: 7 } },
            { id: 'd', text: 'Using salt to kill the weeds forever.', score: { biology: 1, nature: 1 } }
        ],
        timeLimit: 60
    },
    // 155. Urban Heat Mitigation (Architecture)
    {
        id: 155,
        type: 'interest',
        text: "'Cool Roofs' reflect sunlight because they are:",
        options: [
            { id: 'a', text: 'Made of reflective materials or light colors.', score: { nature: 10, structural: 10, aesthetics: 7 } },
            { id: 'b', text: 'Equipped with giant air conditioning units.', score: { tech: 8, business: 5 } },
            { id: 'c', text: 'Built in the shade of other buildings.', score: { spatial: 10, logic: 4 } },
            { id: 'd', text: 'Made of solid ice in the winter.', score: { nature: 2, tech: 1 } }
        ],
        timeLimit: 60
    },
    // 156. Logistics Operations (Army/Navy)
    {
        id: 156,
        type: 'logic',
        text: "A 'Single Point of Failure' in a supply line is:",
        options: [
            { id: 'a', text: 'A component whose failure shuts down the whole system.', score: { logic: 10, tactical: 10, structural: 9 } },
            { id: 'b', text: 'The location of the general\'s office.', score: { lead: 8, social: 4 } },
            { id: 'c', text: 'One employee who is always late.', score: { discipline: 10, logistics: 5 } },
            { id: 'd', text: 'The point where the supply line starts.', score: { spatial: 10, logic: 3 } }
        ],
        timeLimit: 45
    },
    // 157. Fashion Supply Chain Transparency
    {
        id: 157,
        type: 'interest',
        text: "Transparency in the fashion supply chain means:",
        options: [
            { id: 'a', text: 'Publicly revealing every factory and sourcing source.', score: { ethics: 10, business: 10, social: 9 } },
            { id: 'b', text: 'Using clear, see-through fabrics in every design.', score: { creative: 10, aesthetics: 6 } },
            { id: 'c', text: 'Only selling clothes on the internet.', score: { tech: 8, business: 5 } },
            { id: 'd', text: 'Having a glass wall in the company headquarters.', score: { structural: 10, spatial: 7 } }
        ],
        timeLimit: 60
    },
    // 158. Structural Load Distribution (Architecture)
    {
        id: 158,
        type: 'aptitude',
        text: "A 'Truss' is used in bridges to:",
        options: [
            { id: 'a', text: 'Distribute loads through triangular structures.', score: { structural: 10, physics: 10, logic: 8 } },
            { id: 'b', text: 'Make the bridge look more artistic.', score: { creative: 10, aesthetics: 9 } },
            { id: 'c', text: 'Stop birds from nesting on the beams.', score: { nature: 5, structural: 4 } },
            { id: 'd', text: 'Provide a place for billboards.', score: { business: 10, spatial: 5 } }
        ],
        timeLimit: 30
    },
    // 159. Emotional Regulation (Psychology)
    {
        id: 159,
        type: 'personality',
        text: "When feeling overwhelmed, 'Box Breathing' helps by:",
        options: [
            { id: 'a', text: 'Regulating the nervous system through constant rhythm.', score: { resilience: 10, psychology: 10, biology: 9 } },
            { id: 'b', text: 'Thinking about a box to distract the mind.', score: { creative: 8, psychology: 4 } },
            { id: 'c', text: 'Holding your breath until you pass out.', score: { medical: 2, logic: 1 } },
            { id: 'd', text: 'Asking someone else to breathe for you.', score: { social: 10, empathy: 2 } }
        ],
        timeLimit: 60
    },
    // 160. Microservices Circuit Breaker (IT Tech)
    {
        id: 160,
        type: 'tech',
        text: "The 'Circuit Breaker' pattern in microservices prevents:",
        options: [
            { id: 'a', text: "Cascading failures across the whole system.", score: { tech: 10, structural: 10, logic: 9 } },
            { id: 'b', text: 'The building from literal electrical fires.', score: { tech: 2, logic: 1 } },
            { id: 'c', text: 'Developers from working on the same code.', score: { social: 4, tech: 3 } },
            { id: 'd', text: 'Users from clicking the same button twice.', score: { tech: 5, creative: 2 } }
        ],
        timeLimit: 60
    },
    // 161. Drip Irrigation Maintenance (Farming)
    {
        id: 161,
        type: 'aptitude',
        text: "A clogged emitter in a drip line is usually caused by:",
        options: [
            { id: 'a', text: 'Mineral buildup or biological growth (algae).', score: { nature: 10, biology: 10, tech: 8 } },
            { id: 'b', text: 'Wait for the rain to naturally clear it.', score: { patience: 10, nature: 3 } },
            { id: 'c', text: 'Cutting the line and starting again.', score: { logic: 4, structural: 2 } },
            { id: 'd', text: 'Increasing the water pressure to maximum.', score: { tactical: 8, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 162. Strategic Deterrence (Navy/Army)
    {
        id: 162,
        type: 'logic',
        text: "The goal of 'Deterrence' is to:",
        options: [
            { id: 'a', text: 'Prevent conflict by making the cost of attack too high.', score: { tactical: 10, lead: 10, psychology: 9 } },
            { id: 'b', text: 'Win every battle through total aggression.', score: { courage: 10, tactical: 6 } },
            { id: 'c', text: 'Avoid having any military force at all.', score: { ethics: 8, social: 5 } },
            { id: 'd', text: 'Wait for the enemy to make the first mistake.', score: { patience: 10, discipline: 7 } }
        ],
        timeLimit: 45
    },
    // 163. Brand Positioning (Fashion/Commerce)
    {
        id: 163,
        type: 'creative',
        text: "Positioning a brand as 'Eco-Luxury' requires:",
        options: [
            { id: 'a', text: 'High-end design AND documented sustainability.', score: { business: 10, aesthetics: 10, ethics: 10 } },
            { id: 'b', text: 'Just charging a lot for organic cotton.', score: { business: 10, ethics: 2 } },
            { id: 'c', text: 'Only selling to famous environmentalists.', score: { social: 10, lead: 6 } },
            { id: 'd', text: 'Using the color green in every advertisement.', score: { visuals: 10, business: 4 } }
        ],
        timeLimit: 60
    },
    // 164. Sustainable Concrete Mix (Architecture)
    {
        id: 164,
        type: 'tech',
        text: "Using 'Fly Ash' in concrete reduces:",
        options: [
            { id: 'a', text: 'Industrial waste and the carbon footprint.', score: { nature: 10, tech: 10, structural: 9 } },
            { id: 'b', text: 'The strength of the building significantly.', score: { logic: 4, structural: 2 } },
            { id: 'c', text: 'The amount of water needed for the mix.', score: { nature: 8, tech: 6 } },
            { id: 'd', text: 'The time it takes for the concrete to dry.', score: { structural: 8, patience: 5 } }
        ],
        timeLimit: 60
    },
    // 165. Group Dynamics (Psychology/Business)
    {
        id: 165,
        type: 'aptitude',
        text: "The 'Bystander Effect' in groups leads to:",
        options: [
            { id: 'a', text: 'Reduced individual responsibility in emergencies.', score: { psychology: 10, social: 10, logic: 8 } },
            { id: 'b', text: 'Everyone coordination perfectly to help.', score: { social: 2, lead: 1 } },
            { id: 'c', text: 'A single leader taking total control.', score: { lead: 10, discipline: 6 } },
            { id: 'd', text: 'People forgetting what happened entirely.', score: { psychology: 6, medical: 2 } }
        ],
        timeLimit: 60
    },
    // 166. Diagnostic Imaging (Healthcare)
    {
        id: 166,
        type: 'tech',
        text: "An MRI scan uses magnets and radio waves to:",
        options: [
            { id: 'a', text: 'Create detailed images of soft tissues.', score: { medical: 10, tech: 10, visuals: 9 } },
            { id: 'b', text: 'Provide a healthy dose of vitamins to the skin.', score: { medical: 1, biology: 1 } },
            { id: 'c', text: 'Locate metal objects hidden inside the body.', score: { tactical: 8, tech: 5 } },
            { id: 'd', text: 'Speed up the healing of broken bones.', score: { medical: 4, tech: 3 } }
        ],
        timeLimit: 60
    },
    // 167. Server Side Rendering (IT Tech)
    {
        id: 167,
        type: 'tech',
        text: "SSR (Server Side Rendering) is best for:",
        options: [
            { id: 'a', text: 'Better SEO and faster initial page loads.', score: { tech: 10, business: 10, logic: 8 } },
            { id: 'b', text: 'Making the code impossible to hack.', score: { tech: 2, tactical: 1 } },
            { id: 'c', text: 'Reducing the cost of the server hardware.', score: { business: 8, tech: 4 } },
            { id: 'd', text: 'Designing the logo for the app.', score: { creative: 10, aesthetics: 5 } }
        ],
        timeLimit: 60
    },
    // 168. Crop Insurance (Farming/Commerce)
    {
        id: 168,
        type: 'business',
        text: "Crop insurance helps farmers primarily by:",
        options: [
            { id: 'a', text: 'Buffer against financial loss from extreme weather.', score: { business: 10, nature: 10, patience: 9 } },
            { id: 'b', text: 'Making the crops grow faster in heavy rain.', score: { biology: 2, logic: 1 } },
            { id: 'c', text: 'Paying for the wedding of the farmer\'s children.', score: { social: 8, business: 2 } },
            { id: 'd', text: 'Hiring robots to harvest during a storm.', score: { tech: 10, tactical: 6 } }
        ],
        timeLimit: 60
    },
    // 169. Counter-Insurgency (Army)
    {
        id: 169,
        type: 'aptitude',
        text: "Successful COIN (Counter-Insurgency) relies on:",
        options: [
            { id: 'a', text: 'Winning the trust of the local population.', score: { psychology: 10, empathy: 10, lead: 9, social: 9 } },
            { id: 'b', text: 'Having the most powerful air force.', score: { tech: 10, tactical: 4 } },
            { id: 'c', text: 'Searching every single house every day.', score: { discipline: 10, tactical: 5 } },
            { id: 'd', text: 'Negotiating only with the enemy leadership.', score: { business: 8, lead: 6 } }
        ],
        timeLimit: 45
    },
    // 170. Luxury Brand Perception (Fashion)
    {
        id: 170,
        type: 'personality',
        text: "The 'Scarcity' principle in luxury fashion means:",
        options: [
            { id: 'a', text: 'Limiting production to increase exclusivity and demand.', score: { business: 10, trends: 10, logic: 9 } },
            { id: 'b', text: 'Having no fabric left to make clothes.', score: { logic: 2, creative: 1 } },
            { id: 'c', text: 'Charging the lowest possible price to sell out.', score: { business: 4, social: 2 } },
            { id: 'd', text: 'Only selling clothes to people you personally know.', score: { social: 10, business: 5 } }
        ],
        timeLimit: 60
    },
    // 171. Passive Solar Design (Architecture)
    {
        id: 171,
        type: 'aptitude',
        text: "Passive solar heating is achieved by:",
        options: [
            { id: 'a', text: 'Proper building orientation and thermal mass.', score: { nature: 10, structural: 10, spatial: 9, physics: 9 } },
            { id: 'b', text: 'Installing giant solar panels on the lawn.', score: { tech: 10, nature: 7 } },
            { id: 'c', text: 'Painting all internal walls black.', score: { aesthetics: 10, physics: 5 } },
            { id: 'd', text: 'Leaving the windows open all summer.', score: { nature: 6, logic: 4 } }
        ],
        timeLimit: 60
    },
    // 172. Attachment Theory (Psychology)
    {
        id: 172,
        type: 'aptitude',
        text: "Secure attachment in childhood leads to:",
        options: [
            { id: 'a', text: 'Emotional resilience and healthier adult relationships.', score: { psychology: 10, resilience: 10, social: 9, empathy: 9 } },
            { id: 'b', text: 'Being an expert in fixing mechanical objects.', score: { structural: 10, tech: 5 } },
            { id: 'c', text: 'Never needing to talk to anyone ever again.', score: { tactical: 4, psychology: 1 } },
            { id: 'd', text: 'The ability to remember every dream perfectly.', score: { creative: 8, psychology: 6 } }
        ],
        timeLimit: 60
    },
    // 173. Liquidity Ratios (Commerce)
    {
        id: 173,
        type: 'logic',
        text: "A company's 'Current Ratio' measures:",
        options: [
            { id: 'a', text: "Ability to pay short-term debts with current assets.", score: { business: 10, logic: 10, lead: 8 } },
            { id: 'b', text: 'The amount of water they use in production.', score: { nature: 5, tech: 1 } },
            { id: 'c', text: 'The number of employees they have right now.', score: { social: 10, management: 7 } },
            { id: 'd', text: 'The total value of their office furniture.', score: { aesthetics: 8, business: 4 } }
        ],
        timeLimit: 60
    },
    // 174. API Gateway Pattern (IT Tech)
    {
        id: 174,
        type: 'tech',
        text: "An API Gateway acts as a:",
        options: [
            { id: 'a', text: 'Single entry point for all client requests.', score: { tech: 10, structural: 10, tactical: 8 } },
            { id: 'b', text: 'Physical door to the server room.', score: { structural: 5, tactical: 4 } },
            { id: 'c', text: 'Way to block all traffic from other countries.', score: { tactical: 10, tech: 5 } },
            { id: 'd', text: 'System that writes your code for you.', score: { creative: 10, tech: 6 } }
        ],
        timeLimit: 60
    },
    // 175. Naval Mine Countermeasures
    {
        id: 175,
        type: 'tactical',
        text: "Clearing sea mines safely requires:",
        options: [
            { id: 'a', text: 'Autonomous underwater vehicles and sonar.', score: { tactical: 10, tech: 10, patience: 10 } },
            { id: 'b', text: 'Driving a giant ship through the area quickly.', score: { courage: 10, tactical: 1 } },
            { id: 'c', text: 'Waiting for the mines to blow up naturally.', score: { patience: 10, logic: 2 } },
            { id: 'd', text: 'Asking the enemy where they put them.', score: { social: 8, lead: 5 } }
        ],
        timeLimit: 45
    },
    // 176. Neonatal Intensive Care (Healthcare)
    {
        id: 176,
        type: 'aptitude',
        text: "The NICU (Neonatal Intensive Care Unit) is for:",
        options: [
            { id: 'a', text: 'Newborn infants requiring specialized medical support.', score: { medical: 10, empathy: 10, discipline: 9 } },
            { id: 'b', text: 'Elderly patients with chronic conditions.', score: { medical: 6, logic: 2 } },
            { id: 'c', text: 'Training new doctors in basic surgery.', score: { medical: 8, social: 5 } },
            { id: 'd', text: 'Holding large-scale medical conferences.', score: { lead: 8, business: 4 } }
        ],
        timeLimit: 60
    },
    // 177. Serverless Cold Start Mitigation (IT Tech)
    {
        id: 177,
        type: 'tech',
        text: "To mitigate serverless 'Cold Starts', you can:",
        options: [
            { id: 'a', text: "Use 'Provisioned Concurrency' or keep-warm pings.", score: { tech: 10, logic: 10, business: 7 } },
            { id: 'b', text: 'Make the code file as large as possible.', score: { logic: 1, tech: 1 } },
            { id: 'c', text: 'Only run the code during the daytime.', score: { nature: 5, business: 3 } },
            { id: 'd', text: 'Ask users to wait five minutes before clicking.', score: { patience: 10, social: 2 } }
        ],
        timeLimit: 60
    },
    // 178. Interest Rate Swaps (Commerce)
    {
        id: 178,
        type: 'logic',
        text: "An Interest Rate Swap allows two parties to:",
        options: [
            { id: 'a', text: 'Exchange fixed-rate for floating-rate interest payments.', score: { business: 10, logic: 10, tactical: 8 } },
            { id: 'b', text: 'Borrow money from each other without interest.', score: { business: 5, ethics: 6 } },
            { id: 'c', text: 'Change the owner of a large company.', score: { lead: 10, business: 7 } },
            { id: 'd', text: 'Predict the future price of gold perfectly.', score: { logic: 5, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 179. Permaculture Design (Farming)
    {
        id: 179,
        type: 'interest',
        text: "Permaculture 'Zoning' organizes a farm based on:",
        options: [
            { id: 'a', text: 'The frequency of human intervention needed.', score: { nature: 10, spatial: 10, logic: 9, biology: 8 } },
            { id: 'b', text: 'The price of the land in each area.', score: { business: 10, spatial: 5 } },
            { id: 'c', text: 'Alphabetical order of the plant names.', score: { logic: 2, creative: 1 } },
            { id: 'd', text: 'The distance to the nearest city.', score: { social: 8, spatial: 6 } }
        ],
        timeLimit: 60
    },
    // 180. Smart Glass Tech (Architecture)
    {
        id: 180,
        type: 'tech',
        text: "Electrochromic 'Smart Glass' works by:",
        options: [
            { id: 'a', text: 'Using electricity to change the tint of the window.', score: { tech: 10, nature: 10, aesthetics: 9, structural: 8 } },
            { id: 'b', text: 'Hiring someone to paint the glass every day.', score: { business: 8, social: 4 } },
            { id: 'c', text: 'Reflecting light only for specific people.', score: { creative: 10, tech: 5 } },
            { id: 'd', text: 'Allowing the glass to grow like a plant.', score: { biology: 8, creative: 6 } }
        ],
        timeLimit: 60
    },
    // 181. Counter-IED Tactics (Army)
    {
        id: 181,
        type: 'aptitude',
        text: "The first step in C-IED (Counter-IED) is:",
        options: [
            { id: 'a', text: 'Detection of anomalies in the environment.', score: { tactical: 10, patience: 10, discipline: 9, tech: 8 } },
            { id: 'b', text: 'Running over the object with a heavy vehicle.', score: { courage: 10, tactical: 1 } },
            { id: 'c', text: 'Calling the local news to report it.', score: { social: 10, communication: 7 } },
            { id: 'd', text: 'Waiting for a robot to find it automatically.', score: { tech: 10, patience: 6 } }
        ],
        timeLimit: 45
    },
    // 182. Submarine Stealth (Navy)
    {
        id: 182,
        type: 'tech',
        text: "Submarine 'Aneurysm' (Acoustic Stealth) requires:",
        options: [
            { id: 'a', text: 'Damping machinery vibrations and hull shape.', score: { tech: 10, structural: 10, tactical: 9 } },
            { id: 'b', text: 'Painting the submarine a very dark blue.', score: { aesthetics: 8, tactical: 4 } },
            { id: 'c', text: 'Asking the crew to never speak or move.', score: { discipline: 10, social: 1 } },
            { id: 'd', text: 'Running the submarine entirely on wind power.', score: { nature: 10, tech: 2 } }
        ],
        timeLimit: 60
    },
    // 183. Fashion Brand Archetypes (Fashion)
    {
        id: 183,
        type: 'creative',
        text: "A 'Heritage' fashion brand focuses on:",
        options: [
            { id: 'a', text: 'Long history, craftsmanship, and timeless style.', score: { creative: 10, business: 9, aesthetics: 10 } },
            { id: 'b', text: 'Following every internet trend immediately.', score: { trends: 10, logic: 4 } },
            { id: 'c', text: 'Using the cheapest possible materials.', score: { business: 10, ethics: 1 } },
            { id: 'd', text: 'Only selling to people under the age of 20.', score: { social: 8, trends: 7 } }
        ],
        timeLimit: 60
    },
    // 184. Earthquake Engineering (Architecture)
    {
        id: 184,
        type: 'aptitude',
        text: "'Base Isolation' in buildings acts like:",
        options: [
            { id: 'a', text: 'Shock absorbers that separate building from ground.', score: { structural: 10, physics: 10, tech: 9 } },
            { id: 'b', text: 'A giant magnet that holds the building still.', score: { tech: 8, logic: 4 } },
            { id: 'c', text: 'Making the building as light as possible.', score: { structural: 7, physics: 6 } },
            { id: 'd', text: 'Building the entire base out of solid rubber.', score: { creative: 10, structural: 5 } }
        ],
        timeLimit: 30
    },
    // 185. Behavioral Economics in Policy (Psychology)
    {
        id: 185,
        type: 'logic',
        text: "'Hyperbolic Discounting' explains why people:",
        options: [
            { id: 'a', text: 'Prefer small immediate rewards over large future ones.', score: { psychology: 10, logic: 10, business: 9 } },
            { id: 'b', text: 'Think that objects in a store are always too expensive.', score: { business: 8, logic: 5 } },
            { id: 'c', text: 'Buy items only when they are on sale.', score: { trends: 10, psychology: 7 } },
            { id: 'd', text: 'Believe they are better drivers than average.', score: { lead: 8, psychology: 6 } }
        ],
        timeLimit: 60
    },
    // 186. Mental Health in Combat (Psychology/Army)
    {
        id: 186,
        type: 'personality',
        text: "After combat, 'Normalization' training helps by:",
        options: [
            { id: 'a', text: 'Helping soldiers understand that their reactions are normal.', score: { psychology: 10, resilience: 10, social: 9, empathy: 9 } },
            { id: 'b', text: 'Giving everyone a medal for their service.', score: { lead: 10, social: 7 } },
            { id: 'c', text: 'Instructing them to forget everything they saw.', score: { tactical: 5, ethics: 1 } },
            { id: 'd', text: 'Making them do 100 pushups every morning.', score: { discipline: 10, physical: 8 } }
        ],
        timeLimit: 60
    },
    // 187. Zero-Knowledge Proofs (IT Tech)
    {
        id: 187,
        type: 'tech',
        text: "A ZK-Proof (Zero-Knowledge) allows you to:",
        options: [
            { id: 'a', text: 'Prove you know a secret without revealing the secret.', score: { tech: 10, logic: 10, tactical: 9 } },
            { id: 'b', text: 'Make the secret completely public to everyone.', score: { social: 8, tech: 2 } },
            { id: 'c', text: 'Delete the secret from the internet forever.', score: { tactical: 10, tech: 5 } },
            { id: 'd', text: 'Generate a new secret automatically.', score: { creative: 10, tech: 6 } }
        ],
        timeLimit: 60
    },
    // 188. Vertical Farming Scaling (Farming)
    {
        id: 188,
        type: 'tech',
        text: "The main energy cost in vertical farming is:",
        options: [
            { id: 'a', text: 'Artificial lighting and climate control systems.', score: { tech: 10, nature: 10, business: 9, structural: 8 } },
            { id: 'b', text: 'The cost of the water used for irrigation.', score: { nature: 5, business: 4 } },
            { id: 'c', text: 'Transporting the food to the local store.', score: { logistics: 10, business: 7 } },
            { id: 'd', text: 'The seeds purchased from the supplier.', score: { biology: 8, business: 6 } }
        ],
        timeLimit: 60
    },
    // 189. Urban Guerrilla Warfare (Army)
    {
        id: 189,
        type: 'tactical',
        text: "In urban combat, 'Verticality' refers to:",
        options: [
            { id: 'a', text: 'Using multiple floors and roofs for movement/cover.', score: { tactical: 10, spatial: 10, logic: 9 } },
            { id: 'b', text: 'Building the tallest possible base camp.', score: { structural: 10, tactical: 4 } },
            { id: 'c', text: 'Attacking only from the top of the mountain.', score: { spatial: 8, tactical: 5 } },
            { id: 'd', text: 'Scaling the walls of a skyscraper without gear.', score: { courage: 10, physical: 9 } }
        ],
        timeLimit: 45
    },
    // 190. Slow Fashion Movement (Fashion/Ethics)
    {
        id: 190,
        type: 'interest',
        text: "The 'Slow Fashion' philosophy encourages:",
        options: [
            { id: 'a', text: 'Buying fewer, higher quality pieces that last years.', score: { ethics: 10, aesthetics: 10, textiles: 9, nature: 9 } },
            { id: 'b', text: 'Walking slowly when you are wearing nice clothes.', score: { creative: 5, social: 2 } },
            { id: 'c', text: 'Making the fashion shows last for three days.', score: { business: 8, social: 6 } },
            { id: 'd', text: 'Designing clothes that are only for older people.', score: { social: 10, trends: 4 } }
        ],
        timeLimit: 60
    },
    // 191. Net Zero Energy Buildings (Architecture)
    {
        id: 191,
        type: 'tech',
        text: "A 'Net Zero' building must:",
        options: [
            { id: 'a', text: 'Produce as much energy as it consumes annually.', score: { nature: 10, tech: 10, structural: 9, ethics: 9 } },
            { id: 'b', text: 'Have no electricity or water connection.', score: { nature: 5, logic: 1 } },
            { id: 'c', text: 'Be built entirely out of recycled plastic.', score: { nature: 10, structural: 7 } },
            { id: 'd', text: 'Cost zero dollars to build for the owner.', score: { business: 10, ethics: 4 } }
        ],
        timeLimit: 60
    },
    // 192. Transpersonal Psychology (Psychology)
    {
        id: 192,
        type: 'personality',
        text: "Transpersonal psychology explores:",
        options: [
            { id: 'a', text: 'Spiritual, peak, and mystical human experiences.', score: { psychology: 10, empathy: 10, creative: 9, social: 8 } },
            { id: 'b', text: 'How people move between different cities.', score: { social: 6, spatial: 4 } },
            { id: 'c', text: 'The history of personal computers.', score: { tech: 10, logic: 4 } },
            { id: 'd', text: 'How to make more friends in the office.', score: { social: 10, psychology: 7 } }
        ],
        timeLimit: 60
    },
    // 193. CAPM Model (Commerce)
    {
        id: 193,
        type: 'logic',
        text: "The CAPM model helps investors calculate:",
        options: [
            { id: 'a', text: 'Expected return based on risk (Beta) and market.', score: { business: 10, logic: 10, tech: 8 } },
            { id: 'b', text: 'The exact date the stock market will crash.', score: { logic: 2, tech: 1 } },
            { id: 'c', text: 'The total value of all the cash in the vault.', score: { business: 8, logic: 6 } },
            { id: 'd', text: 'How much to pay the CEO of the company.', score: { lead: 10, business: 7 } }
        ],
        timeLimit: 60
    },
    // 194. Event-Driven Architecture (IT Tech)
    {
        id: 194,
        type: 'tech',
        text: "Event-Driven systems communicate using:",
        options: [
            { id: 'a', text: "Asynchronous messages or 'events' sent between services.", score: { tech: 10, logic: 10, structural: 9 } },
            { id: 'b', text: 'Direct, real-time phone calls between servers.', score: { social: 5, tech: 4 } },
            { id: 'c', text: 'A giant centralized database for everything.', score: { logic: 4, tech: 3 } },
            { id: 'd', text: 'Small drones carrying USB drives.', score: { tech: 8, structural: 6 } }
        ],
        timeLimit: 60
    },
    // 195. Maritime Salvage (Navy/Legal)
    {
        id: 195,
        type: 'logic',
        text: "Under 'Law of Salvage', a rescuer is entitled to:",
        options: [
            { id: 'a', text: 'A reward based on the value of property saved.', score: { legal: 10, business: 10, courage: 9, tactical: 8 } },
            { id: 'b', text: 'Total ownership of the ship they saved.', score: { legal: 5, business: 4 } },
            { id: 'c', text: 'A free trip to any country in the world.', score: { social: 10, geography: 7 } },
            { id: 'd', text: 'The right to sink the ship if they fail.', score: { tactical: 6, logic: 2 } }
        ],
        timeLimit: 60
    },
    // 196. Biometric Security (IT/Defense)
    {
        id: 196,
        type: 'tech',
        text: "The main risk of 'Biometric' data storage is:",
        options: [
            { id: 'a', text: "Unlike passwords, biometrics CANNOT be changed if leaked.", score: { tactical: 10, tech: 10, ethics: 9, logic: 8 } },
            { id: 'b', text: 'It is too easy for people to forget their own face.', score: { biology: 4, psychology: 2 } },
            { id: 'c', text: 'The scanners are too expensive for most people.', score: { business: 10, tech: 7 } },
            { id: 'd', text: 'It requires people to be physically present.', score: { social: 8, spatial: 6 } }
        ],
        timeLimit: 60
    },
    // 197. Soil Carbon Sequestration (Farming)
    {
        id: 197,
        type: 'interest',
        text: "Regenerative farming stores carbon in the soil by:",
        options: [
            { id: 'a', text: 'Minimal till and diverse cover cropping.', score: { nature: 10, ethics: 10, biology: 9, patience: 9 } },
            { id: 'b', text: 'Injecting liquid CO2 deep underground.', score: { tech: 10, nature: 2 } },
            { id: 'c', text: 'Using more chemical fertilizers than usual.', score: { nature: 1, biology: 1 } },
            { id: 'd', text: 'Building giant glass domes over the fields.', score: { structural: 10, creative: 6 } }
        ],
        timeLimit: 60
    },
    // 198. Parametric Design (Architecture)
    {
        id: 198,
        type: 'creative',
        text: "Parametric design uses algorithms to:",
        options: [
            { id: 'a', text: 'Generate complex geometries based on input rules.', score: { creative: 10, tech: 10, structural: 9, aesthetics: 9 } },
            { id: 'b', text: 'Calculate the total cost of the building.', score: { business: 10, logic: 8 } },
            { id: 'c', text: 'Choose the best location for the office.', score: { spatial: 10, logic: 7 } },
            { id: 'd', text: 'Design a building that is perfectly square.', score: { aesthetics: 6, logic: 4 } }
        ],
        timeLimit: 60
    },
    // 199. Consumer Neuroscience (Psychology/Fashion)
    {
        id: 199,
        type: 'interest',
        text: "'Neuro-marketing' uses brain imaging to:",
        options: [
            { id: 'a', text: 'Measure subconscious reactions to products/ads.', score: { psychology: 10, business: 10, tech: 9, trends: 8 } },
            { id: 'b', text: 'Help people remember where they bought something.', score: { psychology: 6, social: 4 } },
            { id: 'c', text: 'Predict the winner of a fashion show.', score: { creative: 10, electronics: 7 } },
            { id: 'd', text: 'Cure people of their desire to buy clothes.', score: { ethics: 10, medical: 6 } }
        ],
        timeLimit: 60
    },
    // 200. Rapid Prototyping (Medical/IT)
    {
        id: 200,
        type: 'tech',
        text: "3D printing specialized medical implants allows:",
        options: [
            { id: 'a', text: 'Patient-specific geometry and faster production.', score: { tech: 10, medical: 10, structural: 9, empathy: 8 } },
            { id: 'b', text: 'Making the implants out of solid candy.', score: { creative: 5, biology: 1 } },
            { id: 'c', text: 'The patient to print the implant at home.', score: { tech: 8, social: 4 } },
            { id: 'd', text: 'Reducing the cost of the surgery to zero.', score: { business: 10, tech: 3 } }
        ],
        timeLimit: 60
    },
    // 201. Personalized Medicine (Medical/Science)
    {
        id: 201,
        type: 'aptitude',
        text: "Personalized medicine uses genetic info to:",
        options: [
            { id: 'a', text: 'Tailor medical treatment to the individual patient.', score: { medical: 10, biology: 10, logic: 9, empathy: 8 } },
            { id: 'b', text: 'Make everyone take the exact same medicine.', score: { logic: 2, medical: 1 } },
            { id: 'c', text: 'Reduce the cost of health insurance for everyone.', score: { business: 8, social: 6 } },
            { id: 'd', text: 'Predict what the patient will eat for lunch.', score: { creative: 5, biology: 4 } }
        ],
        timeLimit: 60
    },
    // 202. Garbage Collection Algorithms (IT Tech)
    {
        id: 202,
        type: 'tech',
        text: "Automatic 'Garbage Collection' in programming:",
        options: [
            { id: 'a', text: 'Reclaims memory that is no longer being used.', score: { tech: 10, logic: 10, discipline: 8 } },
            { id: 'b', text: 'Deletes all the files on the hard drive.', score: { tech: 1, logic: 1 } },
            { id: 'c', text: 'Organizes the user\'s desktop folders.', score: { spatial: 8, tech: 5 } },
            { id: 'd', text: 'Picks up physical trash in the office.', score: { nature: 10, social: 7 } }
        ],
        timeLimit: 60
    },
    // 203. SQL Joins (IT Tech)
    {
        id: 203,
        type: 'tech',
        text: "A 'LEFT JOIN' in SQL retrieves:",
        options: [
            { id: 'a', text: 'All rows from the left table and matched rows from the right.', score: { tech: 10, logic: 10, structural: 8 } },
            { id: 'b', text: 'Only the rows that exist in both tables.', score: { logic: 10, tech: 6 } },
            { id: 'c', text: 'Rows that are on the left side of the screen.', score: { spatial: 10, tech: 2 } },
            { id: 'd', text: 'The first ten rows of the entire database.', score: { business: 5, tech: 4 } }
        ],
        timeLimit: 60
    },
    // 204. Landrace Varieties (Farming)
    {
        id: 204,
        type: 'interest',
        text: "A 'Landrace' crop variety is one that has:",
        options: [
            { id: 'a', text: 'Adapted to a specific local environment over time.', score: { nature: 10, biology: 10, patience: 9 } },
            { id: 'b', text: 'Been engineered in a high-tech lab last year.', score: { tech: 10, biology: 5 } },
            { id: 'c', text: 'The highest possible yield in any conditions.', score: { business: 10, logic: 7 } },
            { id: 'd', text: 'The most colorful flowers in the region.', score: { aesthetics: 10, creative: 8 } }
        ],
        timeLimit: 60
    },
    // 205. Active Acoustic Control (Architecture)
    {
        id: 205,
        type: 'tech',
        text: "Active acoustic systems in buildings use:",
        options: [
            { id: 'a', text: 'Microphones and speakers to manipulate sound fields.', score: { tech: 10, structural: 10, aesthetics: 8 } },
            { id: 'b', text: 'Thicker walls to block all sound completely.', score: { structural: 8, logic: 5 } },
            { id: 'c', text: 'Giant curtains to absorb high frequencies.', score: { textiles: 9, aesthetics: 7 } },
            { id: 'd', text: 'Water fountains to create pleasant white noise.', score: { nature: 10, creative: 7 } }
        ],
        timeLimit: 60
    },
    // 206. Logistic Regression Analysis (Commerce)
    {
        id: 206,
        type: 'logic',
        text: "Logistic regression is primarily used to:",
        options: [
            { id: 'a', text: 'Predict the probability of a binary outcome.', score: { business: 10, logic: 10, tech: 9 } },
            { id: 'b', text: 'Calculate the total square footage of a building.', score: { structural: 10, logic: 6 } },
            { id: 'c', text: 'Determine the best price for a new product.', score: { business: 10, creative: 7 } },
            { id: 'd', text: 'Find the shortest path for a delivery truck.', score: { logistics: 10, spatial: 8 } }
        ],
        timeLimit: 60
    },
    // 207. Supply Chain Resiliency (Business/Tactical)
    {
        id: 207,
        type: 'logic',
        text: "A 'Resilient' supply chain is one that can:",
        options: [
            { id: 'a', text: 'Absorb shocks and recover quickly from disruptions.', score: { business: 10, tactical: 10, resilience: 10, lead: 9 } },
            { id: 'b', text: 'Always offer the lowest possible prices.', score: { business: 8, logic: 5 } },
            { id: 'c', text: 'Predict the future with 100% accuracy.', score: { logic: 2, tech: 1 } },
            { id: 'd', text: 'Hiring as many people as possible.', score: { social: 10, social_impact: 7 } }
        ],
        timeLimit: 45
    },
    // 208. Emotional Branding (Fashion/Psychology)
    {
        id: 208,
        type: 'creative',
        text: "Emotional branding aims to create a:",
        options: [
            { id: 'a', text: 'Deep personal connection between consumer and brand.', score: { psychology: 10, creative: 10, social: 9, aesthetics: 9 } },
            { id: 'b', text: 'Brand that everyone thinks is very funny.', score: { social: 10, creative: 8 } },
            { id: 'c', text: 'Product that is as cheap as possible.', score: { business: 10, logic: 4 } },
            { id: 'd', text: 'Logo that uses only the color blue.', score: { visuals: 10, aesthetics: 6 } }
        ],
        timeLimit: 60
    },
    // 209. Social Housing Zoning (Architecture)
    {
        id: 209,
        type: 'interest',
        text: "'Inclusionary Zoning' requires developers to:",
        options: [
            { id: 'a', text: 'Include a portion of affordable units in new projects.', score: { social: 10, ethics: 10, spatial: 9, business: 8 } },
            { id: 'b', text: 'Build a park next to every skyscraper.', score: { nature: 10, social: 7 } },
            { id: 'c', text: 'Paint all the houses the same color.', score: { aesthetics: 8, logic: 4 } },
            { id: 'd', text: 'Invite the neighbors to every board meeting.', score: { social: 10, lead: 7 } }
        ],
        timeLimit: 60
    },
    // 210. Pediatric Psychology (Psychology)
    {
        id: 210,
        type: 'aptitude',
        text: "Pediatric psychologists focus on the:",
        options: [
            { id: 'a', text: 'Psychological aspects of illness in children/teens.', score: { psychology: 10, medical: 10, empathy: 10, social: 9 } },
            { id: 'b', text: 'Physical growth patterns of infants.', score: { biology: 10, medical: 7 } },
            { id: 'c', text: 'How to make children study harder for exams.', score: { discipline: 10, social: 6 } },
            { id: 'd', text: 'Best toys for different age groups.', score: { creative: 10, play: 8 } }
        ],
        timeLimit: 60
    },
    // 211. Quantum Safe Cryptography (IT Tech/Defense)
    {
        id: 211,
        type: 'tech',
        text: "Post-Quantum Cryptography (PQC) is designed to:",
        options: [
            { id: 'a', text: 'Withstand attacks from future quantum computers.', score: { tech: 10, tactical: 10, logic: 9, structural: 8 } },
            { id: 'b', text: 'Make traditional computers run ten times faster.', score: { tech: 5, logic: 2 } },
            { id: 'c', text: 'Encrypt the internet for underwater use.', score: { navy: 10, tech: 6 } },
            { id: 'd', text: 'Replace all current passwords with facial scans.', score: { tactical: 8, tech: 7 } }
        ],
        timeLimit: 60
    },
    // 212. Aquaponics Ecosystems (Farming/Science)
    {
        id: 212,
        type: 'interest',
        text: "In aquaponics, fish waste provides:",
        options: [
            { id: 'a', text: 'Nutrients for the plants through natural bacteria.', score: { nature: 10, biology: 10, patience: 9, tech: 8 } },
            { id: 'b', text: 'Heat for the water during the winter.', score: { physics: 8, nature: 5 } },
            { id: 'c', text: 'A reason for people to buy more fish.', score: { business: 10, social: 6 } },
            { id: 'd', text: 'Methane gas for cooking on the farm.', score: { nature: 7, tech: 5 } }
        ],
        timeLimit: 60
    },
    // 213. Military Drill and Ceremony (Army/Navy)
    {
        id: 213,
        type: 'aptitude',
        text: "The main purpose of military 'Drill' is to:",
        options: [
            { id: 'a', text: 'Instill discipline, teamwork, and instant response.', score: { discipline: 10, lead: 10, tactical: 9, social: 8 } },
            { id: 'b', text: 'Make sure everyone has the same height.', score: { spatial: 5, logic: 1 } },
            { id: 'c', text: 'Provide a workout for the soldiers.', score: { physical: 10, discipline: 7 } },
            { id: 'd', text: 'Teach soldiers how to use a real drill.', score: { tech: 2, logic: 1 } }
        ],
        timeLimit: 45
    },
    // 214. Tactical Communication (Army/Navy)
    {
        id: 214,
        type: 'aptitude',
        text: "Effective tactical communication must be:",
        options: [
            { id: 'a', text: 'Clear, concise, and highly disciplined.', score: { lead: 10, tactical: 10, discipline: 10, psychology: 8 } },
            { id: 'b', text: 'Extremely long and detailed for clarity.', score: { logic: 4, tactical: 2 } },
            { id: 'c', text: 'Only between the highest-ranking officers.', score: { lead: 6, tactical: 3 } },
            { id: 'd', text: 'Done using only hand signals.', score: { tactical: 8, spatial: 6 } }
        ],
        timeLimit: 30
    },
    // 215. Visual Merchandising (Fashion)
    {
        id: 215,
        type: 'creative',
        text: "Visual merchandising uses window displays to:",
        options: [
            { id: 'a', text: 'Tell a brand story and entice customers inside.', score: { aesthetics: 10, creative: 10, business: 9, psychology: 9 } },
            { id: 'b', text: 'Block the sun from damaging the clothes.', score: { nature: 5, business: 3 } },
            { id: 'c', text: 'Show every single item the store has in stock.', score: { logic: 4, business: 5 } },
            { id: 'd', text: 'Provide a place for local artists to paint.', score: { social: 10, creative: 7 } }
        ],
        timeLimit: 60
    },
    // 216. Sustainable Drainage Systems (Architecture)
    {
        id: 216,
        type: 'tech',
        text: "SuDS (Sustainable Drainage Systems) mimic:",
        options: [
            { id: 'a', text: 'Natural water processes to manage rainfall.', score: { nature: 10, structural: 10, tech: 9, ethics: 8 } },
            { id: 'b', text: 'A giant underground vacuum for water.', score: { tech: 8, structural: 5 } },
            { id: 'c', text: 'The way water flows in a dishwasher.', score: { logic: 2, tech: 1 } },
            { id: 'd', text: 'The irrigation systems of ancient Egypt.', score: { social: 10, nature: 7 } }
        ],
        timeLimit: 60
    },
    // 217. Group Behavior Analysis (Psychology)
    {
        id: 217,
        type: 'aptitude',
        text: "'Groupthink' occurs when a group's desire for harmony:",
        options: [
            { id: 'a', text: 'Leads to irrational or dysfunctional decision-making.', score: { psychology: 10, logic: 10, lead: 1, social: 7 } },
            { id: 'b', text: 'Results in the most efficient meeting possible.', score: { business: 10, lead: 8 } },
            { id: 'c', text: 'Helps everyone learn a new language.', score: { creative: 8, social: 6 } },
            { id: 'd', text: 'Causes everyone to forget the agenda.', score: { patience: 4, logic: 2 } }
        ],
        timeLimit: 60
    },
    // 218. Financial Risk Modeling (Commerce)
    {
        id: 218,
        type: 'logic',
        text: "Value at Risk (VaR) measures the potential:",
        options: [
            { id: 'a', text: 'Loss in value of a portfolio over a defined period.', score: { business: 10, logic: 10, tactical: 9, tech: 8 } },
            { id: 'b', text: 'Profit a company will make next year.', score: { business: 8, lead: 5 } },
            { id: 'c', text: 'Number of customers who will buy a product.', score: { psychology: 10, business: 7 } },
            { id: 'd', text: 'Total height of a company\'s headquarters.', score: { spatial: 10, logic: 2 } }
        ],
        timeLimit: 60
    },
    // 219. Cloud Native Backup (IT Tech)
    {
        id: 219,
        type: 'tech',
        text: "Cloud-native backup solutions prioritize:",
        options: [
            { id: 'a', text: 'Scalability, durability, and automated recovery.', score: { tech: 10, structural: 10, logic: 9, business: 9 } },
            { id: 'b', text: 'Saving everything on a physical USB drive.', score: { tech: 2, tactical: 1 } },
            { id: 'c', text: 'Having a copy of the data in another city.', score: { spatial: 10, tech: 7 } },
            { id: 'd', text: 'Reducing the size of the data to zero.', score: { logic: 2, tech: 1 } }
        ],
        timeLimit: 60
    },
    // 220. SEO Meta Descriptions (IT Tech/Business)
    {
        id: 220,
        type: 'creative',
        text: "A meta description influence on SEO is primarily:",
        options: [
            { id: 'a', text: 'Improving the click-through rate from search results.', score: { business: 10, creative: 10, psychology: 9, tech: 8 } },
            { id: 'b', text: 'Directly ranking the page higher in the results.', score: { logic: 4, business: 2 } },
            { id: 'c', text: 'Replacing the need for a page title.', score: { aesthetics: 8, creative: 5 } },
            { id: 'd', text: 'Making the website load much faster.', score: { tech: 6, logic: 4 } }
        ],
        timeLimit: 60
    },
    // 221. Regenerative Wool Production (Fashion)
    {
        id: 221,
        type: 'interest',
        text: "'Regenerative' wool production focuses on:",
        options: [
            { id: 'a', text: 'Soil health and biodiversity on grazing lands.', score: { nature: 10, ethics: 10, textiles: 9, biology: 9 } },
            { id: 'b', text: 'Making the sheep grow wool five times faster.', score: { biology: 2, business: 1 } },
            { id: 'c', text: 'Using more synthetic dyes for better colors.', score: { creative: 10, nature: 2 } },
            { id: 'd', text: 'Selling the wool for the highest possible price.', score: { business: 10, logic: 5 } }
        ],
        timeLimit: 60
    },
    // 222. Historic Preservation (Architecture)
    {
        id: 222,
        type: 'aptitude',
        text: "Preserving a historic building requires:",
        options: [
            { id: 'a', text: 'Balancing modern needs with authentic restoration.', score: { structural: 10, ethics: 10, aesthetics: 9, patience: 9, spatial: 8 } },
            { id: 'b', text: 'Tearing it down and building an exact replica.', score: { logic: 2, creative: 1 } },
            { id: 'c', text: 'Painting it a bright, modern new color.', score: { creative: 8, aesthetics: 6 } },
            { id: 'd', text: 'Leaving it exactly as it is, even if it falls.', score: { patience: 10, ethics: 5 } }
        ],
        timeLimit: 60
    },
    // 223. Clinical Trial Ethics (Medical)
    {
        id: 223,
        type: 'logic',
        text: "A 'Double-Blind' study prevents bias by:",
        options: [
            { id: 'a', text: 'Ensuring neither patient nor doctor knows the treatment.', score: { medical: 10, ethics: 10, logic: 10, science: 9 } },
            { id: 'b', text: 'Having two doctors check every single patient.', score: { logic: 8, medical: 6 } },
            { id: 'c', text: 'Doing the study in a room with no windows.', score: { spatial: 8, logic: 2 } },
            { id: 'd', text: 'Asking the patient to close their eyes during pills.', score: { psychology: 4, medical: 2 } }
        ],
        timeLimit: 60
    },
    // 224. User Interface Heuristics (Innovator)
    {
        id: 224,
        type: 'aptitude',
        text: "'Visibility of System Status' means users should:",
        options: [
            { id: 'a', text: 'Always be informed about what is going on.', score: { creative: 10, tech: 10, psychology: 9, logic: 9, aesthetics: 8 } },
            { id: 'b', text: 'See all the source code of the application.', score: { tech: 4, logic: 2 } },
            { id: 'c', text: 'Wait for a notification before taking any action.', score: { patience: 10, social: 5 } },
            { id: 'd', text: 'Understand exactly how the server works.', score: { tech: 8, logic: 7 } }
        ],
        timeLimit: 60
    },
    // 225. Strategic Grand Strategy (Army/Navy/Leader)
    {
        id: 225,
        type: 'logic',
        text: "A 'Grand Strategy' coordinates all of a nation's resources to:",
        options: [
            { id: 'a', text: 'Achieve a long-term political or secure objective.', score: { lead: 10, tactical: 10, logic: 10, social: 9, business: 8 } },
            { id: 'b', text: 'Win the next battle at any cost.', score: { tactical: 8, courage: 10 } },
            { id: 'c', text: 'Make as much money as possible for the government.', score: { business: 10, lead: 6 } },
            { id: 'd', text: 'Build a giant wall around the entire country.', score: { structural: 10, tactical: 5 } }
        ],
        timeLimit: 60
    }
];

const DEFAULT_ARCHETYPES = {
    'Innovator': {
        title: 'The Visionary Innovator',
        theme: '#8b5cf6',
        desc: 'You blend creative intuition with strategic foresight. You don\'t just see what\'s next; you build it.',
        traits: ['Creative', 'Strategic', 'Analytical'],
        colleges: { iit: ['IIT Bombay', 'IIT Guwahati'], nit: ['NIT Rourkela'], regional: ['NID Ahmedabad', 'MIT Design'] },
        internships: ['UI/UX at Zomato', 'Product Design at CRED'],
        courses: ['Interaction Design', 'Figma Mastery'],
        exams: ['UCEED', 'NID DAT'],
        roadmap: [{ year: 'Year 1', task: 'Master Design Thinking', icon: 'Lightbulb' }],
        careers: [
            { title: 'UX Designer', desc: 'Design intuitive app experiences.', salary: '₹8L – ₹30L', growth: '📈 High', industry: 'Tech', skills: ['Figma', 'User Research'], color: '#8b5cf6' },
            { title: 'Innovation Lead', desc: 'Drive R&D in major tech firms.', salary: '₹20L – ₹50L', growth: '🚀 High', industry: 'Strategy', skills: ['R&D', 'Vision'], color: '#7c3aed' }
        ]
    },
    'Analyst': {
        title: 'The Logical Analyst',
        theme: '#06b6d4',
        desc: 'Precision and pattern matching are your superpowers.',
        traits: ['Logic', 'Tech', 'Precision'],
        colleges: { iit: ['IIT Madras', 'IIT Delhi'], nit: ['NIT Trichy'], regional: ['BITS Pilani', 'VIT'] },
        internships: ['Software Eng at Microsoft', 'Data Analyst at Flipkart'],
        courses: ['Algorithms', 'Full Stack Dev'],
        exams: ['JEE Advanced', 'GATE'],
        roadmap: [{ year: 'Year 1', task: 'Master Python & DSA', icon: 'Code' }],
        careers: [
            { title: 'Software Engineer', desc: 'Build scalable systems.', salary: '₹12L – ₹60L', growth: '📈 Very High', industry: 'IT', skills: ['DSA', 'React'], color: '#06b6d4' },
            { title: 'Data Scientist', desc: 'Extract insights from big data.', salary: '₹10L – ₹40L', growth: '📈 High', industry: 'FinTech', skills: ['Python', 'SQL'], color: '#0891b2' }
        ]
    },
    'Leader': {
        title: 'The Strategic Leader',
        theme: '#10b981',
        desc: 'You inspire teams and drive operational excellence.',
        traits: ['Management', 'Lead', 'Business'],
        colleges: { iit: ['IIM Ahmedabad', 'FMS Delhi'], nit: ['NITIE Mumbai'], regional: ['XLRI', 'ISB'] },
        internships: ['Operations at Amazon', 'Marketing at HUL'],
        courses: ['Strategic Leadership', 'Financial Markets'],
        exams: ['CAT', 'XAT'],
        roadmap: [{ year: 'Year 1', task: 'Business Case Studies', icon: 'Briefcase' }],
        careers: [
            { title: 'Management Consultant', desc: 'Solve corporate puzzles.', salary: '₹20L – ₹80L', growth: '📈 High', industry: 'Consulting', skills: ['Strategy', 'Excel'], color: '#10b981' },
            { title: 'Brand Manager', desc: 'Lead iconic global brands.', salary: '₹15L – ₹45L', growth: '📈 Steady', industry: 'FMCG', skills: ['Marketing', 'Ads'], color: '#059669' }
        ]
    },
    'Humanist': {
        title: 'The Social Impact Leader',
        theme: '#f43f5e',
        desc: 'You drive change through empathy and community focus.',
        traits: ['Social', 'Empathy', 'Growth'],
        colleges: { iit: ['TISS Mumbai', 'JNU Delhi'], nit: ['IIT Bombay HSS'], regional: ['St. Stephens', 'XISS'] },
        internships: ['Policy at NITI Aayog', 'Research at UN'],
        courses: ['Public Policy', 'Social Psychology'],
        exams: ['CUET', 'UPSC'],
        roadmap: [{ year: 'Year 1', task: 'Volunteer for Social Impact', icon: 'Heart' }],
        careers: [
            { title: 'Policy Analyst', desc: 'Design better laws.', salary: '₹8L – ₹30L', growth: '📈 High', industry: 'Govt', skills: ['Research', 'Writing'], color: '#f43f5e' },
            { title: 'Psychologist', desc: 'Help people heal.', salary: '₹5L – ₹25L', growth: '📈 Very High', industry: 'Healthcare', skills: ['Empathy', 'CBT'], color: '#e11d48' }
        ]
    },
    'Commerce': {
        title: 'The Financial Maestro',
        theme: '#f59e0b',
        desc: 'You navigate the world of markets, capital, and global trade with ease.',
        traits: ['Finance', 'Audit', 'Markets'],
        colleges: { iit: ['SRCC Delhi', 'St Xavier Mumbai'], nit: ['IIM Rohtak (IPM)'], regional: ['Sydenham', 'NMIMS'] },
        internships: ['Equity Research at GS', 'Audit at KPMG'],
        courses: ['Financial Literacy', 'Forex Trading'],
        exams: ['CUET', 'IPMAT'],
        roadmap: [{ year: 'Year 1', task: 'Master Tally & Excel', icon: 'Calculator' }],
        careers: [
            { title: 'Chartered Accountant', desc: 'Audit and tax strategy.', salary: '₹10L – ₹40L', growth: '📈 High', industry: 'Finance', skills: ['Audit', 'Tax'], color: '#f59e0b' },
            { title: 'Investment Banker', desc: 'Manage mergers and acquisitions.', salary: '₹15L – ₹1Cr', growth: '🚀 High', industry: 'Banking', skills: ['M&A', 'Valuation'], color: '#d97706' }
        ]
    },
    'Legal': {
        title: 'The Legal Eagle',
        theme: '#334155',
        desc: 'Justice and precision are your sharpest tools.',
        traits: ['Logic', 'Ethics', 'Analysis'],
        colleges: { iit: ['NLSIU Bangalore', 'NALSAR Hyderabad'], nit: ['WBNUJS Kolkata'], regional: ['ILS Pune', 'GLC Mumbai'] },
        internships: ['Judicial Clerkship', 'Corporate Law at AZB'],
        courses: ['Constitutional Law', 'Contract Drafting'],
        exams: ['CLAT', 'AILET'],
        roadmap: [{ year: 'Year 1', task: 'Moot Court Participation', icon: 'Scale' }],
        careers: [
            { title: 'Corporate Lawyer', desc: 'Handle business legalities.', salary: '₹12L – ₹50L', growth: '📈 High', industry: 'Legal', skills: ['Law', 'Drafting'], color: '#334155' },
            { title: 'Public Prosecutor', desc: 'Represent the state in court.', salary: '₹6L – ₹20L', growth: '📈 Steady', industry: 'Govt', skills: ['Litigation', 'Ethics'], color: '#1e293b' }
        ]
    },
    'Protector': {
        title: 'The Elite Protector',
        theme: '#166534',
        desc: 'Discipline, courage, and tactical brilliance define your path in the defense and security forces.',
        traits: ['Discipline', 'Tactical', 'Courage'],
        colleges: { iit: ['NDA Khadakwasla', 'IMA Dehradun'], nit: ['OTA Chennai'], regional: ['AFMC Pune', 'AFA Hyderabad'] },
        internships: ['NCC Training', 'Defense Research Intern'],
        courses: ['Tactical Strategy', 'Leadership & Ethics'],
        exams: ['NDA', 'CDS', 'AFCAT'],
        roadmap: [{ year: 'Year 1', task: 'Intensive Physical & Mental Training', icon: 'Shield' }],
        careers: [
            { title: 'Commissioned Officer', desc: 'Lead troops in Army/Navy/Airforce.', salary: '₹10L – ₹25L+', growth: '🚀 Very High', industry: 'Defense', skills: ['Leadership', 'Tactics'], color: '#166534' },
            { title: 'Intelligence Officer', desc: 'Coordinate national security operations.', salary: '₹8L – ₹22L', growth: '📈 High', industry: 'Security', skills: ['Analysis', 'Strategy'], color: '#14532d' }
        ]
    },
    'Naturalist': {
        title: 'The Sustainable Naturalist',
        theme: '#15803d',
        desc: 'You find harmony in nature and innovation in agriculture, driving the future of food and earth science.',
        traits: ['Sustainability', 'Patience', 'Nature'],
        colleges: { iit: ['IARI New Delhi', 'TNAU Coimbatore'], nit: ['GBPUAT Pantnagar'], regional: ['PAU Ludhiana', 'UAS Bangalore'] },
        internships: ['Organic Farm Management', 'Agri-Tech Startup'],
        courses: ['Sustainable Farming', 'Seed Technology'],
        exams: ['ICAR AIEEA', 'MCAER'],
        roadmap: [{ year: 'Year 1', task: 'Soil Science Research', icon: 'Leaf' }],
        careers: [
            { title: 'Agri-Tech Researcher', desc: 'Develop high-yield, smart farming tools.', salary: '₹7L – ₹18L', growth: '📈 Growing', industry: 'Agri-Tech', skills: ['IoT', 'Biology'], color: '#15803d' },
            { title: 'Forest Range Officer', desc: 'Protect and manage wildlife/forests.', salary: '₹6L – ₹15L', growth: '📈 Steady', industry: 'Environment', skills: ['Forestry', 'Laws'], color: '#166534' }
        ]
    },
    'Architect': {
        title: 'The Master Architect',
        theme: '#475569',
        desc: 'You bridge the gap between imagination and physical structure, designing the worlds of tomorrow.',
        traits: ['Spatial', 'Structural', 'Aesthetics'],
        colleges: { iit: ['SPA Delhi', 'IIT Kharagpur Archi'], nit: ['CEPT Ahmedabad'], regional: ['JJ School of Art', 'RV College'] },
        internships: ['Urban Design Studio', 'BIM Modeling Intern'],
        courses: ['Parametric Design', 'AutoCAD/Revit'],
        exams: ['NATA', 'JEE Paper-2'],
        roadmap: [{ year: 'Year 1', task: 'Drafting & 3D Modeling', icon: 'Home' }],
        careers: [
            { title: 'Urban Planner', desc: 'Design sustainable cities of the future.', salary: '₹10L – ₹35L', growth: '📈 High', industry: 'Construction', skills: ['City Design', 'GIS'], color: '#475569' },
            { title: 'Conservation Architect', desc: 'Restore and preserve heritage sites.', salary: '₹6L – ₹20L', growth: '📈 Steady', industry: 'Heritage', skills: ['History', 'Design'], color: '#334155' }
        ]
    },
    'Stylist': {
        title: 'The Creative Stylist',
        theme: '#db2777',
        desc: 'You understand the pulse of trends, textiles, and human expression through fashion.',
        traits: ['Trends', 'Textiles', 'Expression'],
        colleges: { iit: ['NIFT Delhi', 'NIFT Mumbai'], nit: ['Pearl Academy'], regional: ['NID Ahmedabad Fashion', 'Army Institute of Fashion'] },
        internships: ['Design Intern at Sabyasachi', 'Retail at Zara'],
        courses: ['Textile Science', 'Fashion Illustration'],
        exams: ['NIFT Entrance', 'NID DAT'],
        roadmap: [{ year: 'Year 1', task: 'Portfolio Development', icon: 'Scissors' }],
        careers: [
            { title: 'Fashion Designer', desc: 'Create original clothing and accessories.', salary: '₹8L – ₹50L+', growth: '🚀 High (Brand)', industry: 'Fashion', skills: ['Sewing', 'Sketching'], color: '#db2777' },
            { title: 'Textile Engineer', desc: 'Innovate in sustainable fabric production.', salary: '₹7L – ₹22L', growth: '📈 High', industry: 'Manufacturing', skills: ['Materials', 'Chem'], color: '#be185d' }
        ]
    },
    'Psychologist': {
        title: 'The Wellness Guide',
        theme: '#6366f1',
        desc: 'You dive deep into the human mind, helping others heal and navigate psychological complexities.',
        traits: ['Empathy', 'Psychology', 'Resilience'],
        colleges: { iit: ['TISS Mumbai', 'Christ University'], nit: ['DU (Psychology)'], regional: ['LPU', 'Amity'] },
        internships: ['Clinical Observation', 'Counseling at NGOs'],
        courses: ['Behavioral Therapy', 'Child Psychology'],
        exams: ['CUET', 'GATE (Psych)'],
        roadmap: [{ year: 'Year 1', task: 'Foundations of Human Behavior', icon: 'Brain' }],
        careers: [
            { title: 'Clinical Psychologist', desc: 'Diagnose and treat mental disorders.', salary: '₹6L – ₹30L', growth: '📈 High Demand', industry: 'Medical', skills: ['Therapy', 'Diagnosis'], color: '#6366f1' },
            { title: 'Corporate Counselor', desc: 'Enhance workplace mental well-being.', salary: '₹8L – ₹25L', growth: '📈 High', industry: 'Corporate', skills: ['Wellness', 'Coaching'], color: '#4f46e5' }
        ]
    },
    'Healthcare': {
        title: 'The Healing Professional',
        theme: '#0ea5e9',
        desc: 'Dedicated to science and the service of human well-being.',
        traits: ['Biology', 'Care', 'Health'],
        colleges: { iit: ['AIIMS Delhi', 'MAMC'], nit: ['AFMC Pune'], regional: ['KMC Manipal', 'CMC Vellore'] },
        internships: ['Clinical Rotation at Apollo', 'Research at ICMR'],
        courses: ['MBBS', 'Pharmacology'],
        exams: ['NEET UG', 'AIIMS'],
        roadmap: [{ year: 'Year 1', task: 'Excel in Anatomy & Physiology', icon: 'Stethoscope' }],
        careers: [
            { title: 'Specialist Doctor', desc: 'Save lives through medicine.', salary: '₹12L – ₹80L', growth: '📈 Steady', industry: 'Healthcare', skills: ['Diagnosis', 'Surgery'], color: '#0ea5e9' },
            { title: 'Bio-Tech Researcher', desc: 'Discover new vaccines.', salary: '₹10L – ₹50L', growth: '🚀 High', industry: 'Science', skills: ['Lab Work', 'Genetics'], color: '#38bdf8' }
        ]
    },
    'Arts': {
        title: 'The Creative Maestro',
        theme: '#d946ef',
        desc: 'You express the human condition through art, words, and performance.',
        traits: ['Visuals', 'Expression', 'Design'],
        colleges: { iit: ['FTII Pune', 'NSD Delhi'], nit: ['Faculty of Arts (DU)'], regional: ['JJ School of Art', 'Srishti'] },
        internships: ['Asst. Director at Yash Raj', 'Design at O&M'],
        courses: ['Cinematography', 'Digital Illustration'],
        exams: ['CUET', 'FTII Entrance'],
        roadmap: [{ year: 'Year 1', task: 'Build an art portfolio', icon: 'Palette' }],
        careers: [
            { title: 'Film Maker', desc: 'Tell stories through cinema.', salary: '₹5L – Unlimited', growth: '🎬 High', industry: 'Media', skills: ['Editing', 'Cinematography'], color: '#d946ef' },
            { title: 'Graphic Artist', desc: 'Create stunning visuals.', salary: '₹6L – ₹25L', growth: '📈 Steady', industry: 'Design', skills: ['Adobe', 'Procreate'], color: '#e879f9' }
        ]
    }
};

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [archetypes, setArchetypes] = useState({});
    const [students] = useState([
        { id: 1, name: 'Devashree', score: 145, archetype: 'Analyst', date: '2024-02-23' },
        { id: 2, name: 'Rahul', score: 120, archetype: 'Innovator', date: '2024-02-22' },
        { id: 3, name: 'Ananya', score: 135, archetype: 'Leader', date: '2024-02-21' }
    ]);

    // Question Form State
    const [showQModal, setShowQModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [qText, setQText] = useState('');
    const [qType, setQType] = useState('puzzle');
    const [qTime, setQTime] = useState(60);
    const [qOptions, setQOptions] = useState([
        { id: 'a', text: '', score: { logic: 0 } },
        { id: 'b', text: '', score: { logic: 0 } },
        { id: 'c', text: '', score: { logic: 0 } },
        { id: 'd', text: '', score: { logic: 0 } }
    ]);

    // Career Form State
    const [editingCareer, setEditingCareer] = useState(null);
    const [careerForm, setCareerForm] = useState({ title: '', desc: '', theme: '#000000' });

    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem('aptitude_questions')) || DEFAULT_QUESTIONS;
        const storedArchetypes = JSON.parse(localStorage.getItem('aptitude_archetypes')) || DEFAULT_ARCHETYPES;
        setQuestions(storedQuestions);
        setArchetypes(storedArchetypes);
    }, []);

    const saveQuestions = (newQuestions) => {
        setQuestions(newQuestions);
        localStorage.setItem('aptitude_questions', JSON.stringify(newQuestions));
    };

    const saveArchetypes = (newArchetypes) => {
        setArchetypes(newArchetypes);
        localStorage.setItem('aptitude_archetypes', JSON.stringify(newArchetypes));
    };

    const handleDeleteQuestion = (id) => {
        if (window.confirm('Delete this question?')) {
            saveQuestions(questions.filter(q => q.id !== id));
        }
    };

    const handleEditQuestion = (q) => {
        setEditingQuestion(q);
        setQText(q.text);
        setQType(q.type);
        setQTime(q.timeLimit || 60);
        setQOptions([...q.options]);
        setShowQModal(true);
    };

    const handleSaveQuestion = () => {
        const payload = {
            id: editingQuestion ? editingQuestion.id : Date.now(),
            type: qType,
            text: qText,
            options: qOptions,
            timeLimit: qTime
        };
        const updated = editingQuestion
            ? questions.map(q => q.id === editingQuestion.id ? payload : q)
            : [...questions, payload];
        saveQuestions(updated);
        setShowQModal(false);
        setEditingQuestion(null);
    };

    const handleSaveCareer = (id) => {
        const updated = { ...archetypes, [id]: { ...archetypes[id], ...careerForm } };
        saveArchetypes(updated);
        setEditingCareer(null);
    };

    const updateOption = (index, field, value) => {
        const newOps = [...qOptions];
        if (field === 'text') newOps[index].text = value;
        setQOptions(newOps);
    };

    const updateScore = (index, skill, val) => {
        const newOps = [...qOptions];
        newOps[index].score = { ...newOps[index].score, [skill]: parseInt(val) || 0 };
        setQOptions(newOps);
    };

    const renderDashboard = () => {
        // Build archetype distribution from students data
        const archetypeCounts = students.reduce((acc, s) => {
            acc[s.archetype] = (acc[s.archetype] || 0) + 1;
            return acc;
        }, {});
        const maxCount = Math.max(...Object.values(archetypeCounts), 1);
        const avgScore = Math.round(students.reduce((s, st) => s + st.score, 0) / (students.length || 1));
        const topStudent = students.reduce((a, b) => a.score > b.score ? a : b, students[0] || {});
        const archetypeColors = { Analyst: '#06b6d4', Innovator: '#8b5cf6', Leader: '#10b981', Humanist: '#f43f5e' };

        return (
            <div className="admin-dashboard">
                {/* Enhanced Stats Grid */}
                <div className="admin-stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0ea5e9', padding: '1rem', borderRadius: '12px' }}>
                            <Brain size={24} />
                        </div>
                        <div className="stat-info">
                            <h4>Questions</h4>
                            <p>{questions.length}</p>
                            <span className="stat-sublabel">Active in Test</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#f0fdf4', color: '#10b981', padding: '1rem', borderRadius: '12px' }}>
                            <Briefcase size={24} />
                        </div>
                        <div className="stat-info">
                            <h4>Career Profiles</h4>
                            <p>{Object.keys(archetypes).length}</p>
                            <span className="stat-sublabel">Archetypes Defined</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '12px' }}>
                            <Users size={24} />
                        </div>
                        <div className="stat-info">
                            <h4>Students</h4>
                            <p>{students.length}</p>
                            <span className="stat-sublabel">Tests Completed</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#faf5ff', color: '#a855f7', padding: '1rem', borderRadius: '12px' }}>
                            <Activity size={24} />
                        </div>
                        <div className="stat-info">
                            <h4>Avg. Score</h4>
                            <p>{avgScore} XP</p>
                            <span className="stat-sublabel">Across All Students</span>
                        </div>
                    </div>
                </div>

                <div className="admin-dash-two-col">
                    {/* Archetype Distribution Chart */}
                    <div className="admin-content-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <BarChart3 size={20} /> Archetype Distribution
                        </h3>
                        <div className="archetype-chart">
                            {Object.entries(archetypeCounts).map(([arch, count]) => (
                                <div key={arch} className="arch-bar-row">
                                    <span className="arch-bar-label">{arch}</span>
                                    <div className="arch-bar-bg">
                                        <div
                                            className="arch-bar-fill"
                                            style={{
                                                width: `${(count / maxCount) * 100}%`,
                                                background: archetypeColors[arch] || '#8b5cf6'
                                            }}
                                        />
                                    </div>
                                    <span className="arch-bar-count">{count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Top Performer */}
                        <div className="top-performer-card" style={{ marginTop: '1.5rem' }}>
                            <Award size={20} color="#f59e0b" />
                            <div>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>🏆 Top Performer</span>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                    <strong>{topStudent.name}</strong> — {topStudent.score} XP
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>({topStudent.archetype})</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="admin-content-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <TrendingUp size={20} /> Quick Actions
                        </h3>
                        <div className="admin-quick-actions">
                            <button className="admin-qa-btn" onClick={() => setActiveTab('questions')}>
                                <Brain size={20} color="#0ea5e9" />
                                <div>
                                    <strong>Add Question</strong>
                                    <p>Expand the assessment bank</p>
                                </div>
                            </button>
                            <button className="admin-qa-btn" onClick={() => setActiveTab('careers')}>
                                <Briefcase size={20} color="#10b981" />
                                <div>
                                    <strong>Edit Career Profile</strong>
                                    <p>Update archetype data & tips</p>
                                </div>
                            </button>
                            <button className="admin-qa-btn" onClick={() => setActiveTab('students')}>
                                <Users size={20} color="#a855f7" />
                                <div>
                                    <strong>View All Students</strong>
                                    <p>Browse test results & scores</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="admin-content-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} /> Latest Student Activity
                    </h3>
                    <div className="admin-table-container" style={{ marginTop: '1rem' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Archetype</th>
                                    <th>Score</th>
                                    <th>Score Bar</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s.id}>
                                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} /> {s.name}</div></td>
                                        <td><span className="badge-dna" style={{ fontSize: '0.7rem', background: `${archetypeColors[s.archetype]}20`, color: archetypeColors[s.archetype] || '#8b5cf6', border: `1px solid ${archetypeColors[s.archetype] || '#8b5cf6'}40` }}>{s.archetype}</span></td>
                                        <td><strong>{s.score} XP</strong></td>
                                        <td>
                                            <div style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(100, s.score / 2)}%`, height: '100%', background: archetypeColors[s.archetype] || '#8b5cf6', borderRadius: '3px' }} />
                                            </div>
                                        </td>
                                        <td style={{ color: '#94a3b8' }}>{s.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };


    const renderQuestionManager = () => (
        <div className="admin-content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Assessment Questions</h3>
                <button className="btn-primary-v2 btn-sm" onClick={() => { setEditingQuestion(null); setShowQModal(true); }}>
                    <Plus size={16} /> Add New
                </button>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Content</th>
                            <th>Timer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map(q => (
                            <tr key={q.id}>
                                <td><span className="badge-type">{q.type.toUpperCase()}</span></td>
                                <td style={{ minWidth: '300px' }}>{q.text}</td>
                                <td>{q.timeLimit}s</td>
                                <td className="action-btn-group">
                                    <button className="btn-icon btn-sm btn-edit" onClick={() => handleEditQuestion(q)}><Edit size={14} /></button>
                                    <button className="btn-icon btn-sm btn-delete" onClick={() => handleDeleteQuestion(q.id)}><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCareerManager = () => (
        <div className="career-manager-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {Object.entries(archetypes).map(([id, data]) => (
                <div key={id} className="admin-content-card career-edit-card">
                    {editingCareer === id ? (
                        <div className="career-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input value={careerForm.title} onChange={e => setCareerForm({ ...careerForm, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Theme Color</label>
                                <input type="color" value={careerForm.theme} onChange={e => setCareerForm({ ...careerForm, theme: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows={3} value={careerForm.desc} onChange={e => setCareerForm({ ...careerForm, desc: e.target.value })} />
                            </div>
                            <div className="action-btn-group">
                                <button className="btn-primary-v2 btn-sm" onClick={() => handleSaveCareer(id)}><Save size={14} /> Save</button>
                                <button className="btn-icon btn-sm" onClick={() => setEditingCareer(null)}><X size={14} /></button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ color: data.theme }}>{data.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{data.desc}</p>
                                </div>
                                <button className="btn-icon btn-sm" onClick={() => {
                                    setEditingCareer(id);
                                    setCareerForm({ title: data.title, desc: data.desc, theme: data.theme });
                                }}><Edit size={14} /></button>
                            </div>
                            <div className="trait-pills" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                {data.traits.map(t => <span key={t} className="pill" style={{ background: '#f1f5f9', fontSize: '0.7rem' }}>{t}</span>)}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h2><Database size={24} /> Admin Hub</h2>
                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>
                        <Brain size={18} /> Questions
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => setActiveTab('careers')}>
                        <Briefcase size={18} /> Careers
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
                        <Users size={18} /> Students
                    </button>
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/" className="admin-nav-item" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <ArrowLeft size={18} /> Return to Site
                    </Link>
                    <button
                        className="admin-nav-item admin-logout-btn"
                        onClick={() => {
                            localStorage.removeItem('admin_authenticated');
                            navigate('/admin-login');
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-path"><LayoutDashboard size={16} /> / {activeTab}</div>
                    <div className="admin-user">
                        <div className="user-avatar" style={{ background: 'var(--color-primary)' }}>A</div>
                        <span>Administrator</span>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'questions' && renderQuestionManager()}
                        {activeTab === 'careers' && renderCareerManager()}
                        {(activeTab === 'students') && (
                            <div className="admin-content-card" style={{ textAlign: 'center', padding: '5rem' }}>
                                <Users size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                <h3>Student Database</h3>
                                <p>Detailed records are currently being indexed for the next update.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {showQModal && (
                <div className="modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '800px' }}>
                        <h3>{editingQuestion ? 'Edit' : 'New'} Assessment Question</h3>
                        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                            <div className="form-main">
                                <div className="form-group">
                                    <label>Question Text</label>
                                    <textarea rows={4} value={qText} onChange={e => setQText(e.target.value)} placeholder="What is the challenge...?" />
                                </div>
                                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Type</label>
                                        <select value={qType} onChange={e => setQType(e.target.value)}>
                                            <option value="puzzle">Logic Puzzle</option>
                                            <option value="personality">Personality</option>
                                            <option value="scenario">Scenario</option>
                                            <option value="image">Visual Challenge</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Timer (seconds)</label>
                                        <input type="number" value={qTime} onChange={e => setQTime(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-options">
                                <label style={{ fontWeight: 800, marginBottom: '1rem', display: 'block' }}>Options & Scoring</label>
                                {qOptions.map((opt, idx) => (
                                    <div key={idx} className="option-row" style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 900 }}>{opt.id.toUpperCase()}</span>
                                            <input style={{ flex: 1 }} value={opt.text} onChange={e => updateOption(idx, 'text', e.target.value)} placeholder="Option text..." />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {['logic', 'tech', 'creative', 'lead', 'business', 'social'].map(skill => (
                                                <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                    <span style={{ fontSize: '0.6rem', textTransform: 'capitalize' }}>{skill}:</span>
                                                    <input type="number" style={{ width: '40px', padding: '2px', fontSize: '0.7rem' }} value={opt.score[skill] || 0} onChange={e => updateScore(idx, skill, e.target.value)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn-icon" onClick={() => setShowQModal(false)}>Cancel</button>
                            <button className="btn-primary-v2" onClick={handleSaveQuestion}><Save size={18} /> Save Assessment Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;

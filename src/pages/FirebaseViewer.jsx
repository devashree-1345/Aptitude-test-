import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserCircle, Award, TrendingUp, Calendar, Mail, Database, Users, FileText, ChevronDown, ChevronRight, Target, Star } from 'lucide-react';
import './FirebaseViewer.css';

const FirebaseViewer = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedUser, setExpandedUser] = useState(null);
    const [stats, setStats] = useState({ totalUsers: 0, totalTests: 0, topArchetype: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const usersCollection = collection(db, 'users');
            const snapshot = await getDocs(usersCollection);
            
            const usersData = [];
            let archetypeCount = {};
            let totalTests = 0;

            snapshot.forEach((doc) => {
                const data = doc.data();
                usersData.push({
                    id: doc.id,
                    ...data
                });

                // Count archetypes
                if (data.careerProfile && data.careerProfile.archetype) {
                    const archetype = data.careerProfile.archetype;
                    archetypeCount[archetype] = (archetypeCount[archetype] || 0) + 1;
                }

                // Count tests
                if (data.testResults && data.testResults.length > 0) {
                    totalTests += data.testResults.length;
                }
            });

            // Find top archetype
            const topArchetype = Object.entries(archetypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

            setUsers(usersData);
            setStats({
                totalUsers: usersData.length,
                totalTests: totalTests,
                topArchetype: topArchetype
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load database. Make sure Firebase is configured and you have data.');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    if (loading) {
        return (
            <div className="firebase-viewer-loading">
                <Database size={48} className="spin" />
                <h2>Loading Database...</h2>
                <p>Connecting to Firestore</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="firebase-viewer-error">
                <h1>⚠️ Database Error</h1>
                <p>{error}</p>
                <button onClick={fetchAllUsers} className="retry-btn">🔄 Try Again</button>
            </div>
        );
    }

    return (
        <div className="firebase-viewer">
            <header className="viewer-header">
                <div className="header-content">
                    <Database size={32} color="#7c3aed" />
                    <h1>FuturePath Database Viewer</h1>
                </div>
                <p className="header-subtitle">Real-time Firestore Database Overview</p>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#7c3aed20' }}>
                        <Users size={24} color="#7c3aed" />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#06b6d420' }}>
                        <FileText size={24} color="#06b6d4" />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalTests}</h3>
                        <p>Tests Completed</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f59e0b20' }}>
                        <Award size={24} color="#f59e0b" />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.topArchetype}</h3>
                        <p>Top Archetype</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="database-section">
                <h2 className="section-title">
                    <Users size={20} />
                    All Users ({users.length})
                </h2>

                {users.length === 0 ? (
                    <div className="empty-state">
                        <Database size={48} />
                        <h3>No Users Found</h3>
                        <p>Start by creating user accounts through the login page</p>
                    </div>
                ) : (
                    <div className="users-list">
                        {users.map((user, index) => (
                            <div key={user.id} className="user-card">
                                <div className="user-card-header" onClick={() => toggleExpand(user.id)}>
                                    <div className="user-basic-info">
                                        <div className="user-number">#{index + 1}</div>
                                        <UserCircle size={32} color={user.careerProfile?.theme || '#7c3aed'} />
                                        <div className="user-details">
                                            <h3>{user.name || 'Anonymous'}</h3>
                                            <div className="user-meta">
                                                <span className="email"><Mail size={12} /> {user.email}</span>
                                                {user.createdAt && (
                                                    <span className="joined">
                                                        <Calendar size={12} /> 
                                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="expand-indicator">
                                        {expandedUser === user.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>

                                {expandedUser === user.id && (
                                    <div className="user-card-content">
                                        {/* Career Profile */}
                                        {user.careerProfile && (
                                            <div className="profile-section">
                                                <h4><Target size={16} /> Career Profile</h4>
                                                <div className="profile-details">
                                                    <div className="archetype-badge" style={{ borderColor: user.careerProfile.theme }}>
                                                        <Award size={16} color={user.careerProfile.theme} />
                                                        {user.careerProfile.title || user.careerProfile.archetype}
                                                    </div>
                                                    {user.careerProfile.traits && (
                                                        <div className="traits-list">
                                                            {user.careerProfile.traits.map((trait, i) => (
                                                                <span key={i} className="trait-tag">{trait}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Test Results */}
                                        {user.testResults && user.testResults.length > 0 && (
                                            <div className="test-results-section">
                                                <h4><FileText size={16} /> Test History ({user.testResults.length})</h4>
                                                <div className="test-timeline">
                                                    {user.testResults.map((test, idx) => (
                                                        <div key={idx} className="test-entry">
                                                            <div className="test-date">
                                                                <Calendar size={14} />
                                                                {new Date(test.date).toLocaleString()}
                                                            </div>
                                                            <div className="test-details">
                                                                {test.careerProfile && (
                                                                    <div className="test-profile">
                                                                        <Star size={14} color="#f59e0b" />
                                                                        <span>Archetype: {test.careerProfile.archetype}</span>
                                                                    </div>
                                                                )}
                                                                <div className="test-xp">
                                                                    <TrendingUp size={14} color="#10b981" />
                                                                    <span>XP: {test.xp || 0}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Raw Data */}
                                        <div className="raw-data-section">
                                            <h4>Document ID: <code>{user.id}</code></h4>
                                            <details>
                                                <summary>View Raw JSON Data</summary>
                                                <pre className="json-preview">
                                                    {JSON.stringify(user, null, 2)}
                                                </pre>
                                            </details>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="viewer-footer">
                <p>Data loaded from Firestore Database • Collection: users</p>
                <button onClick={fetchAllUsers} className="refresh-btn">
                    🔄 Refresh Data
                </button>
            </div>
        </div>
    );
};

export default FirebaseViewer;

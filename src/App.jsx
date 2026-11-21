import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Test from './pages/Test';
import Results from './pages/Results';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import FirebaseViewer from './pages/FirebaseViewer';
import './index.css';
import './App.css';

// Protected Route — redirects to /admin-login if not authenticated
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

// User Protected Route — redirects to /login if not authenticated
const UserProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent({ theme, toggleTheme, userAuthenticated, userName, login, logout }) {
  const location = useLocation();
  const isFullScreenPage = ['/results', '/test', '/admin', '/admin-login'].includes(location.pathname);

  return (
    <div className={`app-container ${theme}-mode`}>
      {!isFullScreenPage && (
        <Navbar
          toggleTheme={toggleTheme}
          theme={theme}
          isAuthenticated={userAuthenticated}
          userName={userName}
          logout={logout}
        />
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home isAuthenticated={userAuthenticated} />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route
            path="/test"
            element={
              <UserProtectedRoute isAuthenticated={userAuthenticated}>
                <Test />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <UserProtectedRoute isAuthenticated={userAuthenticated}>
                <Results />
              </UserProtectedRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/firebase-viewer" element={<FirebaseViewer />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isFullScreenPage && <Footer />}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // Firebase authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || user.email.split('@')[0]);
        } else {
          setUserName(user.email.split('@')[0]);
        }
        setUserAuthenticated(true);
      } else {
        // User is signed out
        setUserAuthenticated(false);
        setUserName('');
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    // App loaded successfully
    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserAuthenticated(localStorage.getItem('user_authenticated') === 'true');
      setUserName(localStorage.getItem('user_name') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = (name = 'Devashree') => {
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_name', name);
    setUserAuthenticated(true);
    setUserName(name);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '24px',
        background: '#f8f7ff',
        color: '#0f0a2e'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <AppContent
        theme={theme}
        toggleTheme={toggleTheme}
        userAuthenticated={userAuthenticated}
        userName={userName}
        login={login}
        logout={logout}
      />
    </Router>
  );
}

export default App;

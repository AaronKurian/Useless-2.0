import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactForm from './pages/ContactForm';
import ContactDetails from './pages/ContactDetails';
import LoadingSpinner from './components/LoadingSpinner';

// Layout component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {children}
    </div>
  );
};

// App Routes
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/contacts" element={
        <ProtectedRoute>
          <Layout>
            <Contacts />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/contacts/new" element={
        <ProtectedRoute>
          <Layout>
            <ContactForm />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/contacts/:id" element={
        <ProtectedRoute>
          <Layout>
            <ContactDetails />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/contacts/:id/edit" element={
        <ProtectedRoute>
          <Layout>
            <ContactForm />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

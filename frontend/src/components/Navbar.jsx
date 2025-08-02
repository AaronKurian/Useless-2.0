import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Phone } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Phone className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">MyContact</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                to="/contacts" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Contacts
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5" />
              <span className="hidden sm:block">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-black hover:bg-black/30 text-red-500/80 hover:text-red-500 border border-red-600/30 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

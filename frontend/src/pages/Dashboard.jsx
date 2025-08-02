import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contactsAPI } from '../services/api';
import { Users, Plus, Phone, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactsAPI.getContacts();
      setContacts(response.data);
      setStats({
        total: response.data.length,
        recent: response.data.filter(contact => {
          const createdAt = new Date(contact.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdAt >= weekAgo;
        }).length,
      });
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-24 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-300">
            Here's an overview of your contacts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Contacts</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Added This Week</p>
                <p className="text-2xl font-bold text-white">{stats.recent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Phone className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Quick Actions</p>
                <Link
                  to="/contacts/new"
                  className="inline-flex items-center mt-1 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Contacts</h2>
            <Link
              to="/contacts"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-gray-300 mt-2">Loading contacts...</p>
            </div>
          ) : recentContacts.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {recentContacts.map((contact) => (
                <Link
                  key={contact._id}
                  to={`/contacts/${contact._id}`}
                  className="flex items-center p-3 md:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="hidden md:block p-1 md:p-2 bg-blue-500/20 rounded-full">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  </div>
                  <div className="ml-0 md:ml-4 flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{contact.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                      <div className="flex items-center text-gray-400 text-sm min-w-0">
                        <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm min-w-0">
                        <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">No contacts yet</p>
              <Link
                to="/contacts/new"
                className="inline-flex items-center px-4 py-2 bg-blue-300/10 hover:bg-blue-300/20 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Contact
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

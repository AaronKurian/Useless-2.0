import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactsAPI } from '../services/api';
import { Plus, Search, Users, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteContactId, setDeleteContactId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactsAPI.getContacts();
      setContacts(response.data);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await contactsAPI.deleteContact(id);
      setContacts(contacts.filter(contact => contact._id !== id));
      toast.success('Contact deleted successfully');
      setDeleteContactId(null);
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Contacts</h1>
            <p className="text-gray-300">Manage your contact list</p>
          </div>
        </div>

        {/* Search Bar and Add Button */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 z-10" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent"
              placeholder="Search contacts..."
            />
          </div>
          <Link
            to="/contacts/new"
            className="inline-flex items-center justify-center px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg duration-200 shadow-lg hover-scale-105 hover:bg-white/20 transition-all sm:w-auto w-12 h-12 sm:h-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Contact</span>
          </Link>
        </div>

        {/* Contacts Grid */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading contacts...</p>
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200 group"
                >
                  {/* Contact Avatar */}
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-950 to-black rounded-full">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Added on {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Phone className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <Link
                      to={`/contacts/${contact._id}`}
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm">View</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/contacts/${contact._id}/edit`}
                        className="flex items-center text-green-400/80 hover:text-green-400 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="text-sm">Edit</span>
                      </Link>
                      <button
                        onClick={() => setDeleteContactId(contact._id)}
                        className="flex items-center text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No contacts found' : 'No contacts yet'}
              </h3>
              <p className="text-gray-300 mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first contact!'
                }
              </p>
              {!searchTerm && (
                <Link
                  to="/contacts/new"
                  className="inline-flex items-center px-6 py-3 bg-blue-300/10 hover:bg-blue-300/20 text-white rounded-lg transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Contact
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteContactId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Contact</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteContactId(null)}
                className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-600 text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteContactId)}
                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;

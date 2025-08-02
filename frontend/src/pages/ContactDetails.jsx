import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { contactsAPI } from '../services/api';
import { ArrowLeft, Mail, Phone, Calendar, Edit, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      const response = await contactsAPI.getContact(id);
      setContact(response.data);
    } catch (error) {
      toast.error('Failed to fetch contact');
      navigate('/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await contactsAPI.deleteContact(id);
      toast.success('Contact deleted successfully');
      navigate('/contacts');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading contact...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Contact not found</p>
          <Link
            to="/contacts"
            className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/contacts')}
            className="flex items-center text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Details</h1>
          <p className="text-gray-300">View and manage contact information</p>
        </div>

        {/* Contact Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Contact Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="p-4 bg-gradient-to-br from-blue-950 to-black rounded-full">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
                <p className="text-gray-400">Contact Information</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link
                to={`/contacts/${contact._id}/edit`}
                className="flex items-center px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-200 border border-blue-500/40"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 border border-red-500/40"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-full">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-white font-medium">{contact.name}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-full">
                    <Mail className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Email Address</p>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-white font-medium hover:text-blue-300 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-full">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-white font-medium hover:text-blue-300 transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Joining Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-full">
                    <Calendar className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Date Added</p>
                    <p className="text-white font-medium">
                      {new Date(contact.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-500/20 rounded-full">
                    <Calendar className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-white font-medium">
                      {new Date(contact.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-300 hover:text-green-200 rounded-lg transition-all duration-200 border border-green-500/40"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-200 border border-blue-500/40"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Contact</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{contact.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
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

export default ContactDetails;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { User, Calendar, Clock, Settings, Mail, Key, LogOut, Check, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { userBookings } = useBooking();
  const [activeTab, setActiveTab] = useState('profile');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  // Dummy profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    notifications: true,
    theme: 'light',
  });

  // Initialize profile data with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        ...profileData,
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, navigate]);

  // Update profile handler
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate profile update
    setTimeout(() => {
      setUpdateSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Tab animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Make sure user is authenticated before rendering content
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-neutral-600">
            Manage your account settings and view your bookings
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-primary-400 to-primary-600">
            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full bg-neutral-100 flex items-center justify-center">
                  <User className="h-12 w-12 text-neutral-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-6 border-b border-neutral-200">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-neutral-600">{user.email}</p>
            {user.isAdmin && (
              <span className="inline-block mt-2 px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded">
                Admin
              </span>
            )}
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-neutral-200">
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === 'profile'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === 'bookings'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === 'settings'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                
                {updateSuccess && (
                  <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg flex items-center">
                    <Check className="h-5 w-5 text-success-500 mr-2" />
                    <span className="text-success-700">Profile updated successfully!</span>
                  </div>
                )}
                
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Update Profile
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h4 className="font-medium mb-3">Account Information</h4>
                  <p className="text-sm text-neutral-600 mb-1">
                    <span className="font-medium">Account created:</span> January 1, 2023
                  </p>
                  <p className="text-sm text-neutral-600 mb-1">
                    <span className="font-medium">Last login:</span> Today
                  </p>
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">Total bookings:</span> {userBookings.length}
                  </p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
                
                {userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="p-4 border border-neutral-200 rounded-lg hover:border-primary-200 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-primary-500 mr-3" />
                            <div>
                              <p className="font-medium">{booking.time}</p>
                              <p className="text-sm text-neutral-600">
                                Status: <span className="text-success-600 font-medium">Confirmed</span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="inline-block px-3 py-1 bg-success-100 text-success-800 text-xs font-medium rounded-full">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
                    <Calendar className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium mb-1">No bookings yet</h4>
                    <p className="text-neutral-600 mb-4">You haven't made any bookings yet.</p>
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="btn btn-primary"
                    >
                      Book a Session
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <h4 className="font-medium mb-4 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-primary-500" />
                      Notification Settings
                    </h4>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-neutral-600">Receive booking confirmations and reminders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={profileData.notifications}
                          onChange={() => setProfileData({ ...profileData, notifications: !profileData.notifications })}
                        />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Password Change */}
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <h4 className="font-medium mb-4 flex items-center">
                      <Key className="h-4 w-4 mr-2 text-primary-500" />
                      Password Settings
                    </h4>
                    
                    <button className="btn btn-outline btn-sm">
                      Change Password
                    </button>
                  </div>
                  
                  {/* Theme Settings */}
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <h4 className="font-medium mb-4">Theme Settings</h4>
                    
                    <div className="flex space-x-4">
                      <label className="flex flex-col items-center">
                        <input 
                          type="radio" 
                          name="theme" 
                          value="light" 
                          checked={profileData.theme === 'light'}
                          onChange={() => setProfileData({ ...profileData, theme: 'light' })}
                          className="sr-only"
                        />
                        <div className={`w-16 h-16 rounded-lg border-2 mb-2 bg-white ${
                          profileData.theme === 'light' ? 'border-primary-500' : 'border-neutral-200'
                        }`}></div>
                        <span className="text-sm">Light</span>
                      </label>
                      
                      <label className="flex flex-col items-center">
                        <input 
                          type="radio" 
                          name="theme" 
                          value="dark" 
                          checked={profileData.theme === 'dark'}
                          onChange={() => setProfileData({ ...profileData, theme: 'dark' })}
                          className="sr-only"
                        />
                        <div className={`w-16 h-16 rounded-lg border-2 mb-2 bg-neutral-800 ${
                          profileData.theme === 'dark' ? 'border-primary-500' : 'border-neutral-200'
                        }`}></div>
                        <span className="text-sm">Dark</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Danger Zone */}
                  <div className="p-4 border border-error-200 rounded-lg bg-error-50">
                    <h4 className="font-medium mb-4 text-error-700">Danger Zone</h4>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-error-700">Log out of all devices</p>
                        <p className="text-sm text-error-600">This will log you out from all devices except this one</p>
                      </div>
                      <button className="btn bg-white text-error-600 border border-error-200 hover:bg-error-50 btn-sm">
                        Log Out All
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-error-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-error-700">Delete Account</p>
                        <p className="text-sm text-error-600">This will permanently delete your account and all data</p>
                      </div>
                      <button className="btn bg-error-600 text-white hover:bg-error-700 btn-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <div className="flex justify-end">
                    <button 
                      onClick={handleLogout}
                      className="btn btn-outline text-error-600 border-error-300 hover:bg-error-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
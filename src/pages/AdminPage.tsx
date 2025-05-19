import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Calendar, Clock, User, Filter, Search, Check, Trash, Loader, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeSlotGrid from '../components/TimeSlotGrid';

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { slots, cancelBooking, refreshSlots, isLoading } = useBooking();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/admin' } } });
    } else if (user && !user.isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, user]);

  // Refresh slots on mount
  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  // Filter slots based on status and search query
  const filteredSlots = slots.filter(slot => {
    // Apply status filter
    if (filter === 'booked' && slot.status !== 'booked') return false;
    if (filter === 'available' && slot.status !== 'available') return false;
    
    // Apply search filter (if search query exists)
    if (searchQuery && slot.bookedByName) {
      return slot.bookedByName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  // Handle booking cancellation
  const handleCancelBooking = async (slotId: string) => {
    try {
      await cancelBooking(slotId);
      setCancelSuccess(true);
      setCancelError(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setCancelSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setCancelError(err.message);
      } else {
        setCancelError('An unknown error occurred');
      }
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setCancelError(null);
      }, 3000);
    }
  };

  // Reset all bookings
  const resetAllBookings = () => {
    // In a real app, this would call an API endpoint
    // For our MVP, we'll simulate by saving to localStorage
    
    const resetSlots = slots.map(slot => ({
      ...slot,
      status: 'available',
      bookedBy: undefined,
      bookedByName: undefined,
    }));
    
    localStorage.setItem('bookingSlots', JSON.stringify(resetSlots));
    refreshSlots();
    setResetConfirmOpen(false);
    
    // Show success message
    setCancelSuccess(true);
    setTimeout(() => {
      setCancelSuccess(false);
    }, 3000);
  };

  // Make sure user is authenticated and admin before rendering content
  if (!isAuthenticated || !user || !user.isAdmin) {
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
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">
            Manage all bookings and time slots in one place
          </p>
        </div>
        
        {/* Notification Area */}
        <AnimatePresence>
          {cancelSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center"
            >
              <Check className="h-5 w-5 text-success-500 mr-3" />
              <span className="text-success-700">Operation completed successfully!</span>
            </motion.div>
          )}
          
          {cancelError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center"
            >
              <AlertTriangle className="h-5 w-5 text-error-500 mr-3" />
              <span className="text-error-700">{cancelError}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slot Overview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                  Time Slots Overview
                </h2>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className="input-field pl-10 py-1 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="input-field py-1 pl-8 pr-4 text-sm appearance-none"
                    >
                      <option value="all">All Slots</option>
                      <option value="booked">Booked Only</option>
                      <option value="available">Available Only</option>
                    </select>
                    <Filter className="h-4 w-4 text-neutral-500 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  </div>
                  
                  <button
                    onClick={refreshSlots}
                    className="text-primary-500 hover:text-primary-600 py-1 px-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Booking Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary-600 font-medium">Total Slots</p>
                      <p className="text-2xl font-bold">{slots.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-primary-400" />
                  </div>
                </div>
                
                <div className="bg-success-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-success-600 font-medium">Available</p>
                      <p className="text-2xl font-bold">
                        {slots.filter(slot => slot.status === 'available').length}
                      </p>
                    </div>
                    <Check className="h-8 w-8 text-success-400" />
                  </div>
                </div>
                
                <div className="bg-error-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-error-600 font-medium">Booked</p>
                      <p className="text-2xl font-bold">
                        {slots.filter(slot => slot.status === 'booked').length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-error-400" />
                  </div>
                </div>
              </div>
              
              {/* Bookings Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Booked By
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredSlots.length > 0 ? (
                      filteredSlots.map((slot) => (
                        <tr key={slot.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            {slot.time}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              slot.status === 'available'
                                ? 'bg-success-100 text-success-800'
                                : 'bg-error-100 text-error-800'
                            }`}>
                              {slot.status === 'available' ? 'Available' : 'Booked'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {slot.bookedByName || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            {slot.status === 'booked' && (
                              <button
                                onClick={() => handleCancelBooking(slot.id)}
                                className="text-error-600 hover:text-error-800"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Admin Panel Section */}
          <div className="space-y-8">
            {/* Admin Actions */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-500" />
                Admin Actions
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h4 className="font-medium mb-2">Quick View</h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    View all time slots at a glance
                  </p>
                  <TimeSlotGrid compact={true} />
                </div>
                
                <div className="p-4 border border-error-200 rounded-lg bg-error-50">
                  <h4 className="font-medium mb-2 text-error-700">Danger Zone</h4>
                  <p className="text-sm text-error-600 mb-3">
                    These actions cannot be undone
                  </p>
                  
                  <button
                    onClick={() => setResetConfirmOpen(true)}
                    className="btn bg-error-600 text-white hover:bg-error-700 w-full"
                  >
                    Reset All Bookings
                  </button>
                </div>
              </div>
            </div>
            
            {/* System Stats */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-xl font-semibold mb-4">System Status</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <span className="text-neutral-700">Server Status</span>
                  <span className="flex items-center text-success-600">
                    <span className="h-2 w-2 bg-success-500 rounded-full mr-2"></span>
                    Operational
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <span className="text-neutral-700">Database Status</span>
                  <span className="flex items-center text-success-600">
                    <span className="h-2 w-2 bg-success-500 rounded-full mr-2"></span>
                    Operational
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <span className="text-neutral-700">Last Updated</span>
                  <span className="text-neutral-600">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Active Users</span>
                  <span className="text-neutral-600">
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen p-4">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={() => setResetConfirmOpen(false)}
              ></div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto z-10 relative"
              >
                <div className="text-center mb-4">
                  <AlertTriangle className="h-12 w-12 text-error-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Are you sure?
                  </h3>
                  <p className="text-neutral-600">
                    This will reset ALL bookings. This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setResetConfirmOpen(false)}
                    className="btn bg-white border border-neutral-300 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={resetAllBookings}
                    className="btn bg-error-600 text-white hover:bg-error-700"
                  >
                    Reset All
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
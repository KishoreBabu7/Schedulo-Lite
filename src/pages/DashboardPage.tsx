import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import TimeSlotGrid from '../components/TimeSlotGrid';
import { Calendar, User, Clock, Check, AlertCircle, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { slots, bookSlot, cancelBooking, refreshSlots, isLoading, error, userBookings } = useBooking();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
    } else if (user) {
      setName(user.name);
    }
  }, [isAuthenticated, navigate, user]);

  // Refresh slots on mount
  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  // Handle slot selection
  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    setBookingSuccess(false);
    setCancelSuccess(false);
    setBookingError(null);
  };

  // Handle slot booking
  const handleBookSlot = async () => {
    if (!selectedSlot) return;
    
    try {
      await bookSlot(selectedSlot, name);
      setBookingSuccess(true);
      setSelectedSlot(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setBookingError(err.message);
      } else {
        setBookingError('An unknown error occurred');
      }
    }
  };

  // Handle slot cancellation
  const handleCancelBooking = async (slotId: string) => {
    try {
      await cancelBooking(slotId);
      setCancelSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setCancelSuccess(false);
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setBookingError(err.message);
      } else {
        setBookingError('An unknown error occurred');
      }
    }
  };

  // Make sure user is authenticated before rendering content
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  // Get the selected slot object
  const selectedSlotData = selectedSlot ? slots.find(slot => slot.id === selectedSlot) : null;

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-neutral-600">
            Welcome back, {user?.name}! Book or manage your sessions below.
          </p>
        </div>
        
        {/* Notification Area */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center"
            >
              <Check className="h-5 w-5 text-success-500 mr-3" />
              <span className="text-success-700">Your slot has been booked successfully!</span>
            </motion.div>
          )}
          
          {cancelSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center"
            >
              <Check className="h-5 w-5 text-success-500 mr-3" />
              <span className="text-success-700">Your booking has been cancelled successfully!</span>
            </motion.div>
          )}
          
          {bookingError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center"
            >
              <AlertCircle className="h-5 w-5 text-error-500 mr-3" />
              <span className="text-error-700">{bookingError}</span>
              <button 
                onClick={() => setBookingError(null)}
                className="ml-auto text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Slots Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                  Available Time Slots
                </h2>
                <button 
                  onClick={refreshSlots}
                  className="text-primary-500 hover:text-primary-600 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh
                </button>
              </div>
              
              <TimeSlotGrid onSelect={handleSelectSlot} selectedSlot={selectedSlot || undefined} />
            </div>
          </div>
          
          {/* Booking Form & User Bookings */}
          <div className="space-y-8">
            {/* Booking Form */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary-500" />
                Book a Session
              </h3>
              
              {selectedSlotData ? (
                <div>
                  <p className="mb-4">
                    You are booking the <span className="font-semibold">{selectedSlotData.time}</span> slot.
                  </p>
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <button 
                    onClick={handleBookSlot}
                    className="btn btn-primary w-full"
                    disabled={isLoading || !name}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Booking...
                      </span>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mb-3 flex justify-center">
                    <div className="p-3 rounded-full bg-neutral-100">
                      <Calendar className="h-6 w-6 text-neutral-400" />
                    </div>
                  </div>
                  <p className="text-neutral-600 mb-2">No time slot selected</p>
                  <p className="text-sm text-neutral-500">
                    Please select an available time slot from the list to book your session.
                  </p>
                </div>
              )}
            </div>
            
            {/* User Bookings */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-500" />
                Your Bookings
              </h3>
              
              {userBookings.length > 0 ? (
                <div className="space-y-3">
                  {userBookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100">
                      <div>
                        <p className="font-medium">{booking.time}</p>
                        <p className="text-sm text-neutral-600">Booked by: {booking.bookedByName}</p>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-error-600 hover:text-error-700 text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mb-3 flex justify-center">
                    <div className="p-3 rounded-full bg-neutral-100">
                      <Calendar className="h-6 w-6 text-neutral-400" />
                    </div>
                  </div>
                  <p className="text-neutral-600 mb-2">No bookings yet</p>
                  <p className="text-sm text-neutral-500">
                    You haven't booked any sessions yet. Select an available time slot to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
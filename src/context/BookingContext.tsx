import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface TimeSlot {
  id: string;
  time: string;
  status: 'available' | 'booked';
  bookedBy?: string;
  bookedByName?: string;
}

interface BookingContextType {
  slots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  bookSlot: (slotId: string, name: string) => Promise<void>;
  cancelBooking: (slotId: string) => Promise<void>;
  refreshSlots: () => Promise<void>;
  userBookings: TimeSlot[];
}

const BookingContext = createContext<BookingContextType>({
  slots: [],
  isLoading: false,
  error: null,
  bookSlot: async () => {},
  cancelBooking: async () => {},
  refreshSlots: async () => {},
  userBookings: [],
});

export const useBooking = () => useContext(BookingContext);

const createInitialSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 10; hour <= 17; hour++) {
    const time = `${hour}:00`;
    const displayTime = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
    slots.push({
      id: hour.toString(),
      time: displayTime,
      status: 'available',
    });
  }
  return slots;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<TimeSlot[]>(createInitialSlots());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('bookingSlots', JSON.stringify(createInitialSlots()));
  }, []);

  const userBookings = user
    ? slots.filter(slot => slot.bookedBy === user.id)
    : [];

  const bookSlot = async (slotId: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('You must be logged in to book a slot');
      }

      const updatedSlots = slots.map(slot => {
        if (slot.id === slotId) {
          if (slot.status === 'booked') {
            throw new Error('This slot is already booked');
          }
          return {
            ...slot,
            status: 'booked' as const,
            bookedBy: user.id,
            bookedByName: name || user.name,
          };
        }
        return slot;
      });

      setSlots(updatedSlots);
      localStorage.setItem('bookingSlots', JSON.stringify(updatedSlots));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (slotId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('You must be logged in to cancel a booking');
      }

      const slot = slots.find(s => s.id === slotId);
      
      if (!slot) {
        throw new Error('Slot not found');
      }
      
      if (slot.status !== 'booked') {
        throw new Error('This slot is not booked');
      }
      
      if (slot.bookedBy !== user.id && !user.isAdmin) {
        throw new Error('You can only cancel your own bookings');
      }

      const updatedSlots = slots.map(slot => {
        if (slot.id === slotId) {
          return {
            ...slot,
            status: 'available' as const,
            bookedBy: undefined,
            bookedByName: undefined,
          };
        }
        return slot;
      });

      setSlots(updatedSlots);
      localStorage.setItem('bookingSlots', JSON.stringify(updatedSlots));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSlots = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedSlots = localStorage.getItem('bookingSlots');
      if (storedSlots) {
        setSlots(JSON.parse(storedSlots));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        slots,
        isLoading,
        error,
        bookSlot,
        cancelBooking,
        refreshSlots,
        userBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
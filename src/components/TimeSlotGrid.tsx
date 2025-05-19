import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeSlotGridProps {
  onSelect?: (slotId: string) => void;
  selectedSlot?: string;
  compact?: boolean;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ 
  onSelect, 
  selectedSlot,
  compact = false
}) => {
  const { slots, isLoading } = useBooking();
  const { user } = useAuth();
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const handleClick = (slotId: string) => {
    if (onSelect) {
      onSelect(slotId);
    }
  };

  const toggleExpandSlot = (slotId: string) => {
    setExpandedSlot(expandedSlot === slotId ? null : slotId);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4 mt-4`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {slots.map((slot) => {
        const isBooked = slot.status === 'booked';
        const isSelected = selectedSlot === slot.id;
        const isExpanded = expandedSlot === slot.id;
        const isUserBooking = isBooked && slot.bookedBy === user?.id;
        
        return (
          <motion.div 
            key={slot.id}
            variants={item}
            className={`time-slot group ${
              isBooked 
                ? isUserBooking 
                  ? 'border-accent-400 bg-accent-50' 
                  : 'time-slot-booked'
                : isSelected 
                  ? 'time-slot-selected' 
                  : 'time-slot-available'
            } ${compact ? 'p-2' : 'p-4'}`}
            onClick={() => {
              if (!compact && !isBooked) {
                handleClick(slot.id);
              } else if (compact) {
                toggleExpandSlot(slot.id);
              }
            }}
          >
            <div className={`flex ${compact ? 'flex-col' : 'justify-between items-center'}`}>
              <div className={`flex items-center ${compact ? 'mb-1' : ''}`}>
                <Clock className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} mr-2 ${isBooked ? 'text-error-500' : 'text-success-500'}`} />
                <span className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>{slot.time}</span>
              </div>
              
              <div className={`flex items-center ${compact ? 'text-xs' : 'text-sm'}`}>
                {isBooked ? (
                  <>
                    <X className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-error-500 mr-1`} />
                    <span>Booked{compact ? '' : ` by ${slot.bookedByName || 'Someone'}`}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-success-500 mr-1`} />
                    <span>Available</span>
                  </>
                )}
              </div>
            </div>
            
            {isExpanded && compact && (
              <div className="mt-2 pt-2 border-t border-neutral-200 text-xs">
                {isBooked ? (
                  <p>Booked by: {slot.bookedByName || 'Someone'}</p>
                ) : (
                  <button 
                    className="text-primary-500 hover:text-primary-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(slot.id);
                    }}
                  >
                    Select this slot
                  </button>
                )}
              </div>
            )}
            
            {!compact && !isBooked && (
              <div className="mt-4 pt-2 border-t border-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="w-full text-center text-primary-500 hover:text-primary-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(slot.id);
                  }}
                >
                  Select
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TimeSlotGrid;
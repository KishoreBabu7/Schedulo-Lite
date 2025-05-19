import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for time slots
let timeSlots = [];

// Initialize time slots (10 AM to 5 PM)
for (let hour = 10; hour <= 17; hour++) {
  const time = `${hour}:00`;
  const displayTime = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
  timeSlots.push({
    id: hour.toString(),
    time: displayTime,
    status: 'available',
  });
}

// API Routes
// Get all time slots
app.get('/slots', (req, res) => {
  res.json(timeSlots);
});

// Book a slot
app.post('/book', (req, res) => {
  const { name, time } = req.body;
  
  if (!name || !time) {
    return res.status(400).json({ error: 'Name and time are required' });
  }
  
  const slotIndex = timeSlots.findIndex(slot => slot.id === time);
  
  if (slotIndex === -1) {
    return res.status(404).json({ error: 'Time slot not found' });
  }
  
  if (timeSlots[slotIndex].status === 'booked') {
    return res.status(400).json({ error: 'This slot is already booked' });
  }
  
  timeSlots[slotIndex] = {
    ...timeSlots[slotIndex],
    status: 'booked',
    bookedBy: 'user-id', // In a real app, this would be the user's ID
    bookedByName: name,
  };
  
  res.json(timeSlots[slotIndex]);
});

// Cancel a booking
app.post('/cancel', (req, res) => {
  const { time } = req.body;
  
  if (!time) {
    return res.status(400).json({ error: 'Time is required' });
  }
  
  const slotIndex = timeSlots.findIndex(slot => slot.id === time);
  
  if (slotIndex === -1) {
    return res.status(404).json({ error: 'Time slot not found' });
  }
  
  if (timeSlots[slotIndex].status !== 'booked') {
    return res.status(400).json({ error: 'This slot is not booked' });
  }
  
  timeSlots[slotIndex] = {
    ...timeSlots[slotIndex],
    status: 'available',
    bookedBy: undefined,
    bookedByName: undefined,
  };
  
  res.json(timeSlots[slotIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
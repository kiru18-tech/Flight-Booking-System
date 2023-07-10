const User = require('../models/user');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verySecret = "vAEtscok9j3fwNwq";

// Admin login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    // Validate input data

    const admin = await User.findOne({ username, isAdmin: true });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    /// Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: admin._id, role:"admin"}, verySecret, { expiresIn: '1h' });

    // Return the token in the response
    res.json({ message: 'Login as admin successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

// Add a flight
// Add a flight (Admin only)
async function addFlight(req, res) {
    try {
      const { flightNumber, origin, destination, date, time } = req.body;
      // Validate input data
  
      // Verify JWT token
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Missing authentication token' });
      }
  
      jwt.verify(token, verySecret, async (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid authentication token' });
        }
        // Check if user is an admin
        const { role } = decodedToken;

        if (role !== 'admin') {
          return res.status(403).json({ message: 'Unauthorized access' });
        }
  
        // Token is valid and user is an admin, continue with adding the flight
        const availableSeats = 60;
        const newFlight = new Flight({ flightNumber, origin, destination, date, time, availableSeats });
        await newFlight.save();
  
        res.status(201).json({ message: 'Flight added successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
  
// Remove a flight (Admin only)
async function removeFlight(req, res) {
    try {
      const { flightNumber } = req.body;
  
      // Verify JWT token
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Missing authentication token' });
      }
  
      jwt.verify(token, verySecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid authentication token' });
        }
  
        // Check if user is an admin
        const { role } = decodedToken;
        if (role !== 'admin') {
          return res.status(403).json({ message: 'Unauthorized access' });
        }
  
        // Token is valid and user is an admin, continue with removing the flight
      
        Flight.findOneAndDelete({ flightNumber:flightNumber }).then(function() {
            console.log("Removed successfully!");
          }).catch(function(err) {
            console.log(err);
          });

        res.status(201).json({ message: 'Flight removed successfully'});

        
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
  

// View bookings for a flight
// View bookings based on flight number and time (Admin only)
async function viewBookings(req, res) {
  try {
    const { flightNumber, date, time } = req.query;

    // Verify JWT token
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Missing authentication token' });
    }

    jwt.verify(token, verySecret, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid authentication token' });
      }

      // Check if user is an admin
      const { role } = decodedToken;
      if (role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      debugger;
      // Token is valid and user is an admin, continue with retrieving bookings
      const dateParsed = Date.parse(date);
      const flight = await Flight.findOne({ flightNumber: flightNumber, date: dateParsed, time: time});
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      //const bookings = await Booking.find({ flightId: flight._id });
      const bookings = await Booking.find({ flight: flight }).populate([{path: 'user', select: 'username'}, {path: 'flight', select: 'flightNumber'}]);
      
      res.json({ bookings });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}
 
  

module.exports = {
  login,
  addFlight,
  removeFlight,
  viewBookings,
};

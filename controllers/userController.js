const User = require('../models/user');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const verySecret = "vAEtscok9j3fwNwq";

// User sign-up
async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    // Check if username is already taken
    const existingUsername = await User.findOne({ username }); //select * from User where username = username
    if (existingUsername) {
      return res.status(409).json({ message: 'Username is already taken' });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email }); //select * from user wherer email = email
    if (existingEmail) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password (alphanumeric and at least 6 characters long)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be alphanumeric and at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

// User login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    // Validate input data

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, verySecret, { expiresIn: '1h' });

    // Return the token in the response
    res.json({ message: 'Login successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

// Flight search
async function searchFlights(req, res) {
    try {
        const { date, time } = req.query;
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
    
          // Token is valid, continue with the flight search logic
          const flights = await Flight.find({ date:date, time:time });
          res.json(flights);
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
      }
}

// Book a flight
// Book a flight
async function bookFlight(req, res) {
    try {

      const { flightNumber, passengerName,  seatNumber } = req.body;

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
  
        // Token is valid, continue with the flight booking logic
      const { userId } = decodedToken;
      const user = await User.findById(userId);
        
        const flight = await Flight.findOne({flightNumber: flightNumber});

        if (!flight) {
          return res.status(404).json({ message: 'Flight not found' });
        }
  
        if (flight.availableSeats <= 0) {
          return res.status(400).json({ message: 'No seats available on this flight' });
        }
        if (seatNumber > 60 || seatNumber == 0) {
          return res.status(400).json({ message: `Please choose a seat between 1 and 60` });
        }
        // Check if the provided seat number is available
      if (flight.bookedSeats.includes(seatNumber)) {
        return res.status(400).json({ message: 'The seat number is already booked' });
      }

        // Check if the flight date is in the past
      const currentDate = new Date();
      if (flight.date < currentDate) {
        return res.status(400).json({ message: 'Cannot book a flight that has already departed' });
      }
      const flightId = flight._id;
        // Create a new booking and update available seats
      const newBooking = new Booking({ flight, user, passengerName, seatNumber});
      await newBooking.save();

      flight.availableSeats -= 1;
      flight.bookedSeats.push(seatNumber);
      await flight.save();
  
        res.json({ message: 'Booking successful' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
  

// Retrieve user's bookings
// Retrieve user's bookings
  async function myBookings(req, res) {
    try {
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
      const { userId } = decodedToken;

      // Token is valid, continue with retrieving user's bookings logic

       const userIdObject = new mongoose.mongo.ObjectId(userId)
        const bookings = await Booking.find( {user: userIdObject, flight: { $ne: null }}).populate( 'flight');
        res.json(bookings);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
  

// User logout
async function logout(req, res) {
    try {
      // Verify JWT token
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Missing authentication token' });
      }
  
      jwt.verify(token, verySecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid authentication token' });
        }
  
        // Token is valid, continue with the logout logic
  
        // remove from client
  
        res.json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }

module.exports = {
  signup,
  login,
  searchFlights,
  bookFlight,
  myBookings,
  logout,
};

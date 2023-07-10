const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/flights', userController.searchFlights);
router.post('/book', userController.bookFlight);
router.get('/mybookings', userController.myBookings);
router.get('/logout', userController.logout);

module.exports = router;

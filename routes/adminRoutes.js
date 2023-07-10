const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/login', adminController.login);
router.post('/flights', adminController.addFlight);
router.post('/removeFlight', adminController.removeFlight);
router.get('/bookings/', adminController.viewBookings);

module.exports = router;

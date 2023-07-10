//vAEtscok9j3fwNwq

const express= require('express');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/user');
const Flight = require('./models/flight');
const Booking = require('./models/booking');

//tYKgfzNUm8YxTnSb
const app = express();
const port = 3000;

app.use(cors({
  origin: "http://127.0.0.1:8081"
}));

app.use(bodyParser.json());

// Connect to MongoDB

const dbUri = 'mongodb+srv://admin:tYKgfzNUm8YxTnSb@flight.xwhr2b6.mongodb.net/?retryWrites=true&w=majority';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect(dbUri, options).then(
    () => { console.log('DB connected')},
    err => { throw err; }
  );

// Load Mongoose models (user, flight, booking)

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
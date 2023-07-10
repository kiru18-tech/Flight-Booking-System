//add flight
window.onload=function(){
  let adminToken = getToken('adminToken');
  if(adminToken == undefined){
      window.location.href = 'index.html';
  }
  const success = document.getElementById('success-container');
  const error = document.getElementById('error-container');
  const addFlight = document.getElementById('add-flight-form');

  function clearDiv (){
    success.textContent = '';
    error.textContent = '';
  }

  addFlight.addEventListener('submit', async (e) => {
      e.preventDefault();
    clearDiv();
      const flightNumber= document.getElementById('flightNumber').value;
      const origin= document.getElementById('origin').value;
      const destination= document.getElementById('destination').value;
      const time= document.getElementById('time').value;
      const date= document.getElementById('date').value;

     

      adminToken = getToken('adminToken');

      if(adminToken == undefined){
      error.textContent = "Please login to continue"
      return;
      }
    
      try{
        const response = await fetch('http://localhost:3000/api/admin/flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer'+" "+adminToken
          },
          body: JSON.stringify({ flightNumber, origin, destination, time, date })
        });
    
        if (response.ok) {
          const data = await response.json();
          success.textContent = data.message
        
          addFlight.reset(); // Clear form fields
        } else {
          const errorData = await response.json();
          error.textContent = errorData.message;

      }
    }
      catch(e){
        
        error.textContent = e;

      }
    
    })
// remove flight
const removeFlight = document.getElementById('remove-flight-form');
  removeFlight.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearDiv();
      const flightNumber= document.getElementById('flightNumber').value;
      adminToken = getToken('adminToken');
      if(adminToken == undefined){
        error.textContent = "Please login to continue"
        return;
        }
      try{
        const response = await fetch('http://localhost:3000/api/admin/removeFlight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer'+" "+adminToken
          },
          body: JSON.stringify({ flightNumber })
        });
    
        if (response.ok) {
          const data = await response.json();
          success.textContent = data.message
    
          removeFlight.reset(); // Clear form fields
        } else {
          const errorData = await response.json();
          error.textContent = errorData.message
      }
    }
      catch(e){
        
        error.textContent = e
      }
    
    })
    // view-bookings
    const viewBookings = document.getElementById('view-bookings-form');
  viewBookings.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearDiv();
      const flightNumber= document.getElementById('bookingFlightNumber').value;
      const date= document.getElementById('bookingDate').value;
      const time= document.getElementById('bookingTime').value;
      adminToken = getToken('adminToken');
      if(adminToken == undefined){
        error.textContent = "Please login to continue"
        return;
        }
      
      try{
        const response = await fetch(`http://localhost:3000/api/admin/bookings?flightNumber=${flightNumber}&date=${date}&time=${time}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer'+" "+adminToken
          },
          });
    
        if (response.ok) {
          const data = await response.json();
          viewBookings.reset(); // Clear form fields
          createBookingList(data.bookings);
        } else {
          const errorData = await response.json();
          error.textContent = errorData.message;

      }
    }
      catch(e){
        
        error.textContent = e;
    }
    
    })
    function createBookingList(bookings) {
      const bookingsList = document.getElementById('bookings-list');
      bookingsList.innerHTML = '';
    
      if (bookings.length === 0) {
        const noBookingsMsg = document.createElement('p');
        noBookingsMsg.textContent = 'No bookings found.';
        bookingsList.appendChild(noBookingsMsg);
        return;
      }
    
      const table = document.createElement('table');
      table.classList.add('booking-table');
    
      const tableHeader = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const headers = ['Booking ID', 'Flight Number', 'Passenger Name', 'Seat Number'];
    
      headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        header.classList.add('booking-header');
        headerRow.appendChild(header);
      });
    
      tableHeader.appendChild(headerRow);
      table.appendChild(tableHeader);
    
      const tableBody = document.createElement('tbody');
      bookings.forEach(booking => {
        const row = document.createElement('tr');
    
        const bookingIdCell = document.createElement('td');
        bookingIdCell.textContent = booking._id;
    
        const flightNumberCell = document.createElement('td');
        flightNumberCell.textContent = booking.flight.flightNumber;
    
        const passengerNameCell = document.createElement('td');
        passengerNameCell.textContent = booking.passengerName;
    
        const seatNumberCell = document.createElement('td');
        seatNumberCell.textContent = booking.seatNumber;
    
        row.appendChild(bookingIdCell);
        row.appendChild(flightNumberCell);
        row.appendChild(passengerNameCell);
        row.appendChild(seatNumberCell);
    
        tableBody.appendChild(row);
      });
    
      table.appendChild(tableBody);
      bookingsList.appendChild(table);
    }

    //log out
    const logOut = document.getElementById('logout-button');
    logOut.addEventListener('click', (e) => {
      localStorage.removeItem('adminToken');
      window.location.href = 'userLogin.html';
    })

    function getToken(key){
      return localStorage.getItem(key);
    }
    
  }

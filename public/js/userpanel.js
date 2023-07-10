// serach flight
window.onload=function(){
  let userToken = getToken('userToken');


  const success = document.getElementById('success-container');
  const error = document.getElementById('error-container');

  function clearDiv (){
    success.textContent = '';
    error.textContent = '';
  }
  if(userToken == undefined){
      window.location.href = 'userlogin.html';
  }
    const searchFlight = document.getElementById('search-flights-form');
    searchFlight.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearDiv();
        const date= document.getElementById('date').value;
        const time= document.getElementById('time').value;   
        userToken = getToken('userToken');
        if(userToken == undefined){
          error.textContent = "Please login to continue";
          return;
        }
        try{
          const response = await fetch(`http://localhost:3000/api/user/flights?date=${date}&time=${time}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json', 'Authorization' : 'Bearer'+" "+userToken
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            createFlightList(data);

          } else {
            const errorData = await response.json();
            error.textContent = errorData
        }
      }
        catch(e){
          
          error.textContent = e
        }
      
      })
      function createFlightList(flights) {
        const flightsList = document.getElementById('flights-list');
        flightsList.innerHTML = '';
      
        if (flights.length === 0) {
          const noFlightsMsg = document.createElement('p');
          noFlightsMsg.textContent = 'No flights found.';
          flightsList.appendChild(noFlightsMsg);
          return;
        }
      
        const table = document.createElement('table');
        table.classList.add('flight-table');
      
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Flight Number', 'Destination', 'Departure Time', 'Seat Count', 'Book'];
      
        headers.forEach(headerText => {
          const header = document.createElement('th');
          header.textContent = headerText;
          header.classList.add('flight-header');
          headerRow.appendChild(header);
        });
      
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);
      
        const tableBody = document.createElement('tbody');
        flights.forEach(flight => {
          const row = document.createElement('tr');
      
          const flightNumberCell = document.createElement('td');
          flightNumberCell.textContent = flight.flightNumber;
      
          const destinationCell = document.createElement('td');
          destinationCell.textContent = flight.destination;
      
          const departureTimeCell = document.createElement('td');
          departureTimeCell.textContent = flight.time;
      
          const seatCountCell = document.createElement('td');
          seatCountCell.textContent = flight.availableSeats;
      
          const bookButtonCell = document.createElement('td');
          const bookButton = document.createElement('button');
          bookButton.textContent = 'Book';
          bookButton.addEventListener('click', () => {
            //bookFlight(flight.flightId); // Function to handle booking a flight
          });
          bookButtonCell.appendChild(bookButton);
      
          row.appendChild(flightNumberCell);
          row.appendChild(destinationCell);
          row.appendChild(departureTimeCell);
          row.appendChild(seatCountCell);
          row.appendChild(bookButtonCell);
      
          tableBody.appendChild(row);
        });
      
        table.appendChild(tableBody);
        flightsList.appendChild(table);
      }
      // bookflight
      const bookFlight = document.getElementById('book-flight-form');
      bookFlight.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearDiv();
      const flightNumber= document.getElementById('flightNumber').value;
      const passengerName= document.getElementById('passengerName').value;
      const seatNumber= document.getElementById('seatNumber').value;
      userToken = getToken('userToken');
        if(userToken == undefined){
          error.textContent = "Please login to continue";
          return;
        }
    
      try{
        const response = await fetch('http://localhost:3000/api/user/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer'+" "+userToken
          },
          body: JSON.stringify({ flightNumber, passengerName, seatNumber })
        });
    
        if (response.ok) {
          const data = await response.json();
         success.textContent = data.message
        
          bookFlight.reset();
        }
        else {
          const errorData = await response.json();
          error.textContent = errorData.message;
      }
    }
      catch(e){
        
        error.textContent = e;

      }
    
    })

    // mybookings
    const mybookings = document.getElementById('myBookings');
      mybookings.addEventListener('click', async (e) => {
        e.preventDefault();
        clearDiv();
        userToken = getToken('userToken');
        if(userToken == undefined){
          error.textContent = "Please login to continue";
          return;
        }
         
        try{
          const response = await fetch(`http://localhost:3000/api/user/mybookings`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json', 'Authorization' : 'Bearer'+" "+userToken
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            searchFlight.reset(); // Clear form fields
            createMyBookingsList(data);

          } else {
            const errorData = await response.json();
            error.textContent = errorData.message;
        }
      }
        catch(e){
          
          error.textContent = e;

        }
  
      })
      function createMyBookingsList(bookings) {
        const bookingsList = document.getElementById('bookings-list');
        bookingsList.innerHTML = '';
      
        if (bookings.length === 0) {
          const noBookingsMsg = document.createElement('p');
          noBookingsMsg.textContent = 'No bookings found.';
          bookingsList.appendChild(noBookingsMsg);
          return;
        }

        const table = document.createElement('table');
        table.classList.add('mybookings-table');
      
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Passenger Name', 'Flight Number','Origin', 'Destination', 'Departure Time', 'Seat Number' ];
      
        headers.forEach(headerText => {
          const header = document.createElement('th');
          header.textContent = headerText;
          header.classList.add('mybookings-header');
          headerRow.appendChild(header);
        });  
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        const tableBody = document.createElement('tbody');
        bookings.forEach(booking => {

          if(booking.flight == null){
            return;
          }
          const row = document.createElement('tr');
      
          const passengerName = document.createElement('td');
          passengerName.textContent = booking.passengerName;
      
          const flightNumber = document.createElement('td');
          flightNumber.textContent = booking.flight.flightNumber;
      
          const origin = document.createElement('td');
          origin.textContent = booking.flight.origin;

          const destination = document.createElement('td');
          destination.textContent = booking.flight.destination;

          const departureTime= document.createElement('td');
          departureTime.textContent = `${ new Date(booking.flight.date).toLocaleDateString()} ${booking.flight.time}`;

          const seatNumber = document.createElement('td');
          seatNumber.textContent = booking.seatNumber;

          row.appendChild(passengerName);
          row.appendChild(flightNumber);
          row.appendChild(origin);
          row.appendChild(destination);
          row.appendChild(departureTime);
          row.appendChild(seatNumber);
      
          tableBody.appendChild(row);
        });
      
        table.appendChild(tableBody);
        bookingsList.appendChild(table);
      }

      //log out
    const logOut = document.getElementById('logout-button');
    logOut.addEventListener('click', (e) => {
      localStorage.removeItem('userToken');
      window.location.href = 'userLogin.html';
    })

    function getToken(key){
      return localStorage.getItem(key);
    }
      
    }

    









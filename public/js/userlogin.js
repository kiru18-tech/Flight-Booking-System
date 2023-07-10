// Signup Form
window.onload=function(){
  const signupForm = document.getElementById('signup-form');

  const loginform = document.getElementById('login-form');

  const success = document.getElementById('success-container');
  const error = document.getElementById('error-container');

  function clearDiv (){
    success.textContent = '';
    error.textContent = '';
  }
// signup form action
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault(); //prevents default action of signupform

  const username = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  clearDiv();
  
  try {
    const response = await fetch('http://localhost:3000/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    if (response.ok) {
      const data = await response.json();
      success.textContent = data.message;
      success.focus();
      signupForm.reset(); // Clear form fields
    } else {
      const errorData = await response.json();
      error.textContent = errorData.message;
    }
  } catch (e) {
    error.textContent = e

  }
});


// login form action
loginform.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('userpassword').value;
  clearDiv();
  try{
    const response = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      success.textContent = data.message;
      loginform.reset(); // Clear form fields
      localStorage.setItem('userToken', data.token);
      window.location.href = "userpanel.html";
    } else {
      const errorData = await response.json();
      error.textContent = errorData.message;
  }
}
  catch(e){
    
    error.textContent = e 
  }
})

}





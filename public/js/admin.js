// admin login form
window.onload=function(){
    const adminform = document.getElementById('admin-form');
    
adminform.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('userpassword').value;
  
    try{
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
  
        adminform.reset(); // Clear form fields
        localStorage.setItem('adminToken', data.token);
        window.location.href = 'AdminPanel.html';
      } else {
        const errorData = await response.json();
    }
  }
    catch(e){
      
      console.log(e)
    }
  
  })
  
  
  }
  
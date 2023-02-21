const signupForm=document.querySelector('#signup-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

signupForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  
  const name=e.target.name.value;
  const email=e.target.email.value;
  const password=e.target.password.value;

    const myobj={
      name,email,password
    }
    
    axios.post("http://18.183.25.92:3000/user/signup",myobj)
    .then((res)=>{
      if(res.data.Email==='exist'){
        alert("Email already exist");
      }
        window.location.href='./login.html';
      
    }).catch((err)=>{
     console.log(err);
    })
   nameInput.value='';
   emailInput.value='';
   passwordInput.value='';
    
   
}

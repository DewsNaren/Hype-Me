const overlayContainer=document.querySelector(".overlay");
const overlayCloseBtns=document.querySelectorAll(".overlay-close-btn");
const formContainers=overlayContainer.querySelectorAll(".form-container");
const loginContainer=overlayContainer.querySelector(".login-container");
const signUpContainer=overlayContainer.querySelector(".signup-container");
const resetContainer=overlayContainer.querySelector(".reset-container");


const body = document.body;
function closeOverlay(){
  formContainers.forEach(formContainer=>{
    formContainer.classList.remove("active");
  })
  setTimeout(()=>{
    overlayContainer.classList.remove("active");
    body.classList.remove("not-active");
  },600)
  const forms=overlayContainer.querySelectorAll(".form");
  forms.forEach(form=>{
    form.reset();
    const errors=form.querySelectorAll('.error');
    errors.forEach(error=>{
      error.classList.remove("active");
    })
  })
}
overlayCloseBtns.forEach(overlayCloseBtn=>{
    overlayCloseBtn.addEventListener('click',()=>{
    closeOverlay();
  })
})

overlayContainer.addEventListener("click", (e) => {
  if (!e.target.closest(".form-container")) {
    closeOverlay();
  }
});
const socialBtns=overlayContainer.querySelectorAll(".social-icons button");
socialBtns.forEach(socialBtn=>{
  socialBtn.addEventListener("mouseover",()=>{
    const img=socialBtn.querySelector("img")
    if(img.alt=="fb"){
      img.src="./assets/images/fb-hover.png"
    }
    else{
      img.src="./assets/images/google-hover.png"
    }
  })
  socialBtn.addEventListener("mouseout", () => {
    const img=socialBtn.querySelector("img")
    if (img.alt === "fb") {
      img.src = "./assets/images/fb.png"; 
    } else {
      img.src = "./assets/images/google.png";
    } 
  });
})


const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

function validateEmailVal(email,emailVal){
  if(emailVal===""){
    setError(email, 'Please Enter the  email');
    return false;
  }
  else if (!validateEmail(emailVal)) {
    setError(email, 'Please enter the valid email');
    return  false;
  } else {
    setSuccess(email);
    return true;
  }
}

function validatePasswordVal(password,passwordVal){
  if(passwordVal===""){
    setError(password, 'Please Enter the password');
    return false;
  }
  else if (passwordVal.length < 8) {
    setError(password, 'Password must be at least 8 characters');
    return false;
  } 
  else if (!/[A-Z]/.test(passwordVal)) {
    setError(password, 'Password must contain at least one uppercase letter');
    return false;
  } else if (!/[0-9]/.test(passwordVal)) {
    setError(password, 'Password must contain at least one number');
    return false;
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordVal)) {
    setError(password, 'Password must contain at least one special character');
    return false;
  } 
  else {
    setSuccess(password);
    return true;
  }
}
function validateSignupForm(form) {
  const username = form.querySelector('.name');
  const email=form.querySelector('.email');
  const password=form.querySelector('.password');
  const usernameVal = form.querySelector('.name').value.trim();
  const emailVal = form.querySelector('.email').value.trim();
  const passwordVal = form.querySelector('.password').value.trim();
  const zipCode=form.querySelector(".zipcode")
  const zipCodeVal=form.querySelector(".zipcode").value.trim();
  const checkBox=form.querySelector(".terms");
  const zipCodeError=form.querySelector(".error-zipcode")

  let success = true;

  if(usernameVal===""){
    setError(username, 'Please Enter the Full name');
    success= false;
  }
  else if(usernameVal.length<3){
    setError(username, 'Full name could not be less than 3 characters');
    success= false;
  }
  else {
    setSuccess(username);
  }

  if (!validateEmailVal(email, emailVal)) {
    success = false;
  }

  if (!validatePasswordVal(password, passwordVal)) {
    success = false;
  }

  if(zipCodeVal===""){
    setError(zipCode, 'Please enter Your Zip Code');
    success=false;
  }
  else{
    setSuccess(zipCode)
  }

  if(!checkBox.checked){  
    zipCodeError.classList.add("active")
    zipCodeError.innerHTML='Please Agree to the terms and Services';
    zipCodeError.style.color="rgb(242, 18, 18)"
    // setError(checkBox, 'Please Agree to the terms and Services');
    success=false;
  }
  else{
    zipCodeError.innerHTML='no error'
    zipCodeError.classList.remove("active")
  }

  return success;

}
function validateLoginForm(form) {
  const email=form.querySelector('.email');
  const password=form.querySelector('.password');
  
  const emailVal = form.querySelector('.email').value.trim();
  const passwordVal = form.querySelector('.password').value.trim();
  let success = true;

  if (!validateEmailVal(email, emailVal)) {
    success = false;
  }


  if (!validatePasswordVal(password, passwordVal)) {
    success = false;
  }

  return success;
}

function validateResetForm(form) {
  const email=form.querySelector('.email');
  const emailVal=email.value.trim();
  let success = true;
   if (!validateEmailVal(email, emailVal)) {
    success = false;
  }
  return success;
}

function setError(element,message){
  const inputGroup = element.closest('.input-group');
  
  const errorElement = inputGroup.querySelector('.error')
  errorElement.innerText = message;
  errorElement.classList.add('active')
}

function setSuccess(element){
  const inputGroup = element.closest('.input-group');
  const errorElement = inputGroup.querySelector('.error')

  errorElement.innerText = 'no error';
  errorElement.classList.remove('active')
}

const API_SIGNUP = 'http://taskapi.devdews.com/api/signup';

async function handleSignUp(form) {
  const name = form.querySelector(".name").value.trim();
  const email = form.querySelector(".email").value.trim();
  const password = form.querySelector(".password").value.trim();

  try {
    const res = await fetch(API_SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text(); 
    }

    if (res.ok) {
      form.reset();
      ["name", "email", "password"].forEach(field => {
        const errorElement = form.querySelector(`.error-${field}`);
        errorElement.innerText = "no error";
        errorElement.classList.remove("active");
      });

      if(typeof data==="string"){
        showAuthenticateToast(".signup-toast-container","#19762d", "User Created Successfully!")
      }
      
      setTimeout(() => {
        closeOverlay();
      }, 3000);
    } else {
      if (typeof data === "object") {
        showErrors(data.messages, form);
      } else {
        console.error("Unexpected error response:", data);
      }
    }
  } catch (err) {
    showAuthenticateToast(".signup-toast-container","#ea2f4b", "Failed to signup. Please try again.")
    console.error("Signup error:", err);
  }
}

function showAuthenticateToast(toastSelector, bgColor, message) {
  const formContainer = document.querySelector(".form-container.active");
  formContainer.scrollTo({ top: 0, behavior: "smooth" });
  const toast = document.querySelector(toastSelector);
  toast.querySelector("p").innerHTML = message;
  toast.style.backgroundColor = bgColor;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

const authenticateCloseBtns=document.querySelectorAll(".authenticate-toast-container img");
authenticateCloseBtns.forEach(closeBtn=>{ 
  closeBtn.addEventListener("click",()=>{   
    const toast=closeBtn.parentElement.parentElement;
    toast.classList.remove("show");
  })
})

const API_LOGIN='http://taskapi.devdews.com/api/signin'

async function handleLogin(form) {
  let profiles;
  document.querySelectorAll(".profile-container").forEach(container => {
  profiles = container.querySelectorAll(".user-profile");
  })
  const email = form.querySelector(".email").value.trim();
  const password = form.querySelector(".password").value.trim();

  try {
    const res = await fetch(API_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      
      localStorage.setItem("token", data.token); 
      form.reset();
      
      ["email","password"].forEach(field => {
        const errorElement=form.querySelector(`.error-${field}`);
        errorElement.innerText="no error";
        errorElement.classList.remove("active");
      })
      const result=form.parentElement.querySelector(".result");
      result.classList.add("active");
      sessionStorage.setItem("userInitial",email.charAt(0));
      showAuthenticateToast(".login-toast-container","#19762d", data.message);
      const defaultProfile=document.querySelector("header .nav .profile-container .default");
      const loginProfile=document.querySelector("header .nav .profile-container .login-profile");
      if(defaultProfile && loginProfile){
        defaultProfile.classList.add("not-active");
        loginProfile.classList.remove("not-active");
        loginProfile.textContent=`${sessionStorage.getItem("userInitial").toUpperCase()}`;
      }
      enableLogout();
      changeProfile(profiles);
      setTimeout(()=>{
        result.classList.remove("active");
        closeOverlay();
      },3000)
  
    } else {
      showErrors(data.messages,form);
    }
  } catch (err) {
    showAuthenticateToast(".login-toast-container","#ea2f4b", "Failed to login. Please try again.")
    console.error("Login error:", err);
  }
 
}

const logoutBtn=document.querySelectorAll(".profile-container .profile-menu .logout-btn");
const logoutOverlay = document.querySelector(".logout-overlay");
const logoutModal=logoutOverlay.querySelector(".logout-modal")
const logoutModalCloseBtn=logoutModal.querySelector(".modal-close-btn")
const logoutContentContainer=logoutModal.querySelector(".logout-modal .logout-content-container")
const cancelLogoutBtn = logoutModal.querySelector(".cancel-btn");
const confirmLogoutBtn = logoutModal.querySelector(".confirm-btn");
const logoutSuccessContainer=logoutModal.querySelector(".logout-modal .logout-success-container")
const signUpBtn=document.querySelectorAll(".profile-container .profile-menu .signup-btn");
const loginBtn=document.querySelector(".profile-container .profile-menu .login-btn");

// function enableLogout(){
//   const userToken=localStorage.getItem("token");
//   if(userToken){
//     logoutBtn.classList.add("active");
//     signUpBtn.classList.add("not-active");
//     loginBtn.classList.add("not-active");
//   }else{
//     logoutBtn.classList.remove("active");
//     signUpBtn.classList.remove("not-active");
//     loginBtn.classList.remove("not-active");
//   }
//   logoutBtn.addEventListener("click", () => {
//     logoutOverlay.classList.add("active");
//     body.classList.add("not-active");
//   });
// }
const chatModalWrapper=document.querySelector(".chat-modal-wrapper");
function enableLogout() {
  const signUpBtns  = document.querySelectorAll(".profile-container .profile-menu .signup-btn");
const loginBtns   = document.querySelectorAll(".profile-container .profile-menu .login-btn");
const logoutBtns  = document.querySelectorAll(".profile-container .profile-menu .logout-btn");
const chatModalWrapper=document.querySelector(".chat-modal-wrapper");
 
const userToken = localStorage.getItem("token");


  logoutBtns.forEach(btn => {
    if (userToken) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  signUpBtns.forEach(btn => {
    if (userToken) btn.classList.add("not-active");
    else btn.classList.remove("not-active");
  });

  loginBtns.forEach(btn => {
    if (userToken) btn.classList.add("not-active");
    else btn.classList.remove("not-active");
  });


  logoutBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if(chatModalWrapper){
        chatModalWrapper.classList.remove("active")
      }
      logoutOverlay.classList.add("active");
      body.classList.add("not-active");
    });
  });

  if(!userToken){
    sessionStorage.removeItem("userInitial");
  }
}
enableLogout();

if(window.name=="logout-btn"){
  logoutOverlay.classList.add("active");
  body.classList.add("not-active");
  window.name="";
}

function closeLogout(){
  logoutOverlay.classList.remove("active");
  body.classList.remove("not-active");
  logoutSuccessContainer.innerHTML="";
  logoutContentContainer.classList.remove("not-active")
}
logoutModalCloseBtn.addEventListener("click", () => {
  closeLogout();
  window.location.href="./index.html"
});
cancelLogoutBtn.addEventListener("click", () => {
  closeLogout();
});

logoutOverlay.addEventListener("click", (e) => {
  if (!e.target.closest(".logout-modal")) {
    closeLogout();
  }
});
let defaultSearches = [
  "Jordon 5 Shoes","Adidas YZY Shoes","Nike Air Force","adidas Yeezy 700",
  "Nike Dunk","Nike Air Griffey Max","Adidas AW Run Alexander",
  "Nike Air Force 1","Jordan 3 Retro","Adidas Yeezy"
];

confirmLogoutBtn.addEventListener('click',handleLogout)
const API_LOGOUT="http://taskapi.devdews.com/api/logout";

async function handleLogout() {
  
  let profiles;
  document.querySelectorAll(".profile-container").forEach(container => {
  const profileMenu = container.querySelector('.profile-menu');
  profiles = container.querySelectorAll(".user-profile");
  })
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const res = await fetch("http://taskapi.devdews.com/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }) 
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("token"); 
         logoutContentContainer.classList.add("not-active");
          logoutSuccessContainer.innerHTML+=`<h3>Logout Successful!</h3>
        <p class="logout-msg success">You have been securely logged out. Thank you for using our service. See you soon!</p>`
        enableLogout();
        changeProfile(profiles);
        sessionStorage.removeItem("userInitial");
      } else {
        logoutContentContainer.classList.add("not-active");
        logoutSuccessContainer.innerHTML = `
          <h3>Logout Failed</h3>
          <p class="logout-msg failed">
            ${data.message || "Something went wrong during logout. Please try again."}
          </p>`
      }

    } catch (error) {
      logoutContentContainer.classList.add("not-active");
      logoutSuccessContainer.innerHTML = `
        <h3>Error</h3>
        <p class="logout-msg failed">
          An unexpected error occurred while logging out. Please check your connection and try again.
        </p>`
    }
  } else {
    logoutContentContainer.classList.add("not-active");
    logoutSuccessContainer.innerHTML+=`<h3>You're Not Logged In</h3>
        <p class="logout-msg failed">
          It seems you haven't logged in yet. Please log in to continue.
        </p>`
  }

   setTimeout(()=>{
      logoutSuccessContainer.innerHTML="";
      closeLogout();
      logoutContentContainer.classList.remove("not-active");
      window.location.href="./index.html"
      localStorage.setItem("recentSearches", JSON.stringify(defaultSearches));
    },3000)
    
}


function handleReset(form){
  // const resetSuccessMessage = document.querySelector(".reset-container .reset-success-message");
  form.reset()
  const resetError=form.querySelector('.error');
  resetError.classList.remove("active");
  showAuthenticateToast(".reset-toast-container","#19762d", "Password reset link has been sent to your email successfully!")
  // resetSuccessMessage.classList.add("active");
  setTimeout(()=>{
    // resetSuccessMessage.classList.remove("active");
    closeOverlay();
  },3000)
}
function showErrors(messages,form) {
  Object.entries(messages || {}).forEach(([field, message]) => {
    const firstWord = message.split(' ')[0].toLowerCase();
    const errorElement = form.querySelector(`.error-${firstWord}`);

    const errors=form.querySelectorAll('.error');
    errors.forEach(error=>{
      error.innerText="no error";
      error.classList.remove("active");
    })
    if (errorElement) {
      errorElement.innerText = message;
      errorElement.classList.add("active");
    }
  });
}
const forms = document.querySelectorAll('.form');



function changePasswordType(){
  forms.forEach(form => {
    
  
  const password = form.querySelector(".password");
  const eyeIcon = form.querySelector(".eye-icon");

  if (password && eyeIcon) {
    eyeIcon.addEventListener('click', () => {
        if (password.type === "text") {
          password.type = "password";
          eyeIcon.src = "./assets/images/hide_password.png";
          eyeIcon.alt = "hide_password";
        } else {
          password.type = "text";
          eyeIcon.src = "./assets/images/view_password.png";
          eyeIcon.alt = "view_password";
        }
    });
  }
});
}
changePasswordType()
function setupForms() {
  const forms = document.querySelectorAll('.form');


  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const container = form.closest('.form-container');
      if (container.classList.contains("active")){

        let isValid = false;

        if (container.classList.contains('signup-container')) {
          isValid = validateSignupForm(form);
        } else if (container.classList.contains('login-container')) {
          isValid = validateLoginForm(form);
        } else if (container.classList.contains('reset-container')) {
          isValid = validateResetForm(form);
          if(isValid){
            const resetError=form.querySelector('.error');
            resetError.classList.remove("active");
          }
        }

        if (isValid) {
          if (container.classList.contains('signup-container')) {
            handleSignUp(form);
          } else if (container.classList.contains('login-container')) {
            handleLogin(form);
          } else if (container.classList.contains('reset-container')) {
            handleReset(form);
          }

          const password = form.querySelector(".password");
          const eyeIcon = form.querySelector(".eye-icon");
          if (password) password.type = "password";
          if (eyeIcon) {
            eyeIcon.src = "./assets/images/hide_password.png";
            eyeIcon.alt = "hide_password";
          }
        }
      }
    });
  });
}



const loginBtns=document.querySelectorAll(".login-btn");
function openLogIn(){
  resetContainer.classList.remove("active");
  signUpContainer.classList.remove("active");
  body.classList.add("not-active");
  overlayContainer.classList.add("active");
  
  requestAnimationFrame(()=>{
    loginContainer.classList.add("active");
  })
  
  setupForms();
}
loginBtns.forEach(loginBtn=>{
  loginBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(chatModalWrapper){
      chatModalWrapper.classList.remove("active")
    }
    openLogIn()
  })
})
if(window.name=="login-btn"){
  openLogIn();
  window.name="";
}


const signUpBtns=document.querySelectorAll(".signup-btn");
function openSignUp(){
  loginContainer.classList.remove("active");
    resetContainer.classList.remove("active");
    body.classList.add("not-active");
    overlayContainer.classList.add("active");
    requestAnimationFrame(()=>{
      signUpContainer.classList.add("active");
    })
    
  setupForms();
}
signUpBtns.forEach(signUpBtn=>{
  signUpBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(chatModalWrapper){
      chatModalWrapper.classList.remove("active")
    }
    requestAnimationFrame(() => {
      openSignUp();
    });
  })
})

if(window.name=="signup-btn"){
  openSignUp();
  window.name="";
}

const forgotBtn=loginContainer.querySelector(".password-group .forgot-link a");

forgotBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  loginContainer.classList.remove("active");
  resetContainer.classList.add("active");
})


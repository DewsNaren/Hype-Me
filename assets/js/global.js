window.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  renderSlider(products);
  if(window.name=="openForm"){
    overlayContainer.classList.add("active");
    loginContainer.classList.add("active");
    setupForms();
    body.classList.add("not-active");
    window.name="";
  }

});

function renderSlider(products) {
  const container = document.querySelector('.recent-slider-container');
  container.innerHTML = '';
  products.forEach((product, index) => {
    let slider=`
      <div class="recent-slider" >
        <div class="recent-slider-item" >
        <a href="./product-detail.html" data-product-id="${product._id}" data-product-img="./assets/images/${product.image}">
          <img src="./assets/images/${product.image}" alt="shoe-${index + 1}">
        </a>

          <span><img src="./assets/images/heart.png" alt="heart"></span>
        </div>
        <div class="recent-slider-content">
          <p class="recent-shoe-name">${product.model}</p>
          <p class="recent-shoe-price">$${product.price}.00</p>
        </div>
      </div>`;
      container.innerHTML+=slider;
  });

  initRecentSlider();
  setupLikeBtns();
}

function initRecentSlider() {
  const container = document.querySelector('.recent-slider-container');
  const prevBtn = document.querySelector('.recent-slider-btn.prev');
  const nextBtn = document.querySelector('.recent-slider-btn.next');
  const indicator = document.querySelector('.recent-slider-indicator-container .inner');
  const outer = document.querySelector('.recent-slider-indicator-container .outer');

  let slides = [...container.querySelectorAll('.recent-slider')];

  container.querySelectorAll('.recent-slider.clone').forEach(clone => clone.remove());

    function calculateGap() {
    return (window.innerWidth <= 1024) ? 20 : window.innerWidth * 0.0208334;
  }


  slides.forEach(slide => {
    const startClone = slide.cloneNode(true);
    const endClone = slide.cloneNode(true);
    startClone.classList.add('clone');
    endClone.classList.add('clone');
    container.prepend(startClone);
    container.append(endClone);
  });

  let gap = calculateGap();
  requestAnimationFrame(() => {
    const allSlides = [...container.querySelectorAll('.recent-slider')];
    let slideWidth = allSlides[0].getBoundingClientRect().width + gap;
    let currentIndex = slides.length;
    let isTransitioning = false;

    const originalCount = slides.length; 
    function moveIndicator(index) {
      const relativeIndex = (index % originalCount + originalCount) % originalCount;
      const step = (outer.offsetWidth - indicator.offsetWidth) / (originalCount - 1);
      indicator.style.transition = 'transform 0.6s ease-in-out';
      indicator.style.transform = `translateX(${relativeIndex * step}px)`;
    }

    function updateSlide(index, animate = true) {
      container.style.transition = animate ? 'transform 0.6s ease-in-out' : 'none';
      container.style.transform = `translateX(${-index * slideWidth}px)`;
      moveIndicator(index); 
    }

    updateSlide(currentIndex, false);

    function goToSlide(next = true) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex += next ? 1 : -1;
      updateSlide(currentIndex);
    }

    function handleTransitionEnd() {
      isTransitioning = false;
      const total = allSlides.length;

      if (currentIndex >= total - originalCount) {
        currentIndex = originalCount;
        updateSlide(currentIndex, false);
      } else if (currentIndex < originalCount) {
        currentIndex = total - originalCount - 1;
        updateSlide(currentIndex, false);
      }
    }

    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));

    const newPrevBtn = document.querySelector('.recent-slider-btn.prev');
    const newNextBtn = document.querySelector('.recent-slider-btn.next');

    newPrevBtn.addEventListener('click', () => goToSlide(false));
    newNextBtn.addEventListener('click', () => goToSlide(true));
    container.addEventListener('transitionend', handleTransitionEnd);

    window.addEventListener('resize', () => {
      gap = calculateGap();
      slideWidth = allSlides[0].getBoundingClientRect().width + gap;
      updateSlide(currentIndex, false);
    });
  });
}

const overlayContainer=document.querySelector(".overlay");
const overlayCloseBtns=document.querySelectorAll(".overlay-close-btn");
const formContainers=overlayContainer.querySelectorAll(".form-container");

const body = document.body;
function closeOverlay(){
  formContainers.forEach(formContainer=>{
    formContainer.classList.remove("active");
  })
  overlayContainer.classList.remove("active");
  body.classList.remove("not-active");
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
    setError(email, 'Invalid email');
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
  const inputGroup = element.parentElement;
  
  const errorElement = inputGroup.querySelector('.error')
  errorElement.innerText = message;
  errorElement.classList.add('active')
}

function setSuccess(element){
  const inputGroup = element.parentElement;
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

      const result = form.parentElement.querySelector(".result");
      result.classList.add("active");
      result.innerHTML = typeof data === "string" ? data : "User Created Successfully";

      setTimeout(() => {
        result.classList.remove("active");
        closeOverlay();
      }, 6000);
    } else {
      if (typeof data === "object") {
        showErrors(data.messages, form);
      } else {
        console.error("Unexpected error response:", data);
      }
    }
  } catch (err) {
    console.error("Signup error:", err);
  }
}


const API_LOGIN='http://taskapi.devdews.com/api/signin'

async function handleLogin(form) {
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
    
      result.innerHTML=data.message;
      
      setTimeout(()=>{
        result.classList.remove("active");
        closeOverlay();
      },6000)

    } else {
      showErrors(data.messages,form);
    }
  } catch (err) {
    console.error("Login error:", err);
  }
}

const logoutBtn=document.querySelector(".profile-container .profile-menu .logout-btn");
const logoutOverlay = document.querySelector(".logout-overlay");
const logoutModal=logoutOverlay.querySelector(".logout-modal")
const logoutModalCloseBtn=logoutModal.querySelector(".modal-close-btn")
const logoutContentContainer=logoutModal.querySelector(".logout-modal .logout-content-container")
const cancelLogoutBtn = logoutModal.querySelector(".cancel-btn");
const confirmLogoutBtn = logoutModal.querySelector(".confirm-btn");
const logoutSuccessContainer=logoutModal.querySelector(".logout-modal .logout-success-container")
const userToken=localStorage.getItem("token");
if(userToken){
  logoutBtn.classList.add("active")
}else{
  logoutBtn.classList.remove("active")
}
logoutBtn.addEventListener("click", () => {
  logoutOverlay.classList.add("active");
  body.classList.add("not-active");
});

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
});
cancelLogoutBtn.addEventListener("click", () => {
  closeLogout();
});

logoutOverlay.addEventListener("click", (e) => {
  if (!e.target.closest(".logout-modal")) {
    closeLogout();
  }
});


confirmLogoutBtn.addEventListener('click',handleLogout)
const API_LOGOUT="http://taskapi.devdews.com/api/logout";

async function handleLogout() {
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
    },5000)
    
}


function handleReset(form){
  const resetSuccessMessage = document.querySelector(".reset-container .reset-success-message");
  form.reset()
  resetSuccessMessage.classList.add("active");
  setTimeout(()=>{
    resetSuccessMessage.classList.remove("active");
    closeOverlay();
  },6000)
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

function changePasswordType(container) {
  const password = container.querySelector(".password");
  const eyeIcon = container.querySelector(".eye-icon");
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
}

function setupForms() {
  const forms = document.querySelectorAll('.form');

  forms.forEach(form => {
    const container = form.closest('.form-container');
    if (container.classList.contains("active")){
      changePasswordType(container);
    } 
  });

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

function setupLikeBtns() {
  const overlayContainer = document.querySelector(".overlay");
  const body = document.body;
  const overlayCloseBtns = document.querySelectorAll(".overlay-close-btn");

  const likeBtns = document.querySelectorAll(".recent-slider .recent-slider-item span");
  const loginContainer=overlayContainer.querySelector(".login-container");

  likeBtns.forEach(likeBtn => {
    likeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const token=localStorage.getItem("token")
      if(token && token.trim() !== "" ){
        const likeBtnImg=likeBtn.querySelector("img");
        if (likeBtnImg.src.includes("liked-heart.png")) {
          likeBtnImg.src = "./assets/images/heart.png";
          likeBtnImg.alt = "heart";
        } else {
          likeBtnImg.src = "./assets/images/liked-heart.png";
          likeBtnImg.alt = "liked-heart";
        }
        return;
      }
      else{
        body.classList.add("not-active");
        overlayContainer.classList.add("active");
        requestAnimationFrame(() => {
          loginContainer.classList.add("active");
        });
        setupForms();
      }
    });
  });
  overlayCloseBtns.forEach(overlayCloseBtn=>{
    overlayCloseBtn.addEventListener('click', () => {
      closeOverlay();
    });
  })
   
}
const loginContainer=overlayContainer.querySelector(".login-container");
const signUpContainer=overlayContainer.querySelector(".signup-container");
const resetContainer=overlayContainer.querySelector(".reset-container");
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
    e.stopPropagation();
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
    e.stopPropagation();
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
  e.stopPropagation();
  loginContainer.classList.remove("active");
  resetContainer.classList.add("active");
})



document.querySelector('.recent-slider-container').addEventListener('click', (e) => {
  const link = e.target.closest('a[data-product-id]');

  if (!link) return; 

  e.preventDefault(); 
  if(token){
    const productId = link.dataset.productId;

    window.name=productId;
    setTimeout(() => {
      window.location.href = link.href;
    }, 0);
  }
  else{
    openLogIn()
  }
});

const viewAll=document.querySelector(".recently-posted .recent-slider-indicator-container .view-all")

if(userToken){
  console.log(userToken)
}
viewAll.addEventListener('click',(e)=>{
  e.preventDefault();
  if(!userToken){
    openLogIn();
  }
  else{
    window.name=""
    window.location.href=viewAll.href;
  }
})


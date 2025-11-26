
function changeProfile(profiles) {
  const loginToken = localStorage.getItem("token");

  profiles.forEach(p => p.classList.remove("not-active"));

  if (loginToken) {
    profiles.forEach(p => {
      if (p.classList.contains("default")) p.classList.add("not-active");
      if(p.classList.contains("active-profile")) p.classList.add("not-active");
      if(p.classList.contains("login-profile")) p.textContent=localStorage.getItem("userInitial").toUpperCase();
    });
  } else {
    profiles.forEach(p => {
      if (p.classList.contains("login-profile")) p.classList.add("not-active");
      if(p.classList.contains("active-profile")) p.classList.add("not-active");
    });
  }
}







document.querySelectorAll(".profile-container").forEach(container => {
  const profileMenu = container.querySelector('.profile-menu');
  const profiles = container.querySelectorAll(".user-profile");

  
  if(window.location.pathname.includes("my-products.html")){
    getProfileData();
    changeProfile(profiles);
  }
 else {
   changeProfile(profiles);
}
  

  container.addEventListener("click", () => {
    profileMenu.classList.toggle("active");
  });

  window.addEventListener("click", (e) => {
    if (!e.target.closest('.profile-container')) {
      profileMenu.classList.remove("active");
    }
  });
});


document.querySelectorAll(".header nav .nav-btn-container .sell-btn")
.forEach(sellBtn => {

  sellBtn.addEventListener('click', (e) => {
    const loginToken = localStorage.getItem("token");

    if (loginToken) {
      window.edit = "";
      window.location.href = "./my-products.html";
    } else {
      e.preventDefault();
      openLogIn();
    }
  });

});

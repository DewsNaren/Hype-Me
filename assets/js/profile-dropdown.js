const profileContainer = document.querySelector('.profile-container');
const profileMenu = profileContainer.querySelector('.profile-menu');
const profileLinks=profileMenu.querySelectorAll("a");

const profiles=profileContainer.querySelectorAll(".user-profile");

function changeProfile(){
  const loginToken=localStorage.getItem("token");
  profiles.forEach(profile => {
  profile.classList.remove("not-active");
});

if(loginToken){
  profiles.forEach(profile=>{
    if(profile.classList.contains("default")){
        profile.classList.add("not-active")
      }
  }) 
}
else{
  profiles.forEach(profile=>{
    if(profile.classList.contains("login-profile")){
      profile.classList.add("not-active");
    }
  })
}

}
profileContainer.addEventListener('click', () => {
  profileMenu.classList.toggle("active")
});
changeProfile();
window.addEventListener('click', (e) => {
  if (!e.target.closest('.profile-container')) {
    profileMenu.classList.remove("active")
  }
});


const sellBtn=document.querySelector(".header nav .nav-btn-container .sell-btn");

sellBtn.addEventListener('click',(e)=>{
  const loginToken=localStorage.getItem("token");
  if(loginToken){
    window.edit="";
    window.location.href="./my-products.html";
  }
  else{
    e.preventDefault();
    openLogIn();
  }
})
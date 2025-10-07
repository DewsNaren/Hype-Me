const profileContainer = document.querySelector('.profile-container');
const profileMenu = profileContainer.querySelector('.profile-menu');
const profileLinks=profileMenu.querySelectorAll("a")
profileContainer.addEventListener('click', () => {
  profileMenu.classList.toggle("active")
});

window.addEventListener('click', (e) => {
  if (!e.target.closest('.profile-container')) {
    profileMenu.classList.remove("active")
  }
});



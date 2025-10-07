const container = document.querySelector('.slider-container');
const slides = [...document.querySelectorAll('.slider')];
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const indicators = [...document.querySelectorAll('.slider-indicator-container button')];

let currentIndex = slides.length;
let isTransitioning = false;

slides.slice().reverse().forEach(s => container.prepend(s.cloneNode(true)));
slides.forEach(s => container.append(s.cloneNode(true)));

const allSlides = document.querySelectorAll('.slider');
container.style.width = `${allSlides.length * 100}%`;
allSlides.forEach(s => (s.style.width = `${100 / allSlides.length}%`));

function updateSlide(index, animate = true) {
  container.style.transition = animate ? 'transform 0.6s ease-in-out' : 'none';
  const translateX = -index * (100 / allSlides.length);
  container.style.transform = `translateX(${translateX}%)`;
  updateIndicators(index);
}

function updateIndicators(index) {
  const visibleIndex = index % slides.length;
  indicators.forEach((btn, i) => {
    btn.classList.toggle('active', i === visibleIndex);
  });
}

function goToSlide(next = true) {
  if (isTransitioning) return;
  isTransitioning = true;
  currentIndex += next ? 1 : -1;
  updateSlide(currentIndex);
}


function handleTransitionEnd() {
  isTransitioning = false;
  if (currentIndex >= slides.length * 2) {
    currentIndex = slides.length;
    updateSlide(currentIndex, false);
  } else if (currentIndex < slides.length) {
    currentIndex = slides.length * 2 - 1;
    updateSlide(currentIndex, false);
  }
}


indicators.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (isTransitioning) return;
    currentIndex = slides.length + i;
    updateSlide(currentIndex);
  });
});


updateSlide(currentIndex, false);


prevBtn.addEventListener('click', () => goToSlide(false));
nextBtn.addEventListener('click', () => goToSlide(true));
container.addEventListener('transitionend', handleTransitionEnd);



let startX = 0;
let startY = 0;
const threshold = 10; 

function getEventX(e) {
  return e.type.includes('mouse') ? e.pageX : e.changedTouches[0].screenX;
}

function getEventY(e) {
  return e.type.includes('mouse') ? e.pageY : e.changedTouches[0].screenY;
}

document.addEventListener('touchstart', startSwipe, { passive: true });
document.addEventListener('touchend', endSwipe);
document.addEventListener('mousedown', startSwipe);
document.addEventListener('mouseup', endSwipe);

function startSwipe(e) {
  startX = getEventX(e);
  startY = getEventY(e);
}

function endSwipe(e) {
  const endX = getEventX(e);
  const endY = getEventY(e);

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < -threshold) goToSlide(false);
    else if (dx > threshold) goToSlide(true);
  }
}

const token=sessionStorage.getItem("token")
function handleSearch(searchTerm = "", redirectUrl = "./product-list.html", preFilteredProducts = null) {
  let matchedProducts = [];
  let brandWord = "";

  if (preFilteredProducts) {
    matchedProducts = preFilteredProducts;
  } else {
    if (!searchTerm) return;
    brandWord = searchTerm.split(" ")[0].toLowerCase();

    matchedProducts = allProducts.filter(product =>
      product.brand.toLowerCase().includes(brandWord)
    );
  }

  window.name= JSON.stringify(matchedProducts);
  window.location.href = redirectUrl;
}

const recentList = document.querySelector(".recent-searches .recent-search-list");
let recentSearches = JSON.parse(sessionStorage.getItem("recentSearches")) || [
  "Jordon 5 Shoes","Adidas YZY Shoes","Nike Air Force","adidas Yeezy 700",
  "Nike Dunk","Nike Air Griffey Max","Adidas AW Run Alexander",
  "Nike Air Force 1","Jordan 3 Retro","Adidas Yeezy"
];

function renderRecentSearches(){
  recentList.innerHTML="";
  recentSearches.forEach(search=>{
    recentList.innerHTML+=`<a class="recent-search-tag" href="./product-list.html">${search}</a>`
  })
}
renderRecentSearches()
const searchInput = document.querySelector(".main-container .search-wrapper .input-container input");
if(token){
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (!value) return;
      const existingIndex = recentSearches.indexOf(value);
      if (existingIndex !== -1) {
        recentSearches.splice(existingIndex, 1);
      }
      recentSearches.unshift(value);
      if (recentSearches.length > 10) {
        recentSearches.pop();
      }
      sessionStorage.setItem("recentSearches", JSON.stringify(recentSearches));
      renderRecentSearches();
      handleSearch(value, "./product-list.html");
    }
  });
}

const recentSearchTags = document.querySelectorAll(".recent-search-list .recent-search-tag");

recentSearchTags.forEach(tag => {
  tag.addEventListener("click", (e) => {
    e.preventDefault();
    if(token){
      handleSearch(tag.textContent.trim(), tag.getAttribute("href"));
    }
  });
});



const brandBoxes= document.querySelectorAll(".popular-brands .popular-shoe-container .brand-box")

if(token){
  brandBoxes.forEach(box=>{
    box.addEventListener('click',()=>{
      const shoeContainer =box.parentElement;
    const name= shoeContainer.querySelector(".brand-name").textContent
    handleSearch(name.toLowerCase().trim(), "./product-list.html");
    })
  })
}

const budgetBtns = document.querySelectorAll(".shop-under-budget .shop-button-container .budget-btn");
if(token){
  budgetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const priceContainer = btn.querySelector(".budget-price");
      const priceArr = priceContainer.getAttribute("data-filter").split('-');
      const min = Number(priceArr[0]);
      const max = Number(priceArr[1]);

      window.name = JSON.stringify({
        min,
        max
      });
      window.location.href = "./product-list.html";
    });
  });
}


function initHeaderScroll(headerSelector, targetSelector, thresholdValue = 0.1) {
  const header = document.querySelector(headerSelector);
  const target = document.querySelector(targetSelector);

  if (!header || !target) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          header.classList.remove("scrolled"); 
        } else {
          header.classList.add("scrolled"); 
        }
      });
    },
    {
      root: null,
      threshold: thresholdValue
    }
  );

  observer.observe(target);
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll(".header", ".sentinel", 0.1);
});



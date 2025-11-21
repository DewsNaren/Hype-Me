const profileList=document.querySelector(".header .nav .profile-list");
const locationListZipCode=document.querySelector(".header .nav .location-list span")
const topProfileusername=document.querySelector(".user-info .user-details h2");
const userLocation=document.querySelector(".user-info .user-details .user-location");
const zipcode=userLocation.childNodes[1];
const totalLikesCount=document.querySelector(".user-stats .stat-box .likes-count");
const totalViewsCount=document.querySelector(".user-stats .stat-box .views-count");
const followersCount=document.querySelector(".user-stats .stat-box .followers-count");
const followingCount=document.querySelector(".user-stats .stat-box .following-count");
const userProfilePicture=document.querySelector(".user-info .profile-img-wrapper img")
console.log(totalViewsCount)
// console.log(zipcode)

function getProfileData(){
  let formData;
  if(window.edit){
    formData = JSON.parse(window.edit)
    console.log(formData)
    console.log(window.edit)
  }
  renderProfileData(formData)
}

function renderProfileData(formData){
  if(formData){
    topProfileusername.innerHTML=`${formData.firstName} ${formData.lastName}`;
    zipcode.textContent=`TX ${formData.zipCode}`;
    locationListZipCode.textContent=`TX ${formData.zipCode}`;
    if(formData.delProfile=="true"){
      let profileHtml=`<span class="user-profile">${formData.firstName[0]}${formData.lastName[0]}</span><button type="button"><img src="./assets/images/profile-arrow.png" class="profile-arrow" alt="profile-arrow"></button>`;
      profileList.innerHTML="";
      profileList.innerHTML=profileHtml;
      userProfilePicture.src="./assets/images/default-profile-pic.jpg"
    }
    else{
      userProfilePicture.src=`./assets/images/${formData.profileImg}`
    }
  }
}
renderProfileData();

const ProductTabs = document.querySelectorAll(".product-tab");
const productBody = document.querySelector(".products-body");
const userReviewWrapper = document.querySelector(".user-review-wrapper");
const addProductBtn=document.querySelector(".products-wrapper .products-body .add-product-btn");

ProductTabs.forEach(ProductTab => {
  ProductTab.addEventListener('click', () => {
  
    ProductTabs.forEach(tab => tab.classList.remove("active"));
    ProductTab.classList.add("active");

    
    const tabName = ProductTab.textContent.trim().toLowerCase();

    if (tabName.includes("my products")) {
      productBody.classList.add("show");
      productBody.classList.remove("hide");

      userReviewWrapper.classList.add("hide");
      userReviewWrapper.classList.remove("show");

      addProductBtn.style.display = 'block';
    } 
    else if (tabName.includes("user reviews(265)")) {
      userReviewWrapper.classList.add("show");
      userReviewWrapper.classList.remove("hide");

      productBody.classList.add("hide");
      productBody.classList.remove("show");

      addProductBtn.style.display = 'none';
    }
  });
});

// if(addProductBtn){
//   addProductBtn.addEventListener('click',(e)=>{
//     e.preventDefault();
//     window.location.href="./add-product.html"
//   })
// }
function renderProducts(products){
  const productList=document.querySelector(".products-wrapper .products-body .product-list")
  productList.innerHTML="";
  products.forEach(product=>{
    productList.innerHTML+=`
    <div class="product">
      <img src="./assets/images/${product.image}" alt="${product.model}">
        <div class="product-content">
            <p class="product-shoe-name">${product.model}</p>
            <div class="product-meta">
                <p class="product-shoe-price">$${product.price.toFixed(2)}</p>
                <div class="product-meta-item">
                    <p><img src="./assets/images/views.png" class="views"> <span class="view-count">${product.views}</span></p>
                    <p><img src="./assets/images/likes.png" class="likes"> <span class="like-count">${product.likes}</span></p>
                </div>
            </div> 
        </div>
      </div>
    `;
  })
}
async function initializeProducts(defaultType) {
  const allProducts = await fetchProducts();

  const productTypeBtns=document.querySelectorAll(".products-body .product-sub-tabs-wrapper .product-sub-tabs .product-sub-tab");
  const filteredProducts = allProducts.filter(p => p.type === defaultType);
  productPage = 1;
  renderProducts(filteredProducts.slice(0, productsPerPage));
  updateProductPagination(filteredProducts);
  productTypeBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      productTypeBtns.forEach(pBtn=>pBtn.classList.remove("active"));
      btn.classList.add("active");
      let filteredProducts=[];
      let btnType=btn.textContent.toLowerCase().includes('new')?"new":"used"
      filteredProducts=allProducts.filter(p=>p.type==btnType)
      renderProducts(filteredProducts.slice(0, productsPerPage));
      updateProductPagination(filteredProducts)
    })
  })
  const totalViews = allProducts.reduce((sum, product) => sum + product.views, 0);
  totalViewsCount.innerHTML=totalViews
  const totalLikes = allProducts.reduce((sum, product) => sum + product.likes,0);
  totalLikesCount.innerHTML=totalLikes;
  followersCount.innerHTML=Math.floor(Math.random()*200-100+1)+100;
  followingCount.innerHTML=Math.floor(Math.random()*100-20+1)+20;

  updateProductCounts();
}


function updateProductCounts() {
  const totalCountEl = document.querySelector('.product-main-tabs .product-tab.active .product-count');
  const newCountEl = document.querySelector('.product-sub-tabs .product-sub-tab:nth-child(1) .product-count');
  const usedCountEl = document.querySelector('.product-sub-tabs .product-sub-tab:nth-child(2) .product-count');

  const totalProducts = allProducts.length;
  const newProducts = allProducts.filter(p => p.type === "new").length;
  const usedProducts = allProducts.filter(p => p.type === "used").length;

  if (totalCountEl) totalCountEl.textContent = `(${totalProducts})`;
  if (newCountEl) newCountEl.textContent = `(${newProducts})`;
  if (usedCountEl) usedCountEl.textContent = `(${usedProducts})`;
}

let productPage = 1;
let productsPerPage = 16;

function updateProductPagination(filteredProducts) {
  renderPagination(
    ".pagination", 
    filteredProducts.length, 
    productsPerPage, 
    productPage, 
    (page) => {
      productPage = page;
      renderProducts(filteredProducts.slice(
        (productPage - 1) * productsPerPage,
        productPage * productsPerPage
      ));
      updateProductPagination(filteredProducts);
    }
  );
}

function renderPagination(containerSelector, totalItems, itemsPerPage, currentPage, onPageChange) {
  const pagination = document.querySelector(containerSelector);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let html = "";

  if (currentPage > 1) html += `<button class="prev">Prev</button>`;

  let startPage = 1, endPage = 8;
  if (currentPage > 4) {
    startPage = currentPage - 4;
    endPage = currentPage + 4;
    if (endPage > totalPages - 1) endPage = totalPages - 1;
  } else if (totalPages < 8) {
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page ${i === currentPage ? "active" : ""}">${i}</button>`;
  }

  if (endPage < totalPages - 1) {
    html += `<span class="dots">...</span>`;
    html += `<button class="page">${totalPages}</button>`;
  }

  if (currentPage < totalPages) html += `<button class="next">Next</button>`;

  pagination.innerHTML = html;

  pagination.querySelectorAll(".page").forEach(btn => {
    btn.addEventListener("click", () => {
      onPageChange(parseInt(btn.textContent));
    });
  });

  const prevBtn = pagination.querySelector(".prev");
  if (prevBtn) prevBtn.addEventListener("click", () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  });

  const nextBtn = pagination.querySelector(".next");
  if (nextBtn) nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  });
}

document.addEventListener('DOMContentLoaded',async()=>{
  initializeProducts("used");
})

const reviewHeadings = [
  "Stylish slip, perfect for staying at home during COVID!",
  "Decently, priced for a cool looking pair of shoes",
  "Great product great price",
  "Looks great but feels loose",
  "Beware the color descriptions and pictures do not add up!"
];

const reviewTexts = [
  "I'm someone who is very flat footed so have to wear shoes orthotic inserts, otherwise I experience serious issues after a few weeks of walking barefoot. I have been looking for good shoes that I can slip on and off that allow me to quickly change when needed and provide support when...",
  "Great comfortable shoe. Purchased 9.5(us)and they fit perfectly.Wears well and love how they are light weight and got some great compliments on them at the gym.",
  "I got those shoes for a low pricr than the regular price si is a good deal, then i got then delyvered a day before that the day amazon said i gonna recived... The shoes feel so good and confortable, lite wait shoes, good for walk if you walk a lot.",
  "I bought these for my husband as a birthday gift. They look great on him, but he says they feel loose and his feet slide around in the shoe. I ordered his usual size he wears in adidas shoes. My family basically only wears adidas shoes because they are quality made and durable. I...",
  "Color descriptions and pictures do not match up.I selected black shoes with a white sole(based on the pictures).I got the right shoe style but the wrong color.The shoes I received weere all black, including thte soles. Super annoying, these are a gift so I will see if they are ok with this color..."
];

const reviewUsers = [
  "Siddarth Sharma", "Faraaz", "Angel Mendez", "DisneyFam", "Eric Olivera"
];

let allReviews = [];
let filteredReviews = [];
let currentPage = 1;
const reviewsPerPage = 5;
let totalPages = 53; 

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(daysAgo) {
  if (daysAgo < 30) return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} month${Math.floor(daysAgo / 30) > 1 ? 's' : ''} ago`;
  if (daysAgo < 730) return `1 year ago`;
  return `${Math.floor(daysAgo / 365)} years ago`;
}

for (let i = 0; i < totalPages * reviewsPerPage; i++) {
  const daysAgo = randomNumber(1, 1825); 
  const ran=randomNumber(0,5-1);
  allReviews.push({
    heading: reviewHeadings[ran],
    text: reviewTexts[ran],
    user: reviewUsers[ran],
    stars: randomNumber(1, 5),
    likes: randomNumber(0, 10),
    dislikes: randomNumber(0, 5),
    date: formatDate(daysAgo)
  });
}

filteredReviews = [...allReviews];

function renderReviews(page) {
  const reviewContainer = document.querySelector(".user-reviews");
  reviewContainer.innerHTML = "";
  const start = (page - 1) * reviewsPerPage;
  const end = start + reviewsPerPage;
  const reviews = filteredReviews.slice(start, end);

  reviews.forEach(review => {
    let starHtml = "";
    for (let i = 1; i <= 5; i++) {
      starHtml += `<i class="fa-solid fa-star${i > review.stars ? ' fa-unfill' : ''}"></i>`;
    }

    reviewContainer.innerHTML += `
      <div class="review-item">
        <h3 class="review-heading">${review.heading}</h3>
        <p class="review-text">${review.text}</p>
        <a href="#" class="read-more">Read More</a>
        <div class="review-meta">
          <span class="review-date">${review.date}</span>
          <span class="review-user">| ${review.user}</span>
        </div>
        <div class="review-footer">
          <div class="review-rating">${starHtml}</div>
          <div class="review-actions">
            <span class="review-helpful">The review was helpful</span>
            <button><i class="fa-solid fa-thumbs-up"></i>(${review.likes})</button>
            <button><i class="fa-solid fa-thumbs-down"></i>(${review.dislikes})</button>
          </div>
        </div>
      </div>
    `;
  });
}


function updateReviewPagination() {
  renderPagination(
    ".review-pagination",
    filteredReviews.length,
    reviewsPerPage,
    currentPage,
    (page) => {
      currentPage = page;
      renderReviews(currentPage);
      updateReviewPagination();
    }
  );
}


function applyFilter() {
  const activeFilterBtn = document.querySelector(".filter-buttons .active span");
  const sortSelect = document.querySelector("#sort").value;

  filteredReviews = [...allReviews];

  if (activeFilterBtn.textContent !== "All") {
    const star = parseInt(activeFilterBtn.textContent);
    filteredReviews = filteredReviews.filter(r => r.stars === star);
  }

  if (sortSelect === "high") {
    filteredReviews.sort((a, b) => b.stars - a.stars);
  } 
  else if(sortSelect=="low"){
    filteredReviews.sort((a, b) => a.stars - b.stars);
  } 

  currentPage = 1;
  renderReviews(currentPage);
  updateReviewPagination();
}

renderReviews(currentPage);
updateReviewPagination();

document.querySelectorAll(".filter-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter();
  });
});


document.querySelector("#sort").addEventListener("change", () => {
  applyFilter();
});
 

const addProductModalContainer=document.querySelector(".add-product-modal-container");

if(addProductBtn){
  addProductBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    window.name="";
    addProductModalContainer.classList.add("active");
    body.classList.add("not-active");
  })
}

const editProfileBtn=document.querySelector(".top-profile-section .user-info .user-details .edit-link");
const editOverlay=document.querySelector(".edit-modal-overlay")

editProfileBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  editOverlay.classList.add("active");
  body.classList.add("not-active")
})
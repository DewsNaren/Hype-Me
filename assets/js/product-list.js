let currentPage = 1; 
let itemsPerPage = 15; 
let filteredProducts = []; 
let receivedMin = null; 
let receivedMax = null; 
let totalProducts = [];
const minRange = document.querySelector(".minRange"); 
const maxRange = document.querySelector(".maxRange"); 
const priceDisplay = document.querySelector(".price-display"); 
const rangeFill = document.querySelector(".range-fill"); 
const highlightBox = document.querySelector(".highlight-box"); 
const sortBtn = document.querySelector(".sort-button"); 
sortBtn.addEventListener("click", function () { 
  this.closest(".sort-dropdown").classList.toggle("active"); 
}); 

function initSpinnerAnimation() {
  const spinners = document.querySelectorAll(".spinner");
  const circles = document.querySelectorAll(".spinner .circle");
  if (!spinners.length) return; 

  for (let i = 1; i <= spinners.length; i++) {
    spinners[i - 1].style.animationDelay = `${i * 0.25}s`;
    circles[i - 1].style.animationDelay = `${i * 0.25}s`;
  }
}

const filterBtn = document.querySelector(".filter-btn"); 
const filterContainer = document.querySelector(".filter-container"); 
const filterClostBtn = document.querySelector(".filter-close-btn"); 
const footer = document.querySelector("footer"); 
filterBtn.addEventListener("click", () => { 
  filterContainer.classList.add("active"); 
  footer.classList.add("not-active"); 
  filterClostBtn.classList.add("active"); 
}); 
filterClostBtn.addEventListener("click", () => { 
  filterContainer.classList.remove("active"); 
  footer.classList.remove("not-active");
  filterClostBtn.classList.remove("active"); 
}); 
function getProducts() {
  let receivedObj;
  try {
    receivedObj = JSON.parse(window.name || "{}");
  } catch {
    receivedObj = {};
  }
    if (receivedObj.min !== undefined && receivedObj.max !== undefined) {
      receivedMin = receivedObj.min;
      receivedMax = receivedObj.max;
  } else if (Array.isArray(receivedObj)) {
    totalProducts = receivedObj;
  }
}


function applyFilters(page = 1) { 
  let minVal = parseInt(minRange.value); 
  let maxVal = parseInt(maxRange.value); 
  if (minVal >= maxVal) { 
    minVal = maxVal - 1; 
    if (minVal < parseInt(minRange.min)) 
      minVal = parseInt(minRange.min); minRange.value = minVal; 
  } if (maxVal <= minVal) { 
    maxVal = minVal + 1; 
    if (maxVal > parseInt(maxRange.max)) maxVal = parseInt(maxRange.max); 
      maxRange.value = maxVal; 
  } 
  const minPercent = ((minVal - parseInt(minRange.min)) / (parseInt(minRange.max) - parseInt(minRange.min))) * 100; 
  const maxPercent = ((maxVal - parseInt(maxRange.min)) / (parseInt(maxRange.max) - parseInt(maxRange.min))) * 100; 
  rangeFill.style.left = minPercent + "%"; 
  rangeFill.style.width = maxPercent - minPercent + "%"; 
  highlightBox.style.left = minPercent + "%";
  highlightBox.style.width = maxPercent - minPercent + "%"; 
  priceDisplay.textContent = `${minVal} - $${maxVal}`; 
  let filtered = totalProducts.filter( 
    (p) => p.price >= minVal && p.price <= maxVal 
  ); 
  filtered.sort((a, b) => a.price - b.price);
  const conditionInputs = document.getElementsByName("condition"); 
  const activeTypes = []; 
  conditionInputs.forEach((input) => { 
    if (input.classList.contains("active")) { 
      activeTypes.push(input.value); 
      
    } 
  }); 
  if (activeTypes.length > 0) { 
    filtered = filtered.filter((p) => activeTypes.includes(p.type)); 
  }
  const checkedBrands = Array.from(
    document.querySelectorAll(".brand-filter input:checked")
  ).map((input) => input.value);

  if (checkedBrands.length > 0) {
    filtered = filtered.filter((p) => checkedBrands.includes(p.brand));
  }
  
  filteredProducts = filtered; 
  let headerLabel = "All Shoes";

  if (activeTypes.includes("new") && activeTypes.includes("used")) {
    headerLabel = "All Shoes";
  } else if (activeTypes.includes("new")) {
    headerLabel = "New Shoes";
  } else if (activeTypes.includes("used")) {
    headerLabel = "Used Shoes";
  } else {
    headerLabel = "Shoes";
  }
  filteredProducts = filtered;
  renderProducts(filteredProducts, page, headerLabel);
} 
function renderProducts(products, page = 1, headerLabel = "All Shoes") { 
  const productList = document.querySelector(".product-list"); 
  productList.innerHTML = ""; 
  if (products.length === 0) { 
    productList.classList.add("active"); 
    productList.innerHTML =`<p class="no-product">No products found. Try another meaningful search.</p>`; 
    return; 
  } 
  let start = (page - 1) * itemsPerPage; 
  let end = start + itemsPerPage; 
  let endIndex=Math.min(end, filteredProducts.length);
  let paginatedProducts = products.slice(start, end); 

  if (paginatedProducts.length === 0) { 
    productList.classList.add("active"); 
    productList.innerHTML =`<p class="no-product">No products found. Try another meaningful search.</p>`; 
    return; 
  } 
  productList.classList.remove("active"); 
  productList.innerHTML = `<div class="product-list-header"> 
                <h2>${headerLabel}<span>(Showing ${start+1} - ${endIndex} products of ${filteredProducts.length} products)</span></h2> 
                <div class="sort-wrapper"> <span class="sort-label">Sort by:</span> 
                  <div class="sort-dropdown"> 
                    <button type="button" class="sort-button"> Featured <img src="./assets/images/down-arrow.png" alt="down-arrow"> </button> 
                  </div>
                </div> 
              </div> 
              <div class="product-list-body"></div> 
              <div class="pagination"> 
                <div class="page-btn-container"></div> 
              </div>`; 
  if (products.length > 15) {
    renderPagination(products.length, page);
  } else {
    document.querySelector(".pagination").classList.add("not-active");
  }
  initSpinnerAnimation();
  const productListBody = document.querySelector(".product-list-body"); 
  productListBody.innerHTML = ""; 
  paginatedProducts.forEach((product) => {
    productListBody.innerHTML += `<div class="product" data-product-id=${product._id}> 
      <div class="product-item"> 
        <img src="./assets/images/${product.image}" alt="${product.name}"> <span><img src="./assets/images/heart.png" alt="heart"></span> 
      </div> 
      <div class="product-content"> 
        <p class="product-shoe-name">${product.model || "Unknown Product"}</p> 
        <p class="product-shoe-price">$ ${product.price.toFixed(2)}</p> 
      </div> 
    </div> `; 
  }); 
  renderPagination(products.length, page); 
  setUpLikes();
  redirectToProductDetail()
} 
function renderPagination(totalItems, currentPage) { 
  const paginationContainer = document.querySelector( ".pagination .page-btn-container" ); 
  paginationContainer.innerHTML = ""; 
  if (totalItems === 0) return; 
  const totalPages = Math.ceil(totalItems / itemsPerPage); 
 
  if (currentPage > 1) { 
    const prevBtn = document.createElement("button"); 
    prevBtn.textContent = "Prev"; 
    prevBtn.classList.add("page-btn", "prev-btn"); 
    prevBtn.addEventListener("click", () => { 
      applyFilters(currentPage - 1);
    }); 
    paginationContainer.appendChild(prevBtn); 
  } 
  for (let i = 1; i <= totalPages; i++) { 
    const btn = document.createElement("button"); 
    btn.textContent = i; btn.classList.add("page-btn"); 
    if (i === currentPage) btn.classList.add("active"); 
    btn.addEventListener("click", () => { 
      applyFilters(i); 
    }); 
    paginationContainer.appendChild(btn); 
  } 
  if (currentPage < totalPages) { 
    const nextBtn = document.createElement("button"); 
    nextBtn.textContent = "Next";
    nextBtn.classList.add("page-btn", "next-btn"); 
    nextBtn.addEventListener("click", () => { 
      applyFilters(currentPage + 1); 
    }); 
    paginationContainer.appendChild(nextBtn); 
  } 
} 
document.addEventListener("DOMContentLoaded", async () => { 
  totalProducts = await fetchProducts(); 
  changeBrandFilters(totalProducts); 
  getProducts(); 
  let budgetObj = {}; 
  try { 
    budgetObj = JSON.parse(window.name || "{}"); 
  } catch { 
    budgetObj = {}; 
  } 
  let minPrice = Math.min(...totalProducts.map((p) => p.price)); 
  let maxPrice = Math.max(...totalProducts.map((p) => p.price));
  if (budgetObj.min !== undefined && budgetObj.max !== undefined) { 
    minRange.value = budgetObj.min; 
    maxRange.value = budgetObj.max; 
    priceDisplay.textContent =` ${budgetObj.min} - ${budgetObj.max}`; 
  } 
  else { 
    minRange.value = minPrice; 
    maxRange.value = maxPrice; 
    priceDisplay.textContent = `${minPrice} - ${maxPrice}`; 
  } 
  applyFilters(1); 
  minRange.addEventListener("input", () => { 
    let minVal = parseInt(minRange.value); 
    let maxVal = parseInt(maxRange.value); 
    if (minVal >= maxVal) { 
      minVal = maxVal - 1; minRange.value = minVal; 
    } 
    applyFilters(1); 
  }); 
  maxRange.addEventListener("input", () => { 
    let minVal = parseInt(minRange.value); 
    let maxVal = parseInt(maxRange.value); 
    if (maxVal <= minVal) { 
      maxVal = minVal + 1; maxRange.value = maxVal; 
    } 
    applyFilters(1); 
  }); 
  const conditionInputs = document.getElementsByName("condition"); 
  conditionInputs.forEach((conditionInput) => { 
    conditionInput.addEventListener("click", () => { 
      conditionInput.classList.toggle("active"); 
      applyFilters(1); 
    }); 
  }); 
});


const filterContainers = document.querySelectorAll(".filter-sub-container");
const brandMoreLink = document.querySelector(".brand-more-link");

function changeBrandFilters(totalProducts){ 
  filterContainers.forEach(container => {
    if(container.querySelector(".filter-title").textContent.trim() === "Brand"){
      const brandList = container.querySelector(".brand-list");
      const totalBrands = [...new Set(totalProducts.map(p => p.brand))];
      brandList.innerHTML = "";

      totalBrands.forEach((brand, index) => {  
        const div = document.createElement("div");
        div.className = "brand-filter checkbox-filter";
        if (index >= 5) div.classList.add("hidden-brand"); 
        div.innerHTML = `
          <input type="checkbox" name="brand" id="${brand}" value="${brand}">
          <label for="${brand}" class="filter-label">${brand}</label>`;
        brandList.appendChild(div);
      });

      if (totalBrands.length > 5) { 
        brandMoreLink.textContent = `${totalBrands.length - 5} More`;

        brandMoreLink.onclick = (e) => {
          e.preventDefault();
          const hiddenBrands = brandList.querySelectorAll(".hidden-brand");
          if (hiddenBrands.length > 0) {
            
            hiddenBrands.forEach(el => el.classList.remove("hidden-brand"));
            brandMoreLink.textContent = "Show Less";
          } else {
            
            brandList.querySelectorAll(".brand-filter").forEach((el, i) => {
              if (i >= 5) el.classList.add("hidden-brand");
            });
            brandMoreLink.textContent = `${totalBrands.length - 5} More`;
          }
        };
      } 
    }
  });
}

const brandSearchInput = document.querySelector(".brand-search-input");
const brandList = document.querySelector(".brand-list");
const noBrandMsg = document.querySelector(".no-brand");
brandSearchInput.addEventListener("input", () => {
  const query = brandSearchInput.value.toLowerCase();
  let matched = 0;

  brandList.querySelectorAll(".brand-filter").forEach((el) => {
    const label = el.querySelector("label").textContent.toLowerCase();
    if (label.includes(query)) {
      el.classList.remove("hidden-brand");
      matched++;
    } else {
      el.classList.add("hidden-brand");
    }
  });

  if (query === "") {
    brandList.querySelectorAll(".brand-filter").forEach((el, i) => {
      if (i >= 5) el.classList.add("hidden-brand");
    });
    brandMoreLink.classList.remove("not-active");
  } else {
    brandMoreLink.classList.add("not-active");
  }

  if (matched === 0) {
    noBrandMsg.classList.add("active");
  } else {
    noBrandMsg.classList.remove("active");
  }
});

document.addEventListener("change", (e) => {
  if (e.target.matches(".brand-filter input")) {
    applyFilters(1);
  }
});

function setUpLikes(){
  const productLikeBtns=document.querySelectorAll(".product .product-item span")
  productLikeBtns.forEach(productLikeBtn=>{
    productLikeBtn.addEventListener('click',(e)=>{
      e.preventDefault();
      const likeImg=productLikeBtn.querySelector("img");
    
      if(likeImg.alt=="likes"){
        likeImg.src="./assets/images/heart.png"
        likeImg.alt="heart"
      }
      else{
        likeImg.src="./assets/images/likes.png"
        likeImg.alt="likes"
      }
    })
  })
}

function redirectToProductDetail(){
  const productItems=document.querySelectorAll('.product-item > img')
  productItems.forEach(productItem=>{
  productItem.addEventListener('click', (e) => {
  const product = e.target.closest('div[data-product-id]');
  const id=product.getAttribute("data-product-id");
  if (!id) return; 

    window.name=id;
    setTimeout(() => {
      window.location.href = "./product-detail.html";
    }, 0);
  })
});
}

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
initSpinnerAnimation();

const filterBtn = document.querySelector(".filter-btn"); 
const filterContainer = document.querySelector(".filter-container"); 
const filterClostBtn = document.querySelector(".filter-close-btn"); 

filterBtn.addEventListener("click", () => { 
  filterContainer.classList.add("active"); 

  filterClostBtn.classList.add("active");
  setTimeout(()=>{
    body.classList.add("not-active");
  }, 500)
  

}); 
filterClostBtn.addEventListener("click", () => { 
  filterContainer.classList.remove("active"); 
  filterClostBtn.classList.remove("active"); 
  body.classList.remove("not-active");
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

  if (minVal > 900) {
    minVal = 901;
    minRange.value = 901;
  }

  if (minVal >= maxVal) {
    minVal = maxVal - 1;

    if (minVal < parseInt(minRange.min)) {
      minVal = parseInt(minRange.min);
    }

    minRange.value = minVal;
  }

  if (maxVal <= minVal) {
    maxVal = minVal + 1;

    if (maxVal > parseInt(maxRange.max)) {
      maxVal = parseInt(maxRange.max);
    }

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
  const checkedBrands = Array.from(document.querySelectorAll(".brand-filter input:checked")).map((input) => input.value);

  if (checkedBrands.length > 0) {
    filtered = filtered.filter((p) => checkedBrands.includes(p.brand));
  }
  const checkedModels = Array.from(document.querySelectorAll(".model-filter input:checked")).map((input) => input.value);

  if (checkedModels.length > 0) {
    filtered = filtered.filter((p) => checkedModels.includes(p.model));
  }
  const checkedyears = Array.from(document.querySelectorAll(".year-filter input:checked")).map((input) => input.value);

  if (checkedyears.length > 0) {
    filtered = filtered.filter((p) => checkedyears.includes(p.release_year));
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
  
  const productListBody = document.querySelector(".product-list-body"); 
  productListBody.innerHTML = ""; 
  paginatedProducts.forEach((product) => {
    productListBody.innerHTML += `<div class="product" data-product-id=${product._id}> 
      <div class="product-item"> 
        <img src="./assets/images/${product.image}" alt="${product.model}"> <span><img src="./assets/images/heart.png" alt="heart"></span> 
      </div> 
      <div class="product-content"> 
        <p class="product-shoe-name">${product.model || "Unknown Product"}</p> 
        <p class="product-shoe-price">$ ${Number(product.price).toFixed(2)}</p> 
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
  changeModelFilters(totalProducts);
  changeYearFilters(totalProducts);
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
  setdropDownHeight();
});


/*Brand Search*/
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
          const parentContainer = brandList.closest(".filter-dropdown-container");
          if (hiddenBrands.length > 0) {
            
            hiddenBrands.forEach(el => el.classList.remove("hidden-brand"));
            brandMoreLink.textContent = "Show Less";
          } else {
            
            brandList.querySelectorAll(".brand-filter").forEach((el, i) => {
              if (i >= 5) el.classList.add("hidden-brand");
            });
            brandMoreLink.textContent = `${totalBrands.length - 5} More`;
          }
          if (parentContainer) {
            parentContainer.style.maxHeight = parentContainer.scrollHeight + "px";
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




/*Model Search*/

const modelMoreLink = document.querySelector(".model-more-link");

function changeModelFilters(totalProducts){ 
  filterContainers.forEach(container => {
    if(container.querySelector(".filter-title").textContent.trim() === "Model"){
      const modelList = container.querySelector(".model-list");
      const totalModels = [...new Set(totalProducts.map(p => p.model))];
      modelList.innerHTML = "";

      totalModels.forEach((model, index) => {  
        const div = document.createElement("div");
        div.className = "model-filter checkbox-filter";
        if (index >= 5) div.classList.add("hidden-model"); 
        div.innerHTML = `
          <input type="checkbox" name="model" id="${model}" value="${model}">
          <label for="${model}" class="filter-label">${model}</label>`;
        modelList.appendChild(div);
      });

      if (totalModels.length > 5) { 
        modelMoreLink.textContent = `${totalModels.length - 5} More`;

        modelMoreLink.onclick = (e) => {
          e.preventDefault();
          const hiddenModels = modelList.querySelectorAll(".hidden-model");
          const parentContainer = modelList.closest(".filter-dropdown-container");
          if (hiddenModels.length > 0) {
            
            hiddenModels.forEach(el => el.classList.remove("hidden-model"));
            modelMoreLink.textContent = "Show Less";
          } else {
            
            modelList.querySelectorAll(".model-filter").forEach((el, i) => {
              if (i >= 5) el.classList.add("hidden-model");
            });
            modelMoreLink.textContent = `${totalModels.length - 5} More`;
          }
           if (parentContainer) {
            parentContainer.style.maxHeight = parentContainer.scrollHeight + "px";
          }
        };
      } 
    }
  });
}


const modelSearchInput = document.querySelector(".model-search-input");
const modelList = document.querySelector(".model-list");
const noModelMsg = document.querySelector(".no-model");
modelSearchInput.addEventListener("input", () => {
  const query = modelSearchInput.value.toLowerCase();
  let matched = 0;

  modelList.querySelectorAll(".model-filter").forEach((el) => {
    const label = el.querySelector("label").textContent.toLowerCase();
    if (label.includes(query)) {
      el.classList.remove("hidden-model");
      matched++;
    } else {
      el.classList.add("hidden-model");
    }
  });

  if (query === "") {
    modelList.querySelectorAll(".model-filter").forEach((el, i) => {
      if (i >= 5) el.classList.add("hidden-model");
    });
    modelMoreLink.classList.remove("not-active");
  } else {
    modelMoreLink.classList.add("not-active");
  }

  if (matched === 0) {
    noModelMsg.classList.add("active");
  } else {
    noModelMsg.classList.remove("active");
  }
});





/* release year*/

const yearMoreLink = document.querySelector(".year-more-link");

function changeYearFilters(totalProducts){ 
  filterContainers.forEach(container => {
    if(container.querySelector(".filter-title").textContent.trim() === "Release Year"){
      const yearList = container.querySelector(".year-list");
      let totalYears = [...new Set(totalProducts.map(p => p.release_year))];
      totalYears=totalYears.sort((a,b)=>a-b)
      yearList.innerHTML = "";

      totalYears.forEach((release_year, index) => {  
        const div = document.createElement("div");
        div.className = "year-filter checkbox-filter";
        if (index >= 5) div.classList.add("hidden-year"); 
        div.innerHTML = `
          <input type="checkbox" name="year" id="${release_year}" value="${release_year}">
          <label for="${release_year}" class="filter-label">${release_year}</label>`;
        yearList.appendChild(div);
      });
      if (totalYears.length > 5) { 
        yearMoreLink.textContent = `${totalYears.length - 5} More`;

        yearMoreLink.onclick = (e) => {
          e.preventDefault();
          const parentContainer = yearList.closest(".filter-dropdown-container");
          if(totalYears.length - 5 == 0){
            yearMoreLink.classList.add("not-active")
          }
          else if (totalYears.length - 5 == 1) {
            const hiddenYear = yearList.querySelector(".hidden-year");

            if (yearMoreLink.textContent.includes("More")) {
            
              hiddenYear.classList.remove("hidden-year");
              yearMoreLink.textContent = "Show Less";
            } else {
              
              yearList.querySelectorAll(".year-filter").forEach((el, i) => {
                if (i > 4) el.classList.add("hidden-year");
              });
              yearMoreLink.textContent = `${totalYears.length - 5} More`;
            }
          }

          else{
            const hiddenYears = yearList.querySelectorAll(".hidden-year");
            if (hiddenYears.length > 0) {
              
              hiddenYears.forEach(el => el.classList.remove("hidden-year"));
              yearMoreLink.textContent = "Show Less";
            } else {
              
              yearList.querySelectorAll(".year-filter").forEach((el, i) => {
                if (i >= 5) el.classList.add("hidden-year");
              });
              yearMoreLink.textContent = `${totalYears.length - 5} More`;
            }
          }
           if (parentContainer) {
            parentContainer.style.maxHeight = parentContainer.scrollHeight + "px";
          }
        };
      } 
    }
  });
}



document.addEventListener("change", (e) => {
  if (e.target.matches(".brand-filter input")) {
    applyFilters(1);
  }
  else if (e.target.matches(".model-filter input")) {
    applyFilters(1);
  }
  else if (e.target.matches(".year-filter input")) {
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
  const productItems=document.querySelectorAll('.product-item > img');
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
const filterHeaders=document.querySelectorAll(".filter-sub-header-container")

filterHeaders.forEach(header => {
  header.addEventListener("click", (e) => {
    const container = header.nextElementSibling;
    if (!container || !container.classList.contains("filter-dropdown-container")) return;

    const icon = header.querySelector(".dropdown-icon");
    const key = header.getAttribute("data-key");

    if (container.classList.contains(key)) {
      if (container.classList.contains("hidden")) {
        container.classList.remove("hidden");
        requestAnimationFrame(() => {
          container.style.maxHeight = container.scrollHeight + "px";
          icon.src = "./assets/images/up-arrow.png";
        });
      } else {
        container.style.maxHeight = "0px";
        container.classList.add("hidden");
        icon.src = "./assets/images/down-arrow.png";
      }
    }
  e.stopPropagation();
  });

});

document.querySelectorAll(
  ".brand-list, .model-list, .year-list"
).forEach(list => {
  list.addEventListener("click", (e) => {
    e.stopPropagation();
  });
})

function setdropDownHeight(){
  document.querySelectorAll(".filter-dropdown-container").forEach(dropdown => {
    dropdown.style.maxHeight = dropdown.scrollHeight + "px"; 
  });
}

window.addEventListener('resize',setdropDownHeight())
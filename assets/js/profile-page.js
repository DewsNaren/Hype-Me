let rowsPerPage = 15; 
let currentPage = 1;
let products = []; 

const productListBody = document.querySelector(".product-list-body");
const paginationContainer = document.querySelector(".pagination");
const headerTitle = document.querySelector(".product-list-header h2");

function renderProducts() {
  productListBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentProducts = products.slice(start, end);

  currentProducts.forEach(prod => {
    productListBody.innerHTML += `
      <div class="product">
        <div class="product-item">
          <img src="./assets/images/${prod.image}" alt="${prod.model}">
          <span><img src="./assets/images/heart.png" alt="heart"></span>
        </div>
        <div class="product-content">
          <p class="product-shoe-name">${prod.model}</p>
          <p class="product-shoe-price">$ ${prod.price.toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  headerTitle.textContent = `Published Products (${products.length})`;
}

function renderPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(products.length / rowsPerPage);

  if (currentPage > 1) {
    paginationContainer.innerHTML += `<button class="prev">Prev</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
      <button class="page ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>
    `;
  }

  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<button class="next">Next</button>`;
  }

  document.querySelectorAll(".pagination button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("prev") && currentPage > 1) {
        currentPage--;
      } else if (btn.classList.contains("next") && currentPage < totalPages) {
        currentPage++;
      } else if (btn.dataset.page) {
        currentPage = parseInt(btn.dataset.page);
      }
      renderProducts();
      renderPagination();
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  products = await fetchProducts(); 
  renderProducts();
  renderPagination();
  setUpLikes();
});


const followBtn = document.querySelector(".product-list-container .follow-btn");

followBtn.addEventListener("click", () => {
  if(followBtn.childNodes[2].textContent === "Follow") {
    followBtn.childNodes[2].textContent = "Following";
  } else {
    followBtn.childNodes[2].textContent = "Follow";
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




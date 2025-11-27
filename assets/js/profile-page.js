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

  currentProducts.forEach((prod) => {
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
      <button class="page ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>
    `;
  }

  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<button class="next">Next</button>`;
  }

  document.querySelectorAll(".pagination button").forEach((btn) => {
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
  const token = localStorage.getItem("token");
  if (token && token.trim() !== "") {
    const followImg = followBtn.querySelector("img");
    if (followBtn.childNodes[2].textContent === "Follow") {
      followBtn.childNodes[2].textContent = "Following";
      followBtn.style.backgroundColor = "rgba(26, 110, 27, 1)";

      followImg.src = "./assets/images/following.png";
    } else {
      followBtn.childNodes[2].textContent = "Follow";
      followImg.src = "./assets/images/followers.png";
      followBtn.style.backgroundColor = "rgb(87, 24, 190)";
    }
  } else {
    lockBody();
    overlayContainer.classList.add("active");
    requestAnimationFrame(() => {
      loginContainer.classList.add("active");
    });
    setupForms();
  }
});

function setUpLikes() {
  const productLikeBtns = document.querySelectorAll(
    ".product .product-item span"
  );
  productLikeBtns.forEach((productLikeBtn) => {
    productLikeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (token) {
        const likeImg = productLikeBtn.querySelector("img");

        if (likeImg.alt == "likes") {
          likeImg.src = "./assets/images/heart.png";
          likeImg.alt = "heart";
        } else {
          likeImg.src = "./assets/images/likes.png";
          likeImg.alt = "likes";
        }
      } else {
        lockBody();
        overlayContainer.classList.add("active");
        requestAnimationFrame(() => {
          loginContainer.classList.add("active");
        });
        setupForms();
      }
    });
  });
}

function renderProductDetail(product) {
  const selected = document.querySelector(
    ".main-container .product-detail-container .product-container-wrapper .breadcrumb .selected"
  );
  if (product) {
    selected.textContent = product.model;

    const mainImgContainer = document.querySelector(".main-image-container");
    mainImgContainer.innerHTML = "";

    mainImgContainer.innerHTML = `<img src="./assets/images/${product.image}" alt="${product.model}" class="main-image">`;
    const priceEl = document.querySelector(".price");
    priceEl.textContent = `$${product.price}.00`;

    const modelEl = document.querySelector(".selected-shoe-name");
    modelEl.textContent = product.model;

    const specsTableBody = document.querySelector(".details-table tbody");
    const thumbnailRow = document.querySelector(".thumbnail-row");
    thumbnailRow.innerHTML = "";
    thumbnailRow.innerHTML = `
  <div class="thumb-wrapper thumb1"><img src="./assets/images/${product.image}" alt="Thumb1"></div>
  <div class="thumb-wrapper thumb2 active"><img src="./assets/images/${product.image}" alt="Thumb2"></div>
  <div class="thumb-wrapper thumb3"><img src="./assets/images/${product.image}" alt="Thumb3"></div>
  <div class="thumb-wrapper thumb4"><img src="./assets/images/${product.image}" alt="Thumb4"></div>
`;

    specsTableBody.innerHTML = "";
    specsTableBody.innerHTML = `
    <tr><td class="spec-name">Brand</td><td class="spec-value">${
      product.brand || "N/A"
    }</td></tr>
    <tr><td class="spec-name">Model</td><td class="spec-value">${
      product.model || "N/A"
    }</td></tr>
    <tr><td class="spec-name">Color</td><td class="spec-value">${
      product.color || "N/A"
    }</td></tr>
    <tr><td class="spec-name">Size Type</td><td class="spec-value">${
      product.size_type || "N/A"
    }</td></tr>
    <tr class="hidden"><td class="spec-name ">Size</td><td class="spec-value">${
      product.size || "N/A"
    }</td></tr>
    <tr class="hidden"><td class="spec-name">Release Year</td><td class="spec-value">${
      product.release_year || "N/A"
    }</td></tr>
    <tr class="hidden"><td class="spec-name">Wide/Normal</td><td class="spec-value">${
      product.wide_normal || "--"
    }</td></tr>
  `;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  getSelectedProduct(products);
  shareImage();
  viewMore.addEventListener("click", (e) => {
    e.preventDefault();
    showAdditionalDatas();
  });
});

const productId = sessionStorage.getItem("productId");
function getSelectedProduct(products) {
  const product = products.find((p) => p._id === productId);
  if (product) {
    renderProductDetail(product);
    activeImage();
    const similarProducts = getProduct(product);
    renderSimilarProducts(similarProducts);
  } else {
    renderSimilarProducts(products);
  }

  activeImage();
}

function activeImage() {
  const mainImg = document.querySelector(".main-image");
  const wrappers = document.querySelectorAll(".thumbnail-row .thumb-wrapper");

  wrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", () => {
      wrappers.forEach((w) => w.classList.remove("active"));
      wrapper.classList.add("active");

      const img = wrapper.querySelector("img");
      mainImg.src = img.src;

      mainImg.classList.remove("thumb1", "thumb2", "thumb3", "thumb4");

      wrapper.classList.forEach((cls) => {
        if (cls.startsWith("thumb") && cls !== "thumb-wrapper") {
          mainImg.classList.add(cls);
        }
      });
    });
  });
}

const selectedProductLikeBtn = document.querySelector(
  ".product-detail-container .product-container-wrapper .product-header-container .icon-group .like-btn"
);

selectedProductLikeBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token) {
    const likeImg = selectedProductLikeBtn.querySelector("img");

    if (likeImg.alt == "likes") {
      likeImg.src = "./assets/images/heart-white.png";
      likeImg.alt = "heart-white";
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

const viewMore = document.querySelector(".product-specs .view-more a");

function showAdditionalDatas() {
  const tableRows = document.querySelectorAll(".details-table tr");
  if (viewMore.textContent == "View More") {
    tableRows.forEach((row) => {
      row.classList.remove("hidden");
    });
    viewMore.textContent = "View Less";
  } else {
    viewMore.textContent = "View More";
    tableRows.forEach((row, i) => {
      if (i > 3) {
        row.classList.add("hidden");
      }
    });
  }
}

// const productReadMoreBtn = document.querySelector(
//   ".product-description-container .product-description .read-more"
// );
// const productDescription = document.querySelector(
//   ".product-description-container .product-description p"
// );

// productReadMoreBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   if (productReadMoreBtn.textContent == "Read More") {
//     productDescriptions.forEach((p) => {
//       p.classList.remove("hidden");
//     });
//     productReadMoreBtn.textContent = "Read Less";
//   } else {
//     productReadMoreBtn.textContent = "Read More";
//     productDescriptions.forEach((p, i) => {
//       if (i > 0) {
//         p.classList.add("hidden");
//       }
//     });
//   }
// });

// const para = document.querySelector(".product-description-container p");
// const extraText = para.querySelector(".extra-text");
// const btn = para.querySelector(".read-more");

const para = document.querySelector(".product-description-container p");
const extra = para.querySelector(".extra-text");
const readMore = para.querySelector(".read-more");

readMore.onclick = e => {
  e.preventDefault();

  if (!extra.classList.contains("show")) {
    extra.classList.add("show");
    readMore.classList.add("expanded");
    para.appendChild(readMore);
    readMore.textContent = "Read Less";
  } else {
    extra.classList.remove("show");
    readMore.classList.remove("expanded");
    extra.insertAdjacentElement("afterend", readMore);
    readMore.textContent = "Read More";
  }
};


const sellerName = document.querySelector(
  ".product-container-wrapper .product-info .selected-product-wrapper .selected-product-detail .seller-info .seller-name"
);

sellerName.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token && token.trim() !== "") {
    window.location.href = "./profile-page.html";
  } else {
    lockBody();
    overlayContainer.classList.add("active");
    requestAnimationFrame(() => {
      loginContainer.classList.add("active");
    });
    setupForms();
  }
});

const shareBtn = document.querySelector(
  ".product-detail-container .product-container-wrapper .product-header-container .icon-group .share-btn"
);

const mainImgContainer = document.querySelector(".main-image-container");

async function shareImage() {
  const mainImg = mainImgContainer.querySelector(".main-image");
  shareBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (token && token.trim() !== "") {
      const fullSrc = mainImg.src;

      const imageUrl = fullSrc.replace(/^https?:\/\/[^\/]+/, "");
      const title = mainImg.alt;

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const fileName = imageUrl.split("/").pop();
        const file = new File([blob], fileName, { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text: title,
            files: [file],
          });
        } else {
          console.warn("Sharing not supported on this browser or context.");
        }
      } catch (error) {
        console.error("Error while sharing image:", error);
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
}

const selectedRating = document.querySelector(".selected-product-review p");

if (sessionStorage.getItem("totalReviews")) {
  selectedRating.innerHTML = `${sessionStorage.getItem(
    "totalReviews"
  )} Reviews | <a href="#">Write a review</a>`;
}

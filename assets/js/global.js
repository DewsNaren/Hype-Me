window.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();

  renderSlider(products);
  if (window.name == "openForm") {
    overlayContainer.classList.add("active");
    loginContainer.classList.add("active");
    setupForms();
    lockBody();
    window.name = "";
  }
});

function renderSlider(products) {
  const container = document.querySelector(".recent-slider-container");
  container.innerHTML = "";
  products.forEach((product, index) => {
    let slider = `
      <div class="recent-slider" >
        <div class="recent-slider-item" >
        <a  href="./product-detail.html" data-product-id="${
          product._id
        }" data-product-img="./assets/images/${
      product.image
    }" class="product-link">
          <img src="./assets/images/${product.image}" alt="shoe-${index + 1}">
        </a>

          <span><img src="./assets/images/heart.png" alt="heart"></span>
        </div>
        <div class="recent-slider-content">
          <p class="recent-shoe-name">${product.model}</p>
          <p class="recent-shoe-price">$${product.price}.00</p>
        </div>
      </div>`;
    container.innerHTML += slider;
  });

  initRecentSlider();
  setupLikeBtns();
}

function initRecentSlider() {
  const container = document.querySelector(".recent-slider-container");
  const prevBtn = document.querySelector(".recent-slider-btn.prev");
  const nextBtn = document.querySelector(".recent-slider-btn.next");
  const indicator = document.querySelector(
    ".recent-slider-indicator-container .inner"
  );
  const outer = document.querySelector(
    ".recent-slider-indicator-container .outer"
  );

  let slides = [...container.querySelectorAll(".recent-slider")];

  container
    .querySelectorAll(".recent-slider.clone")
    .forEach((clone) => clone.remove());

  function calculateGap() {
    return window.innerWidth <= 1024 ? 20 : window.innerWidth * 0.0208334;
  }

  slides.forEach((slide) => {
    const startClone = slide.cloneNode(true);
    const endClone = slide.cloneNode(true);
    startClone.classList.add("clone");
    endClone.classList.add("clone");
    container.prepend(startClone);
    container.append(endClone);
  });

  let gap = calculateGap();
  requestAnimationFrame(() => {
    const allSlides = [...container.querySelectorAll(".recent-slider")];
    let slideWidth = allSlides[0].getBoundingClientRect().width + gap;
    let currentIndex = slides.length;
    let isTransitioning = false;

    const originalCount = slides.length;
    function moveIndicator(index) {
      const relativeIndex =
        ((index % originalCount) + originalCount) % originalCount;
      const step =
        (outer.offsetWidth - indicator.offsetWidth) / (originalCount - 1);
      indicator.style.transition = "transform 0.6s ease-in-out";
      indicator.style.transform = `translateX(${relativeIndex * step}px)`;
    }

    function updateSlide(index, animate = true) {
      container.style.transition = animate
        ? "transform 0.6s ease-in-out"
        : "none";
      container.style.transform = `translateX(${-index * slideWidth}px)`;
      moveIndicator(index);
    }

    updateSlide(currentIndex, false);

    function goToSlide(next = true) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex += next ? 1 : -1;
      updateSlide(currentIndex);
    }

    function handleTransitionEnd() {
      isTransitioning = false;
      const total = allSlides.length;

      if (currentIndex >= total - originalCount) {
        currentIndex = originalCount;
        updateSlide(currentIndex, false);
      } else if (currentIndex < originalCount) {
        currentIndex = total - originalCount - 1;
        updateSlide(currentIndex, false);
      }
    }

    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));

    const newPrevBtn = document.querySelector(".recent-slider-btn.prev");
    const newNextBtn = document.querySelector(".recent-slider-btn.next");

    newPrevBtn.addEventListener("click", () => goToSlide(false));
    newNextBtn.addEventListener("click", () => goToSlide(true));
    container.addEventListener("transitionend", handleTransitionEnd);

    window.addEventListener("resize", () => {
      gap = calculateGap();
      slideWidth = allSlides[0].getBoundingClientRect().width + gap;
      updateSlide(currentIndex, false);
    });
  });
}

function setupLikeBtns() {
  const overlayContainer = document.querySelector(".overlay");
  const body = document.body;
  const overlayCloseBtns = document.querySelectorAll(".overlay-close-btn");

  const likeBtns = document.querySelectorAll(
    ".recent-slider .recent-slider-item span"
  );
  const loginContainer = overlayContainer.querySelector(".login-container");

  likeBtns.forEach((likeBtn) => {
    likeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (token && token.trim() !== "") {
        const likeBtnImg = likeBtn.querySelector("img");
        if (likeBtnImg.src.includes("liked-heart.png")) {
          likeBtnImg.src = "./assets/images/heart.png";
          likeBtnImg.alt = "heart";
        } else {
          likeBtnImg.src = "./assets/images/liked-heart.png";
          likeBtnImg.alt = "liked-heart";
        }
        return;
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
  overlayCloseBtns.forEach((overlayCloseBtn) => {
    overlayCloseBtn.addEventListener("click", () => {
      closeOverlay();
    });
  });
}

document
  .querySelector(".recent-slider-container")
  .addEventListener("click", (e) => {
    const link = e.target.closest("a[data-product-id]");

    if (!link) return;

    e.preventDefault();

    const productId = link.dataset.productId;
    sessionStorage.setItem("productId", productId);
    setTimeout(() => {
      window.location.href = "./product-detail.html";
    }, 0);
  });

const viewAll = document.querySelector(
  ".recently-posted .recent-slider-indicator-container .view-all"
);

viewAll.addEventListener("click", (e) => {
  e.preventDefault();
  const userToken = localStorage.getItem("token");
  if (!userToken) {
    openLogIn();
  } else {
    window.name = "";
    window.location.href = viewAll.href;
  }
});

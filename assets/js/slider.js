function getProduct(mainProduct){
  
  const mainPrice=mainProduct.price
  const similarProducts = allProducts.filter(product => {
    return product._id !== mainProduct._id && 
      product.price >= mainPrice - 100 &&
      product.price <= mainPrice + 100;
  });
  return similarProducts;
}

function renderSimilarProducts(similarProducts) {
  const products=similarProducts;
  const container = document.querySelector('.recent-slider-container');
  container.innerHTML = '';
  products.forEach((product, index) => {
    let slider=`
      <div class="recent-slider" >
        <div class="recent-slider-item" >
        <a href="./product-detail.html" data-product-id="${product._id}"">
          <img src="./assets/images/${product.image}" alt="shoe-${index + 1}">
        </a>

          <span><img src="./assets/images/heart.png" alt="heart"></span>
        </div>
        <div class="recent-slider-content">
          <p class="recent-shoe-name">${product.model}</p>
          <p class="recent-shoe-price">$${product.price}.00</p>
        </div>
      </div>`;
      container.innerHTML+=slider;
  });
  initRecentSlider();
  const likeBtns = document.querySelectorAll(".recent-slider .recent-slider-item span");
  if(likeBtns){
    setUpLikes()
  }
}

function setUpLikes(){
  const likeBtns = document.querySelectorAll(".recent-slider .recent-slider-item span");
  likeBtns.forEach(likeBtn => {
    likeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const token=localStorage.getItem("token")
      if(token && token.trim() !== "" ){
        const likeBtnImg=likeBtn.querySelector("img");
        if (likeBtnImg.src.includes("liked-heart.png")) {
          likeBtnImg.src = "./assets/images/heart.png";
          likeBtnImg.alt = "heart";
        } else {
          likeBtnImg.src = "./assets/images/liked-heart.png";
          likeBtnImg.alt = "liked-heart";
        }
        return;
      }
      else{
        window.name="openForm"
        window.location.href="./index.html"
      }
      
    });
  });
}

function initRecentSlider() {
  const container = document.querySelector('.recent-slider-container');
  const prevBtn = document.querySelector('.recent-slider-btn.prev');
  const nextBtn = document.querySelector('.recent-slider-btn.next');

  let slides = [...container.querySelectorAll('.recent-slider')];
  container.querySelectorAll('.recent-slider.clone').forEach(clone => clone.remove());

  function calculateGap() {
    return (window.innerWidth < 1024) ? 20 : window.innerWidth * 0.0208334;
  }

  slides.forEach(slide => {
    const startClone = slide.cloneNode(true);
    const endClone = slide.cloneNode(true);
    startClone.classList.add('clone');
    endClone.classList.add('clone');
    container.prepend(startClone);
    container.append(endClone);
  });

  let gap = calculateGap();

  requestAnimationFrame(() => {
    const allSlides = [...container.querySelectorAll('.recent-slider')];

    let slideWidth = allSlides[0].getBoundingClientRect().width + gap;
    let currentIndex = slides.length;
    let isTransitioning = false;
    let firstVisit = true; 

    function updateSlide(index, animate = true) {
      container.style.transition = animate ? 'transform 0.6s ease-in-out' : 'none';
      container.style.transform = `translateX(${-index * slideWidth}px)`;
    }

    updateSlide(currentIndex, false);

    function goToSlide(next = true) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex += next ? 1 : -1;
      updateSlide(currentIndex, true);

      if (firstVisit) {   
        prevBtn.classList.add('active');
        prevBtn.removeAttribute("disabled")
        firstVisit = false;      
      }
    }
    
    function goToSlide(next = true) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex += next ? 1 : -1;
      updateSlide(currentIndex);
    }
    let startX = 0;
    let startY = 0;
    const swipeThreshold = 5;
    let isDragging = false;

    function getEventX(e) {
      return e.type.includes("mouse") ? e.pageX : e.changedTouches[0].screenX;
    }

    function getEventY(e) {
      return e.type.includes("mouse") ? e.pageY : e.changedTouches[0].screenY;
    }

    function swipeStart(e) {
      startX = getEventX(e);
      startY = getEventY(e);
      isDragging = true;
      container.style.userSelect = "none";
    
    //   container.querySelectorAll("a").forEach(a => {
    //    e.preventDefault();
    //   a.style.cursor="default"
    // });
    }

    function swipeMove(e) {
      if (!isDragging) return;
    }

    function swipeEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      let endX = getEventX(e);
      let distX = endX - startX;
      container.style.userSelect = ""; 

      if (distX > swipeThreshold) goToSlide(false);
      else if (distX < -swipeThreshold) goToSlide(true);
      //  container.querySelectorAll("a").forEach(a => {
      //    e.preventDefault();
      //   a.style.cursor="pointer"
      // });

    }

    container.addEventListener("touchstart", swipeStart);
    container.addEventListener("touchmove", swipeMove);
    container.addEventListener("touchend", swipeEnd);

    container.addEventListener("mousedown", swipeStart);
    container.addEventListener("mouseup", swipeEnd);
    container.addEventListener("mouseleave", swipeEnd);
    function handleTransitionEnd() {
      isTransitioning = false;
      const total = allSlides.length;
      const originalCount = slides.length;

      if (currentIndex >= total - originalCount) {
        currentIndex = originalCount;
        updateSlide(currentIndex, false);
      } else if (currentIndex < originalCount) {
        currentIndex = total - originalCount - 1;
        updateSlide(currentIndex, false);
      }
    }

    prevBtn.addEventListener('click', () => goToSlide(false));
    nextBtn.addEventListener('click', () => goToSlide(true));

    container.addEventListener('transitionend', handleTransitionEnd);

    window.addEventListener('resize', () => {
      gap = calculateGap();
      slideWidth = allSlides[0].getBoundingClientRect().width + gap;
      updateSlide(currentIndex, false);
    });
  });
}


const prevBtn = document.querySelector('.recent-slider-btn.prev');

document.querySelector('.recent-slider-container').addEventListener('click', (e) => {
  const link = e.target.closest('a[data-product-id]');

  if (!link) return; 

  e.preventDefault(); 

  const productId = link.dataset.productId;
  history.pushState({ productId: productId }, '', './product-detail.html');
  setTimeout(() => {
    window.location.href = link.href;
  }, 0);
});


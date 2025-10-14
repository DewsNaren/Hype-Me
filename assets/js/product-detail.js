function renderProductDetail(product){
  const mainImgContainer = document.querySelector('.main-image-container');
  mainImgContainer.innerHTML="";

  mainImgContainer.innerHTML=`<img src="./assets/images/${product.image}" alt="${product.model}" class="main-image">`;
  const priceEl = document.querySelector('.price');
  priceEl.textContent = `$${product.price}.00`;

  const modelEl = document.querySelector('.selected-shoe-name');
  modelEl.textContent = product.model;

  const specsTableBody = document.querySelector('.details-table tbody');
  const thumbnailRow=document.querySelector(".thumbnail-row");
  thumbnailRow.innerHTML = `
  <div class="thumb-wrapper thumb1"><img src="./assets/images/${product.image}" alt="Thumb1"></div>
  <div class="thumb-wrapper thumb2 active"><img src="./assets/images/${product.image}" alt="Thumb2"></div>
  <div class="thumb-wrapper thumb3"><img src="./assets/images/${product.image}" alt="Thumb3"></div>
  <div class="thumb-wrapper thumb4"><img src="./assets/images/${product.image}" alt="Thumb4"></div>
`;


  specsTableBody.innerHTML = `
    <tr><td class="spec-name">Brand</td><td class="spec-value">${product.brand || 'N/A'}</td></tr>
    <tr><td class="spec-name">Model</td><td class="spec-value">${product.model || 'N/A'}</td></tr>
    <tr><td class="spec-name">Color</td><td class="spec-value">${product.color || 'N/A'}</td></tr>
    <tr><td class="spec-name">Size</td><td class="spec-value">${product.size_type || 'N/A'}</td></tr>
    <tr class="hidden"><td class="spec-name ">Size</td><td class="spec-value">${product.size || 'N/A'}</td></tr>
    <tr class="hidden"><td class="spec-name">Release Year</td><td class="spec-value">${product.release_year || 'N/A'}</td></tr>
    <tr class="hidden"><td class="spec-name">Wide/Normal</td><td class="spec-value">${product.wide_normal || '--'}</td></tr>
  `;
}

window.addEventListener('DOMContentLoaded', async () => {
  const products=await fetchProducts();
  getSelectedProduct(products);
  viewMore.addEventListener('click',(e)=>{
    e.preventDefault();
    showAdditionalDatas();
  })
});

const productId=window.name;

function getSelectedProduct(products){
  const product = products.find(p => p._id === productId);
  renderProductDetail(product);
  activeImage();
  const similarProducts = getProduct(product);
  renderSimilarProducts(similarProducts);
}


function activeImage() {
  const mainImg = document.querySelector('.main-image');
  const wrappers = document.querySelectorAll('.thumbnail-row .thumb-wrapper');

  wrappers.forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      wrappers.forEach(w => w.classList.remove('active'));
      wrapper.classList.add('active');

      const img = wrapper.querySelector('img');
      mainImg.src = img.src;

      mainImg.classList.remove("thumb1", "thumb2", "thumb3", "thumb4");

      wrapper.classList.forEach(cls => {
        if (cls.startsWith('thumb') && cls !== 'thumb-wrapper') {
          mainImg.classList.add(cls);
        }
      });
    });
  });
}


const buyBtn=document.querySelector(".product-info .selected-product-wrapper .buy-now-btn");

buyBtn.addEventListener('click',()=>{
  window.location.href="./chat.html"
})

const selectedProductLikeBtn=document.querySelector(".product-detail-container .product-container-wrapper .product-header-container .icon-group .like-btn")

selectedProductLikeBtn.addEventListener('click',()=>{
  const token=sessionStorage.getItem("token")
  if(token){
    const likeImg=selectedProductLikeBtn.querySelector("img");
  
    if(likeImg.alt=="likes"){
      likeImg.src="./assets/images/heart-white.png"
      likeImg.alt="heart-white"
    }
    else{
      likeImg.src="./assets/images/likes.png"
      likeImg.alt="likes"
    }
  }
  else{ 
    window.name="openForm"
    window.location.href="./index.html"
  }
})


const viewMore=document.querySelector(".product-specs .view-more a");

function showAdditionalDatas(){
  const tableRows=document.querySelectorAll(".details-table tr");
  if(viewMore.textContent=="View More"){
    tableRows.forEach(row=>{
      row.classList.remove("hidden");
    })
    viewMore.textContent="View Less"
  }
  else{
    viewMore.textContent="View More"
    tableRows.forEach((row,i)=>{
      if(i>3){
        row.classList.add("hidden");
      }
      
    })
  }
}

const productReadMoreBtn=document.querySelector(".product-description-container .product-description .read-more");
const productDescriptions=document.querySelectorAll(".product-description-container .product-description p")

productReadMoreBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  if(productReadMoreBtn.textContent=="Read More"){
    productDescriptions.forEach(p=>{
      p.classList.remove("hidden");
    })
    productReadMoreBtn.textContent="Read Less"
  }
  else{
    productReadMoreBtn.textContent="Read More"
    productDescriptions.forEach((p,i)=>{
      if(i>0){
        p.classList.add("hidden");
      }
      
    })
  }
})
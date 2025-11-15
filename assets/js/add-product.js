const addProductContainerCloseBtn=document.querySelector(".main-container .close-btn-container .close-btn");

addProductContainerCloseBtn.addEventListener('click',()=>{
  window.name = JSON.stringify(savedProducts);
  window.location.href="./sell-your-products.html"
})

const modalCloseBtns=document.querySelectorAll(".modal-container .modal-close-btn");
const productModalContainer=document.querySelector(".product-modal-container");
const modalContainers=document.querySelectorAll(".modal-container");

const saveProductsBtn=document.querySelector(".add-product-outer-container .save-btn-container .save-btn");
const submitProductsBtn=document.querySelector(".add-product-outer-container .save-btn-container .submit-btn");

const productModalContent = document.querySelector('.product-modal-content');
const body=document.body;

let savedProducts = [];
try {
  savedProducts = JSON.parse(window.name || "[]");
} catch {
  savedProducts = [];
}

function closeModal(){
  modalContainers.forEach(modalContainer=>{
    modalContainer.classList.remove("active");
    body.classList.remove("not-active");
  })
}
productModalContainer.addEventListener('click', (e) => {
  if (!productModalContent.contains(e.target)) {
    closeModal(); 
  }
});
//For uploading images 
const uploadImgBtn = document.querySelector(".image-upload-container .upload-img-btn");
const imgEditBtn = document.querySelector(".add-product-inner-container .image-upload-container .image-header-container button");
const productModalSaveBtn=document.querySelector(".product-modal-container .product-modal-content .modal-footer .save-btn");
if(uploadImgBtn){
  uploadImgBtn.addEventListener('click', () => {
   productModalContainer.classList.add("active");
   
   body.classList.add("not-active");
  });

}

const productModalMainImageContainer = productModalContainer.querySelector(".product-img-wrapper .product-img-container .main-img-container");
const prodMainImgWrapper=productModalMainImageContainer.querySelector(".main-img-wrapper");
let productThumbEditBtn=productModalMainImageContainer.querySelector(".edit-thumb-img-btn");
let productThumbDeleteBtn=productModalMainImageContainer.querySelector(".delete-thumb-img-btn");
const productModalFooterContent=productModalContainer.querySelector(".modal-footer p");
const productModalCloseBtn=document.querySelector(".product-modal-container .product-modal-content .product-modal-header .modal-close-btn");
const uploadImgInputs = productModalContainer.querySelectorAll(".product-img-wrapper .product-img-container .thumbnail-img-container .upload-img-input");

let selectedFiles = [];
productModalSaveBtn.setAttribute("disabled","true");
productModalSaveBtn.classList.remove("active");

uploadImgInputs.forEach((input, index) => {
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = file.name;
    selectedFiles[index] = `./assets/images/${imageUrl}`;

    const thumbnail = input.closest(".thumbnail-img");
    thumbnail.dataset.index = index;

    const label = thumbnail.querySelector("label");
    if (label) label.classList.add("not-active");

    const existingImg = thumbnail.querySelector("img[class^='thumb-']");
    const existingSpan = thumbnail.querySelector("span");
    if (existingImg) existingImg.remove();
    if (existingSpan) existingSpan.remove();

    thumbnail.insertAdjacentHTML(
      "beforeend",
      `
      <img src="./assets/images/${imageUrl}" alt="uploaded image" class="thumb-${index+1}">
      <span><img src="./assets/images/published.png" alt="published"></span>
      `
    );

    thumbnail.setAttribute("draggable", "true");

    prodMainImgWrapper.innerHTML = `
      <img src="./assets/images/${imageUrl}" class="main-img" alt="main image">
    `;

    if (index === 0) {
      productModalFooterContent.childNodes[1].textContent =
        "Mandatory product images (1/1) uploaded";
    }

    enableProductModalSave();
  });
});

const thumbnailContainers = document.querySelectorAll(".product-img-wrapper .product-img-container .thumbnail-img-wrapper .thumbnail-img-container .thumbnail-img");

let draggedItem = null;

thumbnailContainers.forEach(thumbnail => {
  thumbnail.addEventListener("dragstart", (e) => {
    draggedItem = thumbnail;
    e.dataTransfer.effectAllowed = "move";
    thumbnail.classList.add("dragging");

  });

  thumbnail.addEventListener("dragend", () => {
    if (draggedItem) {
      draggedItem.classList.remove("dragging");
      draggedItem = null;
    }
    updateThumbnailLabels();
    updateSelectedFilesOrder();
    updateMainImageAfterReorder();
    changeHeaderText();
  });

  thumbnail.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!draggedItem) return; 
    
    const draggingOver = e.currentTarget;
    const wrapper = draggingOver.closest(".thumbnail-img-wrapper");

    const bounding = draggingOver.getBoundingClientRect();
    const offset = e.clientX - bounding.left - bounding.width / 2;

    if (offset > 0) {
      wrapper.insertBefore(draggedItem.parentNode, draggingOver.parentNode.nextSibling);
    } else {
      wrapper.insertBefore(draggedItem.parentNode, draggingOver.parentNode);
    }
  });

});

const labels = ["Front View", "Side View", "Side / Top", "Top / Bottom"];

function updateThumbnailLabels() {
  const containers = document.querySelectorAll(".thumbnail-img-container");
  containers.forEach((container, index) => {
    const p = container.querySelector("p");
    if (p) {
      p.textContent = labels[index] || `View ${index + 1}`;
    }
  });
}

function changeHeaderText(){
    thumbnailContainers.forEach(thubImg => {
   
  const computedStyle = window.getComputedStyle(thubImg);
   const imgTextHeader=document.querySelector(".product-img-wrapper .product-img-desc-container h3")
   if (computedStyle.border === "1px solid rgb(143, 68, 253)") {
      let parentContainer = thubImg.parentElement;
      const clickedText=parentContainer.querySelector(".img-text")
      imgTextHeader.childNodes[0].textContent=clickedText.childNodes[0].data
    }
});
}

function updateSelectedFilesOrder() {
  const reorderedFiles = [];
  document.querySelectorAll(".thumbnail-img-container").forEach((container, newIndex) => {
    const thumbnailImg = container.querySelector(".thumbnail-img");
    const originalIndex = thumbnailImg?.dataset.index;
    if (originalIndex !== undefined && selectedFiles[originalIndex]) {
      reorderedFiles[newIndex] = selectedFiles[originalIndex];
      thumbnailImg.dataset.index = newIndex;
    }
  });
  selectedFiles.length = 0;
  reorderedFiles.forEach((file, i) => {
    if (file) selectedFiles[i] = file;
  });
}

function updateMainImageAfterReorder() {
  const firstThumb = document.querySelector(".thumbnail-img-container .thumbnail-img img[class^='thumb-']");
  if (firstThumb) {
    const mainImg = prodMainImgWrapper.querySelector(".main-img");
    if (mainImg) {
      mainImg.src = firstThumb.src;
    }
  }
}

const imgTextHeader=document.querySelector(".product-img-wrapper .product-img-desc-container h3")
function initThumbnailClickHandler() {
  const container = document.querySelector(".product-img-wrapper .product-img-container .thumbnail-img-wrapper");
  if (!container) return; 
  
  container.addEventListener("click", (e) => {
    const clickedImg = e.target.closest(".thumbnail-img img[class^='thumb-']");
    if (!clickedImg) return;
    const thumbnailImgContainers=container.querySelectorAll(".thumbnail-img")
    const clickedContainer=e.target.closest(".thumbnail-img");
    const clickedParentContainer= clickedContainer.parentElement;
    const clickedText=clickedParentContainer.querySelector(".img-text")
    imgTextHeader.childNodes[0].textContent=clickedText.childNodes[0].data
    thumbnailImgContainers.forEach(imgContainer=>{
      imgContainer.classList.remove("clicked");
    })
    clickedContainer.classList.add("clicked");
    if (prodMainImgWrapper && clickedImg.src) {
      prodMainImgWrapper.innerHTML = `
      <img src="${clickedImg.src}" class="main-img" alt="main image">
    `;
    }
    const clickedLabel=clickedContainer.querySelector(".upload-label");
    if(!productThumbEditBtn.classList.contains("active")){
      productThumbEditBtn.classList.add("active");
      productThumbDeleteBtn.classList.add("active");
    }
   
    const forVal=clickedLabel.getAttribute("for");
    productThumbEditBtn.setAttribute("for",forVal);
    productThumbDeleteBtn.setAttribute("for",forVal);
    const mainImg=prodMainImgWrapper.querySelector(".main-img")
    if(mainImg){
      ProductImgSaveBtn.removeAttribute("disabled")
      ProductImgSaveBtn.classList.add("active");
    }
    
    editThumbImages();
  });
}

initThumbnailClickHandler();

deleteThumbImages();

function initMainThumbClick() {
  const previewWrapper = document.querySelector(".thumbnail-preview-container");
  const mainContainer = document.querySelector(".image-upload-container .main-image-container");
  if (!previewWrapper || !mainContainer) return;

  previewWrapper.addEventListener("click", (e) => {
    const img = e.target.closest(".thumbnail-preview-img");
    if (!img) return;

    previewWrapper.querySelectorAll(".thumbnail-preview-img-container").forEach(el => {
      el.classList.remove("active");
    });

    const clickedContainer = img.closest(".thumbnail-preview-img-container");
    if (clickedContainer) {
      clickedContainer.classList.add("active");
    }

  
    let mainImg = mainContainer.querySelector(".main-image");
    if (!mainImg) {
      mainImg = document.createElement("img");
      mainImg.className = "main-image";
      mainContainer.innerHTML = "";
      mainContainer.appendChild(mainImg);
    }
    mainImg.src = img.src;
  });
}


const thumbnailPreview= document.querySelector(".image-upload-container .thumbnail-preview-container")

if(thumbnailPreview ){
  initMainThumbClick();
}

function initPreviewDragAndDrop() {
  const thumbnailPreviewImgs = document.querySelectorAll(
    ".image-upload-container .thumbnail-preview-container .thumbnail-preview-img-container"
  );

  let draggedPreviewItem = null;

  thumbnailPreviewImgs.forEach(thumbnailContainer => {
      thumbnailContainer.draggable = true;
    
    thumbnailContainer.addEventListener("dragstart", (e) => {
      draggedPreviewItem = thumbnailContainer;
      e.dataTransfer.effectAllowed = "move";
      thumbnailContainer.classList.add("dragging");
    });

    thumbnailContainer.addEventListener("dragend", () => {
      if (draggedPreviewItem) {
        draggedPreviewItem.classList.remove("dragging");
        draggedPreviewItem = null;
      }
    });

    thumbnailContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (!draggedPreviewItem || draggedPreviewItem === e.currentTarget) return;

      const draggingOver = e.currentTarget;
      const wrapper = draggingOver.closest(".thumbnail-preview-container");

      const bounding = draggingOver.getBoundingClientRect();
      const offset = e.clientX - bounding.left - bounding.width / 2;

      if (offset > 0) {
        wrapper.insertBefore(draggedPreviewItem, draggingOver.nextSibling);
      } else {
        wrapper.insertBefore(draggedPreviewItem, draggingOver);
      }
    });
  });
}


const mainImageContainer = document.querySelector(".image-upload-container .main-image-container");

const productImgEditBtn = document.querySelector(".add-product-inner-container .image-upload-container .image-header-container .edit-product-img-btn");
const ProductImgStatImg =document.querySelector(".add-product-inner-container .image-upload-container .image-header-container img");
const ProductImgStat = document.querySelector(".add-product-inner-container .image-upload-container .image-header-container p span");

const ProductImgSaveBtn = productModalContainer.querySelector(".save-btn");

function saveProductImages() {
  // let selectedFiles=[];
  // const thumbnailImgContainer = productModalContainer.querySelector(".thumbnail-img-wrapper .thumbnail-img-container .thumbnail-img");
  const thumbnailImgs = productModalContainer.querySelectorAll(
  ".thumbnail-img-wrapper .thumbnail-img-container .thumbnail-img img[class^='thumb-']"
);


const selectedFiles = Array.from(thumbnailImgs).map(img => img.src);

  if (selectedFiles.length > 0) {
    const currentMainImg = prodMainImgWrapper.querySelector(".main-img");
    console.log(prodMainImgWrapper)
    // console.log(currentMainImg)
    if (currentMainImg && currentMainImg.src) {
      mainImageContainer.innerHTML = `<img src="${currentMainImg.src}" class="main-image"/>`;
    }
  }


  thumbnailPreview.innerHTML = "";
  selectedFiles.forEach((filePath, index) => {
    thumbnailPreview.insertAdjacentHTML(
    "beforeend",
    `<div class="thumbnail-preview-img-container" draggable="true">
      <img src="${filePath}" class="thumbnail-preview-img" />
    </div>`
    );
  });

  // productModalMainImageContainer.innerHTML = "";
  initPreviewDragAndDrop() 
  // const modalThumbnails = productModalContainer.querySelectorAll(".thumbnail-img");

  // modalThumbnails.forEach(thumbnail => {
  //   const previewImg = thumbnail.querySelector("img[class^='thumb-']");
  //   if (previewImg) previewImg.remove();

  //   const span = thumbnail.querySelector("suploadpan");
  //   if (span) span.remove();

  //   const label = thumbnail.querySelector("label");
  //   if (label && label.classList.contains("not-active")) {
  //     label.classList.remove("not-active");
  //   }
  //enab });

  productModalContainer.classList.remove("active");
  // selectedFiles = [];
  productImgEditBtn.classList.add("active");
  uploadImgBtn.classList.add("not-active");
  ProductImgStat.innerHTML = `(${thumbnailPreview.children.length}/4)`;
  if (thumbnailPreview.children.length < 4) {
    ProductImgStatImg.src = "./assets/images/warning.png";
    ProductImgStatImg.alt = "warning";
  } else {
    ProductImgStatImg.src = "./assets/images/completed tick.png";
    ProductImgStatImg.alt = "completed tick";
  }
  updateSaveAndSubmitStatus();
  body.classList.remove("not-active");
}

productModalCloseBtn.addEventListener('click',()=>{
  const productMainImg=document.querySelector(".main-img-wrapper .main-img")
  
  const thumbnailImgContainer = productModalContainer.querySelectorAll(".thumbnail-img-wrapper .thumbnail-img-container .thumbnail-img");
  thumbnailImgContainer.forEach(container => {
  const thumbImg = container.querySelector("img[class^='thumb-']");
  const span=container.querySelector("span");
  if(productMainImg){
    productMainImg.remove();
  }
  if (thumbImg) {
    thumbImg.remove();
  }
   if (span) {
    span.remove();
  }
  container.classList.remove("clicked")
  const labels = container.querySelectorAll('label');
  labels.forEach(label => {
    label.classList.remove('not-active');
  });
  });
  productThumbEditBtn.classList.remove("active");
  productThumbEditBtn.removeAttribute("for")
  productThumbDeleteBtn.classList.remove("active");
  productThumbDeleteBtn.removeAttribute("for")
  productModalFooterContent.childNodes[1].textContent="Mandatory product images (0/1) uploaded";
  imgTextHeader.childNodes[0].textContent="Front View";

  closeModal();

})
ProductImgSaveBtn.addEventListener('click',saveProductImages)


const productImgCancelBtn = document.querySelector(".product-modal-container .product-modal-content .modal-footer .cancel-btn");

function DelProductImages() {
  const uploadImgBtn = document.querySelector(".image-upload-container .upload-img-btn");
  if(!uploadImgBtn.classList.contains('not-active')){
      const thumbnails = document.querySelectorAll(
    ".product-img-wrapper .product-img-container .thumbnail-img"
  );

  thumbnails.forEach(thumbnail => {
    const label = thumbnail.querySelector("label");
    if (label) label.classList.remove("not-active");

    const uploadedImg = thumbnail.querySelector("img[class^='thumb-']");
    if (uploadedImg) {
      uploadedImg.remove();
    }

    const publishedIcon = thumbnail.querySelector("span");
    if (publishedIcon) publishedIcon.remove();

    thumbnail.removeAttribute("draggable");
    thumbnail.removeAttribute("data-index");
    thumbnail.classList.remove("clicked");
    productThumbEditBtn.classList.remove("active");
    productThumbEditBtn.removeAttribute("for");
    productThumbDeleteBtn.classList.remove("active");
    productThumbDeleteBtn.removeAttribute("for");
  });

  selectedFiles.length = 0; 
  prodMainImgWrapper.innerHTML = ""; 
  }

  productModalContainer.classList.remove("active"); 
  productModalFooterContent.childNodes[1].textContent="Mandatory product images (0/1) uploaded"
  imgTextHeader.childNodes[0].textContent="Front View"
  body.classList.remove("not-active");
}


if (productImgCancelBtn) {
  productImgCancelBtn.addEventListener("click", DelProductImages);
}

if (imgEditBtn) {
  imgEditBtn.addEventListener('click', () => {
    productThumbEditBtn.classList.add("active");
    productThumbEditBtn.removeAttribute("for");
    productThumbDeleteBtn.classList.add("active");
    productThumbDeleteBtn.removeAttribute("for");
    const mainImg=mainImageContainer.querySelector(".main-image")
    prodMainImgWrapper.innerHTML=`<img src="${mainImg.src}" class="main-img" alt="main image">`;
    const thumbnailImgsWrapper = productModalContainer.querySelector(".thumbnail-img-wrapper");
    const thumbnailPreviewImgs=document.querySelectorAll(".thumbnail-preview-img-container .thumbnail-preview-img")
    const thumbnailImgContainer=thumbnailImgsWrapper.querySelectorAll(".thumbnail-img")
    
    const previewImgSrcs = Array.from(thumbnailPreviewImgs).map(img => img.src);

    thumbnailImgContainer.forEach((thumbnailImg, index) => {
      thumbnailImg.classList.remove("clicked");
      const existingImg = thumbnailImg.querySelector("img[class^='thumb-']");
      const existingSpan = thumbnailImg.querySelector("span");
      const thumbLabel = thumbnailImg.querySelector("label");

      if (thumbLabel) thumbLabel.classList.add("not-active");
      if (existingImg) existingImg.remove();
      if (existingSpan) existingSpan.remove();

      const src = previewImgSrcs[index];

      if (src) {
        thumbnailImg.insertAdjacentHTML(
          "beforeend",
          `
          <img src="${src}" alt="uploaded image" class="thumb-${index + 1}">
          <span><img src="./assets/images/published.png" alt="published"></span>
          `
        );
      }
        productModalFooterContent.childNodes[1].textContent="Mandatory product images (1/1) uploaded"
    });

    productModalContainer.classList.add("active");
    body.classList.add("not-active");
    enableProductModalSave();
  });
}

function enableProductModalSave(){
  const thumbImg1=productModalContainer.querySelector(".thumb-1")
  const mainImg= productModalContainer.querySelector(".main-img-container .main-img-wrapper .main-img");
  const productModalSaveBtn=document.querySelector(".product-modal-container .product-modal-content .modal-footer .save-btn");
  
  if (mainImg) {
    productThumbEditBtn.classList.add("active");
    productThumbDeleteBtn.classList.add("active");
    
    
  }
  else{
    productThumbEditBtn.classList.remove("active");
    productThumbDeleteBtn.classList.remove("active");
    
  }
  if(mainImg && thumbImg1){
    productModalSaveBtn.removeAttribute("disabled");
    productModalSaveBtn.classList.add("active");
  }
  else{
    productModalSaveBtn.setAttribute("disabled","true");
    productModalSaveBtn.classList.remove("active");
  }
}

enableProductModalSave();
function editThumbImages(){
  const productMainImg=prodMainImgWrapper.querySelector(".main-img");
  const thumbnailImgContainer = productModalContainer.querySelectorAll(".thumbnail-img-wrapper .thumbnail-img-container .thumbnail-img");
  let thumbImgs = [];
  thumbnailImgContainer.forEach(container => {
    const imgs = container.querySelectorAll("img");
    imgs.forEach(img => {
      console.log(img)
      if ([...img.classList].some(cls => cls.startsWith("thumb-"))) thumbImgs.push(img);
    });
  });
  productThumbEditBtn.replaceWith(productThumbEditBtn.cloneNode(true));
  let newEditBtn = productModalContainer.querySelector(".edit-thumb-img-btn");
  productThumbEditBtn = newEditBtn;
  productThumbEditBtn.addEventListener('click',()=>{
    
    if (thumbImgs && productThumbEditBtn) {
      const forVal = productThumbEditBtn.getAttribute("for");

      if (forVal) {

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.multiple = false;
        fileInput.id = forVal;


        fileInput.click();

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return; 

          thumbImgs.forEach((thumbnailImg) => {
            if (
              (forVal === 'upload-img-front' && thumbnailImg.classList.contains("thumb-1")) ||
              (forVal === 'upload-img-side' && thumbnailImg.classList.contains("thumb-2")) ||
              (forVal === 'upload-img-side-top' && thumbnailImg.classList.contains("thumb-3")) ||
              (forVal === 'upload-img-top-bottom' && thumbnailImg.classList.contains("thumb-4"))
            ) {
              thumbnailImg.src = `./assets/images/${file.name}`;
              productMainImg.src=thumbnailImg.src
            }
          });
        });
      } 
    }

  })
}

function deleteThumbImages(){

  const labels = productModalContainer.querySelectorAll(".thumbnail-img-wrapper .thumbnail-img-container label");
  productThumbDeleteBtn.addEventListener('click',()=>{
    const productMainImg=prodMainImgWrapper.querySelector(".main-img");
    const forVal=productThumbDeleteBtn.getAttribute("for");
    labels.forEach(label=>{
      if(label.getAttribute("for")===forVal){
        const parent=label.parentElement;
        const existingImg=parent.querySelector("img[class^='thumb-']");
        const existingSpan=parent.querySelector("span");
        console.log(parent)
        console.log(existingImg)
        existingImg.remove();
        existingSpan.remove();
        parent.classList.remove("clicked");
        productMainImg.remove();
        label.classList.remove("not-active");
        productThumbEditBtn.classList.remove("active");
        productThumbDeleteBtn.classList.remove("active");
          productModalSaveBtn.setAttribute("disabled","true");
          productModalSaveBtn.classList.remove("active");
    
        if(forVal==="upload-img-front"){
          productModalFooterContent.childNodes[1].textContent="Mandatory product images (0/1) uploaded";
        }
        
      }
    })
  })
}

//Form 
const formModalContainer=document.querySelector(".form-modal-container");
const formModalTitle=document.querySelector(".form-modal-container .form-modal-content .form-modal-header h3")
const productForm=document.querySelector(".form-modal-container .form-modal-content .product-form")
const addProductDetailsBtn=document.querySelector(".add-product-inner-container .details-container .details-header-container .add-product-btn");
const editProductBtn=document.querySelector(".add-product-inner-container .product-details-container .details-header-container .edit-product-btn");

const additionalForm=document.querySelector(".form-modal-container .form-modal-content .additional-form")
const addAditionalBtn=document.querySelector(".add-product-inner-container .details-container .details-header-container .add-additional-btn");
const editAdditionalBtn=document.querySelector(".add-product-inner-container .details-container .details-header-container .edit-additional-btn")


const formModalContent = formModalContainer.querySelector('.form-modal-content');

formModalContainer.addEventListener('click', (e) => {
  if (!formModalContent.contains(e.target)) {
    closeModal(); 
  }
});
let activeSection = null; 

//Product Form
function openProductForm(){
  additionalForm.classList.remove("active");
  productForm.classList.add("active");
  formModalContainer.classList.add("active");
  formModalTitle.innerHTML="Product Details";
  activeSection = 'product';
  
}

addProductDetailsBtn.addEventListener('click',()=>{
 openProductForm();
 body.classList.add("not-active");
});


const inp= productForm.querySelector(".input-price");

inp.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
});


function validateProductForm() {
  let isValid = true;

  ProductInputs.forEach(input => {
    const value = input.value.trim();
    const inputWrapper = input.closest('.input-wrapper');
     if (!inputWrapper || input.type === 'hidden') {
      return;
    }
    
    const errorElement = inputWrapper.querySelector('.error');
    if (input.closest('.input-group').querySelector('.star')) {
    if (value === '') {
      isValid = false;
      errorElement.innerText = 'This field is required';
      inputWrapper.classList.add('error');
    } else {
      errorElement.innerText = 'no error';
      inputWrapper.classList.remove('error');
    }
  }
});

  return isValid;
}


function getProductData() {
  const formData = {};
  ProductInputs.forEach(input => {
    if(input.value.trim() !==''){
      formData[input.name] = input.value.trim();
    }
  });
  return formData;
}
const productDetailsContainer=document.querySelector(".product-details-container");
const productDetailsHeaderContainer=productDetailsContainer.querySelector(".details-header-container");
const productStatusImg=productDetailsHeaderContainer.querySelector("img");
const productStatusCount=productDetailsHeaderContainer.querySelector("p span");
const productDetailsBodyContainer=productDetailsContainer.querySelector(".details-body-container");
const prodTexts=productDetailsBodyContainer.querySelectorAll("p")

productStatusCount.innerHTML="(0/9)";
function displayProdData(prodData){
  let prodDataLength=Object.keys(prodData).length;
  if(prodData._id){
    prodDataLength=prodDataLength-1;
    if(prodDataLength== 9){
      productStatusCount.innerHTML=`(${prodDataLength}/9)`
      productStatusImg.src="./assets/images/completed tick.png";
      productStatusImg.alt="completed tick"
      editProductBtn.classList.add("active");
      addProductDetailsBtn.classList.add("not-active");
    }
  }
  else if(prodDataLength==9){
    productStatusCount.innerHTML=`(${prodDataLength}/9)`
    productStatusImg.src="./assets/images/completed tick.png";
    productStatusImg.alt="completed tick"
    editProductBtn.classList.add("active");
    addProductDetailsBtn.classList.add("not-active");
  }
  else if(prodDataLength==0){
    productStatusCount.innerHTML=`(${prodDataLength}/9)`
    productStatusImg.src="./assets/images/completed tick-default.png";
    productStatusImg.alt="completed tick-default"
  }
  else{
    productStatusCount.innerHTML=`(${prodDataLength}/9)`
    productStatusImg.src="./assets/images/warning.png";
    productStatusImg.alt="warning"
  }
  prodTexts.forEach(prodText=>{
    for (let key in prodData) {
      if(prodText.querySelector(`.view-${key}`)){
        prodText.querySelector(`.view-${key}`).innerHTML=prodData[key]
      }
    }
  })
}


//Additional Form
function openAdditionalForm(){
  productForm.classList.remove("active");
  formModalContainer.classList.add("active");
  additionalForm.classList.add("active")
  formModalTitle.innerHTML="Additional Details";
  activeSection = 'additional';
  body.classList.add("not-active");
}
addAditionalBtn.addEventListener('click',()=>{
  openAdditionalForm()
})


const additionalInputs = additionalForm.querySelectorAll('input, select');
function getAdditionalData() {
  const formData = {};
  additionalInputs.forEach(input => {
    if(input.value.trim() !==''){
      formData[input.name] = input.value.trim();
    }
  });
  return formData;
}

const addDetailsContainer=document.querySelector(".additional-details-container");
const addDetailsHeaderContainer=addDetailsContainer.querySelector(".details-header-container");
const addStatusImg=addDetailsHeaderContainer.querySelector("img");
const addStatusCount=addDetailsHeaderContainer.querySelector("p span");
const addDetailsBodyContainer=addDetailsContainer.querySelector(".details-body-container");
const addTexts=addDetailsBodyContainer.querySelectorAll("p");


function displayAddData(addData) {
  const addDataLength=Object.keys(addData).length;
  if(addDataLength>0){
    addStatusImg.src="./assets/images/completed tick.png";
    addStatusImg.alt="completed tick"
  }
  
  addStatusCount.innerHTML=`(${addDataLength}/8)`
  addTexts.forEach(addText => {
    for (let key in addData) {
      let selector = "";

      if (key === "add-brand") {
        selector = ".add-brand";
      } else if (key === "add-model") {
        selector = ".add-model";
      } else {
        selector = `.view-${key}`;
      }
      const el = addText.querySelector(selector);
      if (el) {
        el.innerHTML = addData[key] || "";
      }
    }
  });
}


let productDetailsData = [];     
let additionalDetailsData = [];  


const formModalCloseBtn=document.querySelector(".form-modal-container .form-modal-content .form-modal-header .modal-close-btn");
const ProductInputs = productForm.querySelectorAll('input, select');

formModalCloseBtn.addEventListener('click',()=>{
  // if(activeSection=="product"){
  //   const prodData=getProductData();
  //   displayProdData(prodData)
    
  // }
  // else if (activeSection === 'additional'){
  //   const addData=getAdditionalData();
  //   displayAddData(addData); 
  // }
  closeModal();
})



//Save and Cancel Form Data
const formSaveBtn = document.querySelector(".form-modal-container .form-modal-content .modal-footer .save-btn");
const formCancelBtn = document.querySelector(".form-modal-container .form-modal-content .modal-footer .cancel-btn");

formSaveBtn.addEventListener('click', (e) => {
  if (activeSection === 'product') {
    e.preventDefault();
    if(validateProductForm()){
      const prodData=getProductData()
      displayProdData(prodData)
      productDetailsData.push(prodData);  
      closeModal()
      editProductBtn.classList.add("active");
      addProductDetailsBtn.classList.add("not-active");
      updateSaveAndSubmitStatus();
    }
  } 
  else if (activeSection === 'additional') {
    const addData=getAdditionalData()
    additionalDetailsData.push(addData)
    displayAddData(addData);
    closeModal()
    editAdditionalBtn.classList.add("active");
    addAditionalBtn.classList.add("not-active");
  }
});

function updateSaveAndSubmitStatus() {
  const isProductDetailsComplete = productStatusImg.alt === "completed tick";
  const isImagesComplete = ProductImgStatImg.alt === "completed tick";


  if (isProductDetailsComplete && isImagesComplete) {
    saveProductsBtn.removeAttribute("disabled");
    submitProductsBtn.removeAttribute("disabled");
    saveProductsBtn.classList.add("active");
    submitProductsBtn.classList.add("active");
  } 
  
  else {
    saveProductsBtn.setAttribute("disabled", true);
    submitProductsBtn.setAttribute("disabled", true);
    saveProductsBtn.classList.remove("active");
    submitProductsBtn.classList.remove("active");
  }
  if (checkUpdateConditions() && updateProductBtn) {
    updateProductBtn.classList.add("active");
    submitProductsBtn.setAttribute("disabled", true);
    submitProductsBtn.classList.add("not-active");
  } else if (updateProductBtn) {
    updateProductBtn.classList.remove("active");
  }

}

function checkUpdateConditions() {
  const idInput = document.querySelector('input[name="_id"]');
  const isIdFilled = idInput && idInput.value.trim() !== '';
  const isImagesComplete = ProductImgStatImg.alt === "completed tick";
  const isProductComplete =productStatusImg.alt === "completed tick"
  return isIdFilled && isImagesComplete && isProductComplete;
}


formCancelBtn.addEventListener('click', () => {
  closeModal()
});


//Edit Form Data
editProductBtn.addEventListener('click',()=>{
  const prodTexts=productDetailsBodyContainer.querySelectorAll("p")
  let productDat={};
    prodTexts.forEach(p => {
      const span = p.querySelector("span[class^='view-']");
      if (span) {
        const key = span.className.replace("view-", "").trim();

        const value = span.innerHTML.trim();
        
        productDat[key] = value;
      }
    })
    const ProductInputs = productForm.querySelectorAll('input, select');
    ProductInputs.forEach(input=>{
    for (let key in productDat) {
        let el = input; 
        
        if (el.name === `input-${key}` || el.name === key) {
          el.value = productDat[key];
        }
      }
  })  
  openProductForm();
})

editAdditionalBtn.addEventListener('click',()=>{
    let additData={};
    const addTexts=addDetailsBodyContainer.querySelectorAll("p");
    addTexts.forEach(p => {
      const span = p.querySelector("span");
      if (span) {
        const className = span.className.trim();
        

        const key = className.startsWith("view-")
          ? className.replace("view-", "")
          : className;
        const value = span.innerHTML.trim();

        additData[key] = value;
      }
    });
      const additionalInputs = document.querySelectorAll(".additional-form input, .additional-form select");
    
      additionalInputs.forEach(input=>{
      for (let key in additData) {
        let el = input; 
        
        if (el.name === `input-${key}` || el.name === key) {
          el.value = additData[key];
        }
      }
    })  

  openAdditionalForm();
})


function getSavedImages() {
  const images = {};

  const mainImg = mainImageContainer.querySelector(".main-image");
  if (mainImg) {
    images.image = mainImg.src; 
  }

  const thumbs = thumbnailPreview.querySelectorAll(".thumbnail-preview-img");
  thumbs.forEach((thumb, i) => {
    images[`thumb${i + 1}`] = thumb.src;
  });

  return images;
}

function generateHexId(length = 32) {
  const chars = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}


function buildFinalProduct() {
  const finalData = {};

  const lastProd = productDetailsData.length > 0 
    ? productDetailsData[productDetailsData.length - 1] 
    : {};
  
  const lastAdd = additionalDetailsData.length > 0 
    ? additionalDetailsData[additionalDetailsData.length - 1] 
    : {};
  
  Object.assign(finalData, lastProd, lastAdd, getSavedImages());
  return finalData;
}


saveProductsBtn.addEventListener('click',()=>{
  const finalProduct = buildFinalProduct(); 
  finalProduct._id = generateHexId(); 
  savedProducts.push(finalProduct);
  saveOrUpdateProduct(finalProduct)
  scrollToTop();
  showToast("#19762d","Product Saved Successfully");
    setTimeout(() => {
      toastContainer.classList.remove("show");
      window.name = JSON.stringify(savedProducts);
      window.location.href="./sell-your-products.html";
  }, 5000);
})

const toastContainer = document.querySelector(".toast-container");
function showToast(bgc, message) {
  
  toastContainer.querySelector("p").innerHTML= message;
  toastContainer.style.backgroundColor=bgc;
  toastContainer.classList.add("show");
}

async function createProduct() {
  try {
    const finalProduct = buildFinalProduct();
    const keysToRemove = ["image", "thumb1", "thumb2", "thumb3", "thumb4"];
    let payload = {};

    for (const key in finalProduct) {
      if (finalProduct.hasOwnProperty(key) && !keysToRemove.includes(key)) {
        payload[key] = finalProduct[key];
      }
    }

    const userToken = localStorage.getItem("token");
    payload.token = userToken;

    const res = await fetch("http://taskapi.devdews.com/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    let data;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await res.json(); 
    } else {
      data = await res.text(); 
    }

    if (res.ok && data.includes("Product Created Successfully")) {
      showToast("#19762d","Product Created Successfully");
      setTimeout(() => {
        toastContainer.classList.remove("show");
        window.location.href="./sell-your-products.html";
      }, 5000);
    } else {
      showToast("#ea2f4b","Failed to create product. Try again.");
      console.error("Error creating product:", data);
      setTimeout(() => {
        toastContainer.classList.remove("show");
      }, 5000);
    }
    
  } catch (err) {
    console.error("Network or code error:", err);
  }
}

submitProductsBtn.addEventListener('click', async () => {
  scrollToTop();
  createProduct();
});

function scrollToTop(){
  window.scrollTo({
    top:0,  
  });
}

async function populateProductSelects() {
  try {
    const res = await fetch("http://taskapi.devdews.com/api/products");
    const products = await res.json();

    const brandSelect = document.querySelector(".input-brand");
    const modelSelect = document.querySelector(".input-model");
    const releaseSelect = document.querySelector(".input-release_year");

    const brands = [...new Set(products.map(p => p.brand))];
    const models = [...new Set(products.map(p => p.model))];
    const releaseYears = [...new Set(products.map(p => p.release_year))];

    function fillSelect(selectEl, optionsArr, placeholder = "Select") {
      selectEl.innerHTML = `<option value="">${placeholder}</option>`;
      optionsArr.forEach(opt => {
        selectEl.innerHTML += `<option value="${opt}">${opt}</option>`;
      });
    }

    fillSelect(brandSelect, brands, "Select Brand");
    fillSelect(modelSelect, models, "Select Model");
    fillSelect(releaseSelect, releaseYears, "Select Year");

  } catch (err) {
    console.error(err);
  }
}

function loadProductImages(productData) {
  const isFromAPI = productData.isPosted === true;
  
  if (isFromAPI) {
    console.log("API product - no images available");
    return;
  }
  
  if (productData.image) {
    mainImageContainer.innerHTML = `<img src="${productData.image}" class="main-image">`;
  }

  thumbnailPreview.innerHTML = "";
  
  for (let i = 1; i <= 4; i++) {
    const thumbKey = `thumb${i}`;
    if (productData[thumbKey]) {
      thumbnailPreview.insertAdjacentHTML(
        "beforeend",
        `<div class="thumbnail-preview-img-container">
           <img src="${productData[thumbKey]}" class="thumbnail-preview-img"/>
         </div>`
      );
    }
  }
  initPreviewDragAndDrop();
  updateImageStatus();
}

function updateImageStatus() {
  const imageCount = thumbnailPreview.children.length;

  if (imageCount > 0) {
    uploadImgBtn.classList.add("not-active");
    ProductImgStat.innerHTML = `(${imageCount}/4)`;
    productImgEditBtn.classList.add("active")
    
    if (imageCount < 4) {
      ProductImgStatImg.src = "./assets/images/warning.png";
      ProductImgStatImg.alt = "warning";
    } else {
      ProductImgStatImg.src = "./assets/images/completed tick.png";
      ProductImgStatImg.alt = "completed tick";
    }
  }
}

//Update Products 
const updateProductBtn=document.querySelector(".add-product-outer-container .save-btn-container .update-btn");
updateProductBtn.classList.remove("active");
function updateAPIProductDetails(productData,editing) {
  delete productData.editing
  const inputs = document.querySelectorAll(".product-form input, .product-form select");
  const productDetailsData={};
  inputs.forEach(input => {
    const key = input.name.replace(/^input-/, "");
    if (productData[key] !== undefined){
      input.value = productData[key];
      productDetailsData[key] = productData[key];
    }
    displayProdData(productDetailsData)
  });
  
  updateProductBtn.addEventListener("click", async (e) => {
    const userToken = localStorage.getItem("token");
    try {
      let finalProduct = buildFinalProduct();
      const keysToRemove = ["image", "thumb1", "thumb2", "thumb3", "thumb4"];
      let payload = {};
      
      for (const key in finalProduct) {
        if (finalProduct.hasOwnProperty(key) && !keysToRemove.includes(key)) {
          payload[key] = finalProduct[key];
        
        }
      }
      
      const res = await fetch(`http://taskapi.devdews.com/api/products/update/${productData._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, token: userToken })
      });
      const data = await res.json();

      if (data.success) {
        closeModal();
        scrollToTop();
        showToast("#19762d", "Product Updated successfully");
      } else {
        closeModal();
        scrollToTop();
        showToast("#EA2F4B", "Failed to update  product");
        console.error("Error updating product:", data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    updateProductBtn.classList.remove("active");
    formSaveBtn.classList.add("active");
    setTimeout(() => {
      toastContainer.classList.remove("show");
      window.location.href="./sell-your-products.html";
    },5000);
        
  })
}

function updateLocalProductDetails(productData,editing) {
  delete productData.editing
  const productDetailData={};
  const inputs = document.querySelectorAll(".product-form input, .product-form select");
  inputs.forEach(input => {
    const key = input.name.replace(/^input-/, "");
    if (productData[key] !== undefined) {
      input.value = productData[key];
      productDetailData[key] = productData[key];
    }
    
    displayProdData(productDetailData)

  });

  let additionalData = {};
  const additionalInputs = document.querySelectorAll(".additional-form input, .additional-form select");

  const updateLocalProductBtn=document.querySelector(".add-product-outer-container .save-btn-container .save-local-btn");
  additionalInputs.forEach(input => {
    const key = input.name.replace(/^input-/, "");
    if (productData[key] !== undefined) {
      input.value = productData[key];
      additionalData[key] = productData[key];

    }
    
  });
  displayAddData(additionalData);
  if(addStatusImg.alt==="completed tick"){
     addAditionalBtn.classList.add("not-active");
  editAdditionalBtn.classList.add("active"); 
  }
    
  

  loadProductImages(productData);
  saveProductsBtn.classList.add("not-active")
  updateLocalProductBtn.classList.add("active");
  if (updateLocalProductBtn) {
    updateLocalProductBtn.addEventListener("click", () => {
      const prodData=getProductData()

      productDetailsData.push(prodData); 
      const addData=getAdditionalData();
      additionalDetailsData.push(addData)
      
      const finalProduct = buildFinalProduct();
      
      finalProduct._id=productData._id;
      saveOrUpdateProduct(finalProduct)
      scrollToTop();
      showToast("#19762d", "Product updated successfully");
      updateLocalProductBtn.classList.remove("active");
      saveProductsBtn.classList.remove("not-active")
      setTimeout(() => {
        toastContainer.classList.remove("show");
        window.name = JSON.stringify(savedProducts);
        window.location.href="./sell-your-products.html";
      },5000);
    })
  }
   if (updateProductBtn) {

    updateProductBtn.addEventListener("click", async() => {
      const prodData=getProductData()
      productDetailsData.push(prodData); 
      delete productData.editing
      try {
      let finalProduct = buildFinalProduct();
      finalProduct={...finalProduct, delId:productData._id}
      const keysToRemove = ["image", "thumb1", "thumb2", "thumb3", "thumb4"];
      let payload = {};

      for (const key in finalProduct) {
        if (finalProduct.hasOwnProperty(key) && !keysToRemove.includes(key)) {
          payload[key] = finalProduct[key];
        }
      }

      const userToken = localStorage.getItem("token");
      payload.token = userToken;

      const res = await fetch("http://taskapi.devdews.com/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      saveOrUpdateProduct(finalProduct)
      let data;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json(); 
      } else {
        data = await res.text(); 
      }
      scrollToTop();     
      if (res.ok && data.includes("Product Created Successfully")) {
        showToast("#19762d","Product Created Successfully");

      } else {
        showToast("#ea2f4b","Failed to create product. Try again.");
        console.error("Error creating product:", data);
        
      }
    
        } catch (err) {
          console.error("Network or code error:", err);
        }
         
        setTimeout(() => {
          toastContainer.classList.remove("show");
          formSaveBtn.classList.remove("not-active");
        updateProductBtn.classList.remove("active");
        window.location.href="./sell-your-products.html"
        }, 5000);
    })
  }
}


function saveOrUpdateProduct(product) {
  const existingIndex = savedProducts.findIndex(p => p._id === product._id);

  if (existingIndex > -1) {
    savedProducts[existingIndex] = product;
  } else {
    savedProducts.push(product);
  }
  window.name = JSON.stringify(savedProducts);
}

const viewReviewBtn=document.querySelector(".review-details-container .view-review-btn");
const reviewModalContainer=document.querySelector(".review-modal-container");
const reviewModalContent=reviewModalContainer.querySelector(".review-modal-content");
const reviewModalCloseBtn=reviewModalContainer.querySelector(".modal-close-btn");
const reviewEditBtn=reviewModalContainer.querySelector(".modal-footer .edit-btn");
const confirmBtn=reviewModalContainer.querySelector(".modal-footer .confirm-btn");

viewReviewBtn.addEventListener("click",()=>{
  reviewModalContainer.classList.add("active");
  body.classList.add("not-active");
})

reviewModalCloseBtn.addEventListener("click",()=>{
  closeModal();
    reviewModalContent.querySelectorAll("input").forEach((inp, index) => {
      inp.setAttribute("readonly", true);
    inp.value = values[index] || "";
  });
})
const values = [
  "Malhotra Collections",
  "+1 (713)-585-1189",
  "TX7741",
  "malhotra@gmail.com"
];


reviewModalContainer.addEventListener('click',(e)=>{
  if(!reviewModalContent.contains(e.target)){
    closeModal();
    reviewModalContent.querySelectorAll("input").forEach((inp, index) => {
      inp.setAttribute("readonly", true);
      
      inp.value = values[index] || "";
    });
  }
})
reviewEditBtn.addEventListener("click",()=>{
  const inputs=reviewModalContent.querySelectorAll("input")
  inputs.forEach(inp=>{
    inp.removeAttribute("readonly");
  })
  const firstInput = inputs[0];
  firstInput.focus();
  const len = firstInput.value.length;
  firstInput.setSelectionRange(len, len);
})

confirmBtn.addEventListener("click",()=>{
  closeModal();   
  reviewModalContent.querySelectorAll("input").forEach((inp, index) => {
    inp.setAttribute('readonly', true);
    inp.value = values[index] || "";
  });
})

document.addEventListener("DOMContentLoaded", async () => {
  await populateProductSelects();

  let allProducts = [];
  try {
    allProducts = JSON.parse(window.name || "[]");
  } catch {
    allProducts = [];
  }
  const filteredDrafts = allProducts.filter(p => !(p.editing && p.isPosted));
  savedProducts=filteredDrafts;

  const productToEdit = allProducts.find(p => p.editing === true);
  if (productToEdit) {

    if (productToEdit.isPosted) {
      updateAPIProductDetails(productToEdit,"editing");
    } else {
      updateLocalProductDetails(productToEdit,"editing");
    }
    updateSaveAndSubmitStatus();
  }
});
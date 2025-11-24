const addProductBtn=document.querySelector(".sell-container .add-unique .add-product-btn");
const dropdown = document.getElementById('statusDropdown');
const toggle = document.querySelector('.dropdown-toggle');
const dropdownList = document.querySelector('.dropdown-list');
const delToastContainer = document.querySelector(".del-toast-container");
const addProductModalContainer=document.querySelector(".add-product-modal-container");



addProductBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let existingProducts = [];

  try {
    existingProducts = JSON.parse(window.name || "[]");
  } catch {
    existingProducts = [];
  }

  if (Array.isArray(allProducts) && allProducts.length > 0) {

    allProducts = allProducts.filter(product => !product.editing);

    const allIds = new Set(existingProducts.map(p => p.id));
    allProducts.forEach(product => {
      if (!allIds.has(product.id)) {
        existingProducts.push(product);
      }
    });
  }

  existingProducts = existingProducts.filter(p => !p.editing);

  window.name = JSON.stringify(existingProducts);
    e.preventDefault();
    addProductModalContainer.classList.add("active");
    body.classList.add("not-active");
});

function showDelToast(bgc, message) {
  
  delToastContainer.querySelector("p").innerHTML= message;
  delToastContainer.style.backgroundColor=bgc;
  delToastContainer.classList.add("show");
}
toggle.addEventListener('click', () => {
  dropdownList.classList.toggle("active")
});

dropdownList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    toggle.childNodes[0].textContent = e.target.textContent;

    dropdown.querySelectorAll('.dropdown-list-item').forEach(li => li.classList.remove('active'));
    e.target.classList.add('active');

    dropdownList.classList.remove("active");
       
  }
});
window.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

function padZero(num){
  return num <10 ?"0"+num:num;
}
function formatDateTime(date = new Date()) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day =padZero( String(date.getDate()));
  const month = padZero(months[date.getMonth()]);
  const year = date.getFullYear();

  let hours =  date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 ;
  hours= hours? hours : 12;
  hours=padZero(hours);
  return `${month} ${day}, ${year} ${hours}:${minutes}${ampm}`;
}


let allProducts = [];  
let filteredProducts = []; 
let currentPage = 1;
const rowsPerPage = 5;


async function populateProductsTable() {
  const tableBody = document.querySelector(".products-listing .product-table tbody");
  tableBody.innerHTML = ""; 

  
  let drafts = window.name ? JSON.parse(window.name) : [];
  drafts = drafts.filter(p => !(p.editing && p.isPosted));
  let published = [];
  try {
    const res = await fetch("http://taskapi.devdews.com/api/products")
    if (res.ok) {
      published = await res.json();
    }
  } catch (err) {
    console.error("Error fetching published products:", err);
  }
  
  allProducts = [...drafts];
  allProducts = allProducts.filter(product => !product.delId);
  published.forEach(prod => {
    if (!drafts.find(d => d._id === prod._id)) {
      allProducts.push({ ...prod, isPosted: true }); 
    }
  });


  filteredProducts = [
  ...allProducts.filter(p => !p.isPosted).reverse(),  
  ...allProducts.filter(p => p.isPosted).reverse()
];
  renderTable();
  renderPagination();
}

function renderTable() {
  const tableWrapper=document.querySelector(".products-listing .table-wrapper")
  const tableBody = document.querySelector(".products-listing .product-table tbody");
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = filteredProducts.slice(start, end);
  if(filteredProducts.length==0){
      const oldMsg = tableWrapper.querySelector(".no-product");
      if (oldMsg) oldMsg.remove();
    tableWrapper.insertAdjacentHTML("beforeend", `<p class="no-product">No Products Found</p>`);
    return;
  }
  else{
     const oldMsg = tableWrapper.querySelector(".no-product");
    if (oldMsg) oldMsg.remove();
    pageItems.forEach(prod => {
    const row = document.createElement("tr");
    const modelDisplay =  prod.model;
    const isDraft = !prod.isPosted;
    const statusClass = isDraft ? "status-draft" : "status-published";
    const statusImg = isDraft ? "./assets/images/edit-draft.png" : "./assets/images/published.png";
    const statusText = isDraft ? "Draft" : "Posted";

    row.innerHTML = `
      <td class="selling-id" data-label="Selling Id">${prod._id.slice(0,8)}</td>
      <td data-label="Brand">${prod.brand}</td>
      <td data-label="Model">${modelDisplay}</td>
      <td data-label="Created On">${formatDateTime()}</td>
      <td data-label="Last Processed On">${formatDateTime()}</td>
      <td class="status ${statusClass}" data-label="Selling ">
        <img src="${statusImg}" alt="${statusText}">${statusText}
      </td>
      <td class="actions" data-label="Actions ">
        <button class="edit-btn"><img src="./assets/images/edit.png" alt="edit"></button>
        <button class="delete-btn"><img src="./assets/images/delete.png" alt="delete"></button>
      </td>
    `;
    tableBody.appendChild(row);
    attachRowListeners()
  });
  }
  
}

// DELETE from API
async function deleteApiProduct(productId) {
  const userToken = localStorage.getItem("token");
  try {
    const res = await fetch(`http://taskapi.devdews.com/api/products/delete/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken })
    });

    const data = await res.json();
    if (data.success) {
      scrollToSellerTop();
      showDelToast("#EA2F4B", "Product deleted successfully");
      removeFromAllProducts(productId); 
    } else {
      scrollToSellerTop();
      showDelToast("#EA2F4B", "Failed to delete product. Try again.");
      console.error("API delete error:", data);
    }

    setTimeout(() => delToastContainer.classList.remove("show"), 5000);
  } catch (error) {
    console.error("Error:", error);
  }
}


function deleteLocalProduct(productId) {
  let savedProducts = window.name ? JSON.parse(window.name) : [];
  savedProducts = savedProducts.filter(p => p._id !== productId);
  window.name = JSON.stringify(savedProducts);
  removeFromAllProducts(productId);

  scrollToSellerTop();
  showDelToast("#EA2F4B", "Draft deleted successfully");
  setTimeout(() => {
    delToastContainer.classList.remove("show");
  }, 5000);
}


function removeFromAllProducts(productId) {
  allProducts = allProducts.filter(p => p._id !== productId);
  filteredProducts = filteredProducts.filter(p => p._id !== productId);
  renderTable();
  renderPagination();
}


function attachRowListeners() {
  document.querySelectorAll(".edit-btn").forEach((btn, index) => {
    btn.onclick = () => handleEdit(filteredProducts[index]);
  });

  document.querySelectorAll(".delete-btn").forEach((btn, index) => {
    btn.onclick = () => {
      const product = filteredProducts[index];
      if (product.isPosted) {
        deleteApiProduct(product._id);   
      } else {
        deleteLocalProduct(product._id); 
      }
    };
  });
}


function handleEdit(product) {
  
  let allProducts = [];
  try {
    allProducts = JSON.parse(window.name || "[]");
  } catch {
    allProducts = [];
  }
    allProducts = allProducts.map(p => {
    const { editing, ...rest } = p; 
    return rest;
  });

  const productIndex = allProducts.findIndex(p => p._id === product._id);
  if (productIndex === -1) {
    allProducts.push({ ...product, editing: true });
  } else {
    allProducts[productIndex] = { ...product, editing: true };
  }

  window.name = JSON.stringify(allProducts);
  addProductModalContainer.classList.add("active");
  body.classList.add("not-active");
   processEditedProduct();
}

async function deleteProduct(productId) {
  const userToken = localStorage.getItem("token");
  try {
    const res = await fetch(`http://taskapi.devdews.com/api/products/delete/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: userToken })
  });

  const data = await res.json();

  if (data.success) {
    scrollToSellerTop()
    showDelToast( "#EA2F4B", "Product deleted successfully"); 
  } else {
    scrollToSellerTop()
    showDelToast("#EA2F4B", "Failed to delete product. Try again."); 
    console.error("Error deleting product:", data);
  }
  setTimeout(() => {
    delToastContainer.classList.remove("show");
  }, 5000);

  return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

function scrollToSellerTop(){
  window.scrollTo({
    top:0,  
  });
}
function renderPagination() {
  const paginationContainer = document.querySelector(".table-wrapper .pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);


  if (currentPage > 1) {
    paginationContainer.innerHTML += `
      <button class="prev">Prev</button>
    `;
  }

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
      <button class="page ${i === currentPage ? "active" : ""}">${i}</button>
    `;
  }

  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `
      <button class="next">Next</button>
    `;
  }

  const buttons = paginationContainer.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("prev")) {
        currentPage--;
      } else if (btn.classList.contains("next")) {
        currentPage++;
      } else {
        currentPage = Number(btn.textContent);
      }
      renderTable();
      renderPagination();
    });
  });
}


document.querySelector(".search-brand").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  filteredProducts = allProducts.filter(p =>
    p.brand.toLowerCase().includes(term) || p.model.toLowerCase().includes(term)
  );
  currentPage = 1;
  renderTable();
  renderPagination();
});


document.querySelectorAll("#statusDropdown li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelectorAll("#statusDropdown li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");

    const value = li.dataset.value;
    if (value === "all") {
      filteredProducts = [...allProducts];
    } else if (value === "draft") {
      filteredProducts = allProducts.filter(p => !p.isPosted);
    } else if (value === "posted") {
      filteredProducts = allProducts.filter(p => p.isPosted);
    } 

    currentPage = 1;
    renderTable();
    renderPagination();
  });
});



const productSearchInput = document.querySelector(".sell-products .sell-container .search-existing .search-box input");
const images = ["shoe-1.jpg", "shoe-2.jpg", "shoe-3.jpg", "shoe-4.jpg","s1.jpg", "s2.jpg", "s3.jpg", 
"s4.jpg", "s5.jpg", "s6.jpg","s7.jpg", "s8.jpg", "s9.jpg","s10.jpg", "s11.jpg", "s12.jpg",
"s13.jpg", "s14.jpg", "s15.jpg"];

productSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const searchTerm = e.target.value.trim(); 
    if (!searchTerm) return; 
    const dataToSend = {
    type: "search",
    keyword: searchTerm.trim().toLowerCase()
  };

    // let matchedProducts = [];
    // const brandWord = searchTerm.split(" ")[0].toLowerCase();
  
    // matchedProducts = allProducts
    //   .filter(product => product.brand.toLowerCase().includes(brandWord))
    //   .map((product, index) => ({
    //     ...product,
    //     image: `${images[index % images.length]}`
    //   }));

     sessionStorage.setItem("productSearchResults",JSON.stringify(dataToSend));
    window.location.href = "./product-list.html";
  }
});




document.addEventListener('DOMContentLoaded',populateProductsTable());
let allProducts = [];
const images = ["shoe-1.jpg", "shoe-2.jpg", "shoe-3.jpg", "shoe-4.jpg","s1.jpg", "s2.jpg", "s3.jpg", 
"s4.jpg", "s5.jpg", "s6.jpg","s7.jpg", "s8.jpg", "s9.jpg","s10.jpg", "s11.jpg", "s12.jpg",
"s13.jpg", "s14.jpg", "s15.jpg"];

const colors = ["Blue, Grey", "Dark Blue, White", "Orange, Light Grey", "Black, White"];
const sizeTypes = ["UK/India", "US Men", "US Women", "EU", "CM"]; 
const types=["new","used"];

async function fetchProducts() {
  try {
    const res = await fetch('http://taskapi.devdews.com/api/products');
    const data = await res.json();
    console.log(data)
    allProducts = data.map((product, index) => ({
      ...product,
      image: images[index % images.length],
      color: product.color || colors[index % colors.length],
      size_type: product.size_type || sizeTypes[index % sizeTypes.length],
      size: product.size || Math.floor(Math.random() * (10 - 6 + 1)) + 6,
      price: Number(product.price) || Math.floor(Math.random()*1000-50+1)+50,
      type: product.type || types[Math.floor(Math.random() * types.length)],
      views: product.views || Math.floor(Math.random() * (150 - 30 + 1)) + 30,
      likes: product.likes || Math.floor(Math.random() * (150 - 30 + 1)) + 30,
    }));

    return allProducts;
     

  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}



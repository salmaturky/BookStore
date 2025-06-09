window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

const books = [
  { id: 1, name: "", price: "", image: "images/book1.jpeg", description: "وصف الكتاب " },
  { id: 2, name: "", price: "", image: "", description: "وصف الكتاب "},
  { id: 3, name: "", price: "", image: "", description: "وصف الكتاب " },
  { id: 4, name: "", price: "", image: "", description: "وصف الكتاب " },
  { id: 5, name: "", price: "", image: "", description: "وصف الكتاب "},
  { id: 6, name: "", price: "", image: "", description: "وصف الكتاب "},
  { id: 7, name: "", price: "", image: "", description: "وصف الكتاب "},
  { id: 8, name: "", price: "", image: "", description: "وصف الكتاب "},
  { id: 9, name: "", price: "", image: "", description: "وصف الكتاب "},
  { id: 10, name: "", price: "", image: "", description: "وصف الكتاب "}
];

function showBooks() {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = "";
  books.forEach(book => {
    const box = document.createElement("div");
    box.className = "product"; 
    box.innerHTML = `
      <img src="${book.image}" alt="">
      <h3>${book.name}</h3>
      <p>${book.price}</p>
      <button onclick="addBook(${book.id})">أضف إلى السلة</button>
    `;
    container.appendChild(box);
  });
}

function addBook(id) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find(b => b.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const book = books.find(b => b.id === id);
    cart.push({ ...book, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  container.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;
  cart.forEach(item => {
    totalQty += item.qty;
    totalPrice += (+item.price || 0) * item.qty;
    const box = document.createElement("div");
    box.innerHTML = `
      <h3>${item.name}</h3>
      <p>Qty: ${item.qty}</p>
      <p>Price: ${item.price} شيكل</p>
      <button onclick="removeBook(${item.id})">Remove</button>
    `;
    container.appendChild(box);
  });
  document.getElementById("total-items").innerText = `Items: ${totalQty}`;
  document.getElementById("total-price").innerText = `Total: ${totalPrice} شيكل`;
}

function removeBook(id) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter(b => b.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  showCart();
}

function sendOrder() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    localStorage.removeItem("cart");
    document.getElementById("confirmation-message").innerText = "✅ Order sent!";
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showBooks();
  showCart();
  sendOrder();
});
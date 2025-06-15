window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
});

const books = [
    { id: 1, name: "القوقعة", price: "15", image: "images/book1.jpeg" },
    { id: 2, name: "حالات نادرة ١", price: "10", image: "images/book2.avif" },
    { id: 3, name: "يافا ", price: "25", image: "images/book3.webp" },
    { id: 4, name: "جنين ٢٠٠٢", price: "25", image: "images/book4.jpeg" },
    { id: 5, name: "ظل الريح", price: "15", image: "images/book5.jpeg" },
    { id: 6, name: "انتيخريستوس", price: "30", image: "images/book6.jpg" },
    { id: 7, name: "", price: "", image: "images/book7.jpeg" },
    { id: 8, name: "", price: "", image: "images/book8.jpeg" },
    { id: 9, name: "", price: "", image: "images/book9.jpeg" },
    { id: 10, name: "", price: "", image: "images/book10.jpeg" }
];

let displayedBooks = [...books];

function showBooks() {
    const container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = "";
    
    let filteredAndSortedBooks = applyFiltersAndSort(displayedBooks);

    if (filteredAndSortedBooks.length === 0) {
        container.innerHTML = "<p>لا توجد كتب مطابقة للمعايير المختارة.</p>";
        return;
    }

    filteredAndSortedBooks.forEach(book => {
        const box = document.createElement("div");
        box.className = "product";
        box.innerHTML = `
            <img src="${book.image}" alt="${book.name}">
            <h3>${book.name}</h3>
            <p>السعر: ${book.price} شيكل</p>
            <div class="quantity-control">
                <button onclick="changeQuantity(${book.id}, -1)">-</button>
                <span id="qty-${book.id}">1</span> 
                <button onclick="changeQuantity(${book.id}, 1)">+</button>
            </div>
            <button onclick="addBook(${book.id})">أضف إلى السلة</button>
        `;
        container.appendChild(box);
    });
}

function changeQuantity(id, delta) {
    const quantitySpan = document.getElementById(`qty-${id}`);
    let currentQty = parseInt(quantitySpan.innerText);
    let newQty = currentQty + delta;
    if (newQty < 1) newQty = 1;
    quantitySpan.innerText = newQty;
}

function addBook(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(b => b.id === id);
    
    const quantitySpan = document.getElementById(`qty-${id}`);
    const selectedQty = quantitySpan ? parseInt(quantitySpan.innerText) : 1;

    if (existing) {
        existing.qty += selectedQty;
    } else {
        const book = books.find(b => b.id === id);
        if (book) {
            cart.push({ ...book, qty: selectedQty });
        }
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
    if (cart.length === 0) {
        container.innerHTML = "<p>عربة التسوق فارغة.</p>";
    }
    cart.forEach(item => {
        totalQty += item.qty;
        totalPrice += (+item.price || 0) * item.qty; 
        const box = document.createElement("div");
        box.className = "cart-item";
        box.innerHTML = `
            <h3>${item.name}</h3>
            <p>الكمية: ${item.qty}</p>
            <p>السعر: ${item.price} شيكل</p>
            <button onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
            <button onclick="removeBook(${item.id})">إزالة</button>
        `;
        container.appendChild(box);
    });
    const totalItemsElement = document.getElementById("total-items");
    const totalPriceElement = document.getElementById("total-price");
    if (totalItemsElement) totalItemsElement.innerText = `المنتجات: ${totalQty}`;
    if (totalPriceElement) totalPriceElement.innerText = `الإجمالي: ${totalPrice} شيكل`;
}

function updateCartItemQuantity(id, delta) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemIndex = cart.findIndex(b => b.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        showCart();
    }
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
        document.getElementById("confirmation-message").innerText = "✅ تم إرسال طلبك بنجاح!";
        form.reset();
    });
}

function populateCategories() {
    
}

function applyFiltersAndSort(booksToFilter) {
    let filteredBooks = [...booksToFilter];

    const minPrice = parseFloat(document.getElementById("price-range-min")?.value) || 0; 
    const maxPrice = parseFloat(document.getElementById("price-range-max")?.value) || Infinity;
    const sortBy = document.getElementById("sort-by")?.value;

    
    filteredBooks = filteredBooks.filter(book => book.price >= minPrice && book.price <= maxPrice);

    if (sortBy === "price-asc") {
        filteredBooks.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        filteredBooks.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
        filteredBooks.sort((a, b) => a.name.localeCompare(b.name)); 
    } else if (sortBy === "name-desc") {
        filteredBooks.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filteredBooks;
}

document.addEventListener("DOMContentLoaded", () => {
    showBooks();
    showCart();
    sendOrder();

    populateCategories();

    const applyButton = document.getElementById("apply-filters-sort");
    if (applyButton) {
        applyButton.addEventListener("click", () => {
            displayedBooks = applyFiltersAndSort(books);
            showBooks();
        });
    }
});
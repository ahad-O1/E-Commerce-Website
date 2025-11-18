// Fetch and display products
async function fetchProducts() {
  try {
    const response = await fetch('api/products.json');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    const productContainer = document.querySelector('#productContainer');

    const dataProducts = data.map(item => {
      return `
      <div class="products" id="CardValue-${item.id}">
        <article class="information card">
          <span class="category">${item.category}</span>

          <div class="imageContainer">
            <img src="${item.image}" alt="${item.name}" class="productImage">
          </div>

          <h2 class="product-name">${item.name}</h2>
          <p class="product-description">${item.description}</p>

          <div class="productpriceElement">
            <p class="productPricee">$${item.price}</p>
            <p class="productActualprice"><del>$${item.actualPrice}</del></p>
          </div>

          <div class="productstockElement">
            <p class="productProperty">Total Stock:</p>
            <p class="productStock">${item.stock}</p>
          </div>

          <div class="ProductQuantityElement">
            <p class="productproperty">Quantity</p>
            <div class="stockElement">
              <button class="cartIncrement" data-id="${item.id}" data-stock="${item.stock}">+</button>
              <p class="productQuantity" id="quantity-${item.id}">1</p>
              <button class="cartDecrement" data-id="${item.id}" data-stock="${item.stock}">-</button>
            </div>
          </div>

       <button class="add-to-cart"
           data-id="${item.id}"
           data-name="${item.name}"
           data-price="${item.price}"
           data-image="${item.image}">
           Add to Cart
</button>


        </article>
      </div>
    `;
    });

    productContainer.innerHTML = dataProducts.join('');

    // Increment quantity
    document.querySelectorAll('.cartIncrement').forEach(button => {
      button.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const maxStock = parseInt(e.target.dataset.stock);
        const quantityElem = document.querySelector(`#quantity-${id}`);
        let current = parseInt(quantityElem.textContent);
        if (current < maxStock) quantityElem.textContent = current + 1;
      });
    });

    // Decrement quantity
    document.querySelectorAll('.cartDecrement').forEach(button => {
      button.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const quantityElem = document.querySelector(`#quantity-${id}`);
        let current = parseInt(quantityElem.textContent);
        if (current > 1) quantityElem.textContent = current - 1;
      });
    });

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', e => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const image = button.dataset.image;   // ⭐ important
        const qty = parseInt(document.getElementById(`quantity-${id}`).textContent);

        addToCart(id, name, qty, price, image);
        showNotification(name, qty);
      });
    });

  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// GLOBAL CART COUNTER
let totalCartItems = 0;

// ADD TO LOCAL STORAGE CART
function addToCart(id, name, quantity, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id == id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id,
      name,
      quantity,
      price,
      image: image || ""   // Prevent undefined bug
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}


// UPDATE CART ICON COUNTER
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cart.forEach(item => total += item.quantity);

  const items = document.getElementsByClassName('cart-count');
  for (let i = 0; i < items.length; i++) {
    items[i].textContent = total;
  }
}
// REMOVE ITEM FROM CART
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Remove item with matching ID
  cart = cart.filter(item => item.id != id);

  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart icon counter
  updateCartCount();

  // Remove item from HTML page
  const row = document.getElementById(`cart-item-${id}`);
  if (row) row.remove();

  // If cart becomes empty, show message
  const container = document.getElementById("cart-items");
  if (cart.length === 0) {
    container.innerHTML = "<h3>Your cart is empty.</h3>";
  }
}


// POPUP NOTIFICATION
function showNotification(productName, quantity) {
  const oldPopup = document.querySelector('.notification-popup');
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement('div');
  popup.className = 'notification-popup';
  popup.innerHTML = `
    ✅ <b>${productName}</b> (${quantity}) added to cart!
  `;

  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add('show'), 100);

  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 400);
  }, 3000);
}

// Load products and update cart count
fetchProducts();
updateCartCount();

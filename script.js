// Adding data to products Section
document.addEventListener("DOMContentLoaded", function () {
  // Fetch the JSON file
  fetch("./items/items.json")
    .then((response) => response.json())
    .then((data) => {
      const productsContainer = document.querySelector(".products-wrapper");

      // Clear any existing static product cards
      productsContainer.innerHTML = "";

      // Loop through JSON products and create HTML dynamically
      data.products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <div class="heart-wrapper">
              ${
                product.favorite
                  ? '<img src="./assets/Heart-filled.svg" alt="favorite">'
                  : '<img src="./assets/Heart.svg" alt="heart">'
              }
            </div>
            <div class="product-card-content">
              <img src="${product.image}" alt="product-image">
              <p>${product.name}</p>
              <h3>$${product.price}</h3>
              <button class="add-to-cart">Add To Cart</button>
            </div>
          `;

        // Append product card to the container
        productsContainer.appendChild(productCard);

        const addToCartMessage = document.querySelector(".add-to-cart-message");
        const addToCartButton = productCard.querySelector(".add-to-cart");
        const body = document.querySelector("body");
        const closeMessageButton = document.querySelector(".close-message-btn");
        const addToCartMessageBackground = document.querySelector(".add-to-cart-message-background");

        addToCartButton.addEventListener("click", function () {
          addToCart(product);
          addToCartMessage.classList.toggle("active-message");
          body.style.overflow = "hidden";
          addToCartMessageBackground.style.left = "0";
        });

        closeMessageButton.addEventListener("click", () => {
          body.style.overflow = "visible";
          addToCartMessageBackground.style.left = "-100vw";
          addToCartMessage.classList.remove("active-message");
        });
        
        addToCartMessageBackground.addEventListener("click", function () {
          addToCartMessageBackground.style.left = "-100vw";
          body.style.overflow = "visible";
          addToCartMessage.classList.remove("active-message");
        });
      });
    })
    .catch((error) => console.error("Error loading JSON:", error));
});

// Adding data to categories Section
document.addEventListener("DOMContentLoaded", function () {
  fetch("./items/category.json")
    .then((response) => response.json())
    .then((categories) => {
      const categoryWrapper = document.querySelector(".category-cards-wrapper");
      categoryWrapper.innerHTML = ""; // Clear existing content

      categories.forEach((category) => {
        const card = document.createElement("div");
        card.classList.add("category-card");

        card.innerHTML = `
            <img src="${category.image}" alt="${category.category}" />
            <p>${category.category}</p>
          `;

        categoryWrapper.appendChild(card);
      });
    })
    .catch((error) => console.error("Error loading category data:", error));
});

// Function to add product to localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists in the cart
  let existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1; // Increase quantity if already in cart
  } else {
    cart.push({ ...product, quantity: 1 }); // Add new product with quantity
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  // alert(`${product.name} added to cart!`);
}

document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.querySelector(".products-list");
  cartContainer.innerHTML = ""; // Clear existing content

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    document.querySelector(
      ".subtotal p.black-style-large"
    ).textContent = `$0.00`;
    document.querySelector(".tax p.black-style-large").textContent = `$0.00`;
    document.querySelector(
      ".shipping p.black-style-large"
    ).textContent = `$0.00`;
    document.querySelector(".total p.black-style-large").textContent = `$0.00`;
    cartContainer.innerHTML = `
          <div class='empty-cart-wrapper'>
              <img class='empty-logo' src='./assets/empty-shopping-cart.webp' alt='empty-cart-logo'/>
              <p class='empty-card-title'>Your shopping cart is empty.</p>
          </div>
      `;
    return; // Exit if the cart is empty
  }

  let totalQuantity = cart.reduce((acc, product) => acc + product.quantity, 0);
  console.log(totalQuantity);
  let totalPrice = cart.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  console.log(totalPrice);

  const tax = totalQuantity * 20;
  const shippingCost = totalQuantity * 14;
  const totalAmount = totalPrice + tax + shippingCost;

  document.querySelector(
    ".subtotal p.black-style-large"
  ).textContent = `$${totalPrice.toFixed(2)}`;
  document.querySelector(
    ".tax p.black-style-large"
  ).textContent = `$${tax.toFixed(2)}`;
  document.querySelector(
    ".shipping p.black-style-large"
  ).textContent = `$${shippingCost.toFixed(2)}`;
  document.querySelector(
    ".total p.black-style-large"
  ).textContent = `$${totalAmount.toFixed(2)}`;

  if (totalQuantity === 0) {
    cartContainer.innerHTML = `
          <div class='empty-cart-wrapper'>
              <img class='empty-logo' src='./assets/empty-shopping-cart.webp' alt='empty-cart-logo'/>
              <p class='empty-card-title'>Your shopping cart is empty.</p>
          </div>
      `;

    return; // Exit if the total quantity is 0
  }

  cart.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    productDiv.innerHTML = `
          <img class="product-img" src="${product.image}" alt="product-image">
          <div class="product-content">
              <div class="product-info">
                  <h3>${product.name}</h3>
                  <p>#${product.id}</p>
              </div>
              <div class="product-second-line">
                  <div class="product-quantity">
                      <button class="decrease" data-index="${index}">−</button>
                      <input type="text" value="${product.quantity}" disabled>
                      <button class="increase" data-index="${index}">+</button>
                  </div>
                  <p class="product-price">$${(
                    product.price * product.quantity
                  ).toFixed(2)}</p>
                  <img class="delete-button" src="./assets/Delete-Button.svg" alt="delete-button" data-index="${index}">
              </div>
          </div>
      `;
    cartContainer.appendChild(productDiv);
  });

  // Add event listeners for quantity buttons (already correct)
  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      updateQuantity(this.dataset.index, "increase");
    });
  });

  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      updateQuantity(this.dataset.index, "decrease");
    });
  });

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      removeFromCart(this.dataset.index);
    });
  });
});

// Function to update quantity
function updateQuantity(index, action) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (action === "increase") {
      cart[index].quantity += 1;
      const quantityField = document.querySelectorAll(".product-quantity input")[index];
      if (quantityField) {
          quantityField.value = cart[index].quantity;
      }
  } else if (action === "decrease" && cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      const quantityField = document.querySelectorAll(".product-quantity input")[index];
      if (quantityField) {
          quantityField.value = cart[index].quantity;
      }
  } else if (action === "decrease" && cart[index].quantity <= 1) {
      cart = cart.filter((_, i) => i != index);
      if (cart.length === 0) {
          localStorage.removeItem("cart");
          updateOrderSummary(0, 0, 0, 0);
          const cartContainer = document.querySelector(".products-list");
          cartContainer.innerHTML = `
              <div class='empty-cart-wrapper'>
                  <img class='empty-logo' src='./assets/empty-shopping-cart.webp' alt='empty-cart-logo'/>
                  <p class='empty-card-title'>Your shopping cart is empty.</p>
              </div>
          `;
          return;
      }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay(); // Update display and prices
}

function updateCartDisplay() {
  const cartContainer = document.querySelector(".products-list");
  cartContainer.innerHTML = "";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
      updateOrderSummary(0, 0, 0, 0);
      cartContainer.innerHTML = `
          <div class='empty-cart-wrapper'>
              <img class='empty-logo' src='./assets/empty-shopping-cart.webp' alt='empty-cart-logo'/>
              <p class='empty-card-title'>Your shopping cart is empty.</p>
          </div>
      `;
      return;
  }

  let totalQuantity = cart.reduce((acc, product) => acc + product.quantity, 0);
  let totalPrice = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

  const tax = totalQuantity * 20;
  const shippingCost = totalQuantity * 14;
  const totalAmount = totalPrice + tax + shippingCost;

  updateOrderSummary(totalPrice, tax, shippingCost, totalAmount);

  cart.forEach((product, index) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      productDiv.innerHTML = `
          <img class="product-img" src="${product.image}" alt="product-image">
          <div class="product-content">
              <div class="product-info">
                  <h3>${product.name}</h3>
                  <p>#${product.id}</p>
              </div>
              <div class="product-second-line">
                  <div class="product-quantity">
                      <button class="decrease" data-index="${index}">−</button>
                      <input type="text" value="${product.quantity}" disabled>
                      <button class="increase" data-index="${index}">+</button>
                  </div>
                  <p class="product-price">$${(product.price * product.quantity).toFixed(2)}</p>
                  <img class="delete-button" src="./assets/Delete-Button.svg" alt="delete-button" data-index="${index}">
              </div>
          </div>
      `;
      cartContainer.appendChild(productDiv);

      if (index < cart.length - 1) { // Add divider if not the last item
        const divider = document.createElement("div");
        divider.classList.add("product-divider");
        cartContainer.appendChild(divider); // Append the divider
    }
  });

  document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", function (e) {
          e.preventDefault();
          updateQuantity(this.dataset.index, "increase");
      });
  });

  document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", function (e) {
          e.preventDefault();
          updateQuantity(this.dataset.index, "decrease");
      });
  });

  document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", function (e) {
          e.preventDefault();
          removeFromCart(this.dataset.index);
      });
  });
}

function updateOrderSummary(subtotal, tax, shipping, total) {
  document.querySelector(".subtotal p.black-style-large").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector(".tax p.black-style-large").textContent = `$${tax.toFixed(2)}`;
  document.querySelector(".shipping p.black-style-large").textContent = `$${shipping.toFixed(2)}`;
  document.querySelector(".total p.black-style-large").textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", updateCartDisplay);

// Function to remove product from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove selected product

  if (cart.length === 0) {
      localStorage.removeItem("cart");

      updateOrderSummary(0, 0, 0, 0);

      const cartContainer = document.querySelector(".products-list");
      cartContainer.innerHTML = `
          <div class='empty-cart-wrapper'>
              <img class='empty-logo' src='./assets/empty-shopping-cart.webp' alt='empty-cart-logo'/>
              <p class='empty-card-title'>Your shopping cart is empty.</p>
          </div>
      `;
      return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay(); // Update the cart display
}
// Adding data to discounts Section
document.addEventListener("DOMContentLoaded", () => {
  fetch("./items/discounts.json")
      .then((response) => response.json())
      .then((data) => {
          const discountsWrapper = document.querySelector(".discounts-section .products-wrapper");
          discountsWrapper.innerHTML = "";

          data.forEach((product) => {
              const productCard = document.createElement("div");
              productCard.classList.add("product-card");

              productCard.innerHTML = `
                  <div class="heart-wrapper">
                      <img src="./assets/Heart.svg" alt="heart" />
                  </div>
                  <div class="product-card-content">
                      <img src="${product.image}" alt="${product.name}" />
                      <p>${product.name}</p>
                      <h3>$${product.price}</h3>
                      <button class="add-to-cart-discount">Add To Cart</button>
                  </div>
              `;

              discountsWrapper.appendChild(productCard);

              const addToCartMessage = document.querySelector(".add-to-cart-message");
              const addToCartButton = productCard.querySelector(".add-to-cart-discount");
              const body = document.querySelector("body");
              const addToCartMessageBackground = document.querySelector(".add-to-cart-message-background");

              addToCartButton.addEventListener("click", function () {
                addToCart(product);
                body.style.overflow = "hidden";
                addToCartMessageBackground.style.left = "0";
                addToCartMessage.classList.toggle("active-message");
              });
          });
      })
      .catch((error) => console.error("Error fetching discounts.json:", error));
});


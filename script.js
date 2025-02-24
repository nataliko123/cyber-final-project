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
              <button>Add To Cart</button>
            </div>
          `;

        // Append product card to the container
        productsContainer.appendChild(productCard);
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


// Adding data to discounts Section
document.addEventListener("DOMContentLoaded", () => {
    fetch("./items/discounts.json")
      .then((response) => response.json())
      .then((data) => {
        const discountsWrapper = document.querySelector(
          ".discounts-section .products-wrapper"
        );
  
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
              <button>Add To Cart</button>
            </div>
          `;
  
          discountsWrapper.appendChild(productCard);
        });
      })
      .catch((error) => console.error("Error fetching discounts.json:", error));
  });
  
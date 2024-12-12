document.addEventListener("DOMContentLoaded", () => {
    const medicineSection = document.getElementById("medicine-section");
    const cartTable = document.getElementById("cart-table").getElementsByTagName("tbody")[0];
    const totalPriceElement = document.getElementById("total-price");
    const addToFavoritesButton = document.getElementById("add-to-favorites");
    const applyFavoritesButton = document.getElementById("apply-favorites");
    const clearAllButton = document.getElementById("clear-all");  // New Clear All button

    let cart = [];  // Cart starts empty on page load
    let favoriteCart = JSON.parse(localStorage.getItem("favoriteCart")) || [];

    // Fetch medicine data from the JSON file
    fetch("pharmacy.json")
        .then(response => response.json())
        .then(data => {
            displayMedicines(data);
        })
        .catch(error => {
            console.error("Error loading medicines:", error);
            alert("Failed to load medicines. Please try again later.");
        });

    // Display medicines on the page
    function displayMedicines(data) {
        Object.keys(data).forEach(category => {
            const categoryHeading = document.createElement("h2");
            categoryHeading.textContent = category;
            medicineSection.appendChild(categoryHeading);

            const categoryContainer = document.createElement("div");
            categoryContainer.classList.add("medicine-category");

            data[category].forEach(medicine => {
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("medicine-item");

                const img = document.createElement("img");
                img.src = medicine.image;
                img.alt = medicine.alt;
                itemContainer.appendChild(img);

                const name = document.createElement("h3");
                name.textContent = medicine.name;
                itemContainer.appendChild(name);

                const price = document.createElement("p");
                price.textContent = `Price: Rs. ${medicine.price.toFixed(2)}`;
                itemContainer.appendChild(price);

                const button = document.createElement("button");
                button.textContent = "Add to Cart";
                button.dataset.name = medicine.name;
                button.dataset.price = medicine.price;
                button.addEventListener("click", addToCart);
                itemContainer.appendChild(button);

                categoryContainer.appendChild(itemContainer);
            });

            medicineSection.appendChild(categoryContainer);
        });
    }

    // Add medicine to the cart
    function addToCart(event) {
        const button = event.target;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
    }

    // Update the cart table
    function updateCart() {
        cartTable.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const row = cartTable.insertRow();
            row.insertCell(0).textContent = item.name;
            row.insertCell(1).textContent = `Rs. ${(item.price).toFixed(2)}`;

            // Quantity input field
            const quantityCell = row.insertCell(2);
            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            quantityInput.addEventListener("change", () => updateQuantity(item.name, quantityInput.value));
            quantityCell.appendChild(quantityInput);

            row.insertCell(3).textContent = `Rs. ${(item.quantity * item.price).toFixed(2)}`;

            // Add "Remove" button to remove item from cart
            const removeCell = row.insertCell(4);
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => removeItem(index));
            removeCell.appendChild(removeButton);

            totalPrice += item.quantity * item.price;
        });

        totalPriceElement.textContent = `Total Price: Rs. ${totalPrice.toFixed(2)}`;
    }

    // Update item quantity in the cart
    function updateQuantity(name, newQuantity) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity = parseInt(newQuantity, 10);
            updateCart();
        }
    }

    // Remove item from the cart
    function removeItem(index) {
        cart.splice(index, 1);
        updateCart();

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to the cart.");
        }
    }

    // Add cart items to favorites
    addToFavoritesButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to the cart before adding to favorites.");
            return;
        }
        favoriteCart = [...cart];  // Save the current cart as favorite
        localStorage.setItem("favoriteCart", JSON.stringify(favoriteCart));
        alert("Your cart items have been added to favorites.");
    });

    // Apply favorite cart items
    applyFavoritesButton.addEventListener("click", () => {
        favoriteCart = JSON.parse(localStorage.getItem("favoriteCart")) || [];
        if (favoriteCart.length === 0) {
            alert("No favorite items found. Please add items to favorites first.");
        } else {
            cart = [...favoriteCart]; // Apply favorite items to the cart
            updateCart();
            alert("Your favorite items have been applied to the cart.");
        }
    });

    // Clear all items in the cart
    clearAllButton.addEventListener("click", () => {
        cart = [];  // Clear cart
        updateCart();
        alert("Your cart has been cleared.");
    });

    // Proceed to checkout
    document.getElementById("buy-now").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
    
        // Save cart data to localStorage before navigating to checkout page
        localStorage.setItem("cartData", JSON.stringify(cart));
    
        // Redirect to checkout page
        window.location.href = "checkout.html";
    });

    // Initial render of the cart (empty by default)
    updateCart();
});

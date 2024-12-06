// Wait for the document to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Get the cart data from localStorage
    const cartData = JSON.parse(localStorage.getItem("cartData")) || [];

    // References to elements on the page
    const checkoutTableBody = document.querySelector("#checkout-table tbody");
    const totalCheckoutPriceElement = document.getElementById("total-checkout-price");

    // Function to display the cart items in the checkout table
    function displayCartItems() {
        let totalCheckoutPrice = 0;

        // Clear the table before adding new rows
        checkoutTableBody.innerHTML = "";

        cartData.forEach(item => {
            const row = checkoutTableBody.insertRow();

            // Insert cells for medicine name and total price
            row.insertCell(0).textContent = item.name;
            row.insertCell(1).textContent = `Rs. ${(item.price * item.quantity).toFixed(2)}`;

            totalCheckoutPrice += item.price * item.quantity;
        });

        // Display total price
        totalCheckoutPriceElement.textContent = `Total Price: Rs. ${totalCheckoutPrice.toFixed(2)}`;

        // Clear cart after order is placed
        localStorage.removeItem("cartData");
    }

    // Display cart items on page load
    displayCartItems();

    // Checkout form submission
    document.getElementById("submit").addEventListener("click", function () {
        // Get form values
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const zip = document.getElementById("zip").value;
        const paymentMethod = document.getElementById("payment").value;
        const cardNumber = document.getElementById("card-number").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;

        // Validate the fields
        if (name && email && phone && address && city && zip && paymentMethod) {
            let isPaymentValid = true;

            // Validate card details if payment method is card
            if (paymentMethod === "card") {
                if (!cardNumber || !expiryDate || !cvv) {
                    isPaymentValid = false;
                    alert("Please enter all card details.");
                }
            }

            // If all fields are valid
            if (isPaymentValid) {
                // Calculate delivery date (3 days from today)
                const today = new Date();
                today.setDate(today.getDate() + 3);
                const deliveryDate = today.toDateString();

                // Hide the form and show the thank you message
                document.getElementById("checkout-form").style.display = "none";
                const thankYouMessage = document.getElementById("thankYouMessage");
                thankYouMessage.style.display = "block";

                // Set thank you message content
                const thankYouText = document.getElementById("thankYouText");
                thankYouText.textContent = "";
                const thankYouHeading = document.createElement("strong");
                thankYouHeading.textContent = `Thank you, ${name}!`;
                thankYouText.appendChild(thankYouHeading);
                thankYouText.appendChild(document.createElement("br"));

                const orderText = document.createElement("span");
                orderText.textContent = `Your payment has been successfully processed. `;
                thankYouText.appendChild(orderText);
                thankYouText.appendChild(document.createElement("br"));

                const deliveryText = document.createElement("span");
                deliveryText.textContent = `Your order will be delivered to ${address}, ${city} by ${deliveryDate}.`;
                thankYouText.appendChild(deliveryText);
                thankYouText.appendChild(document.createElement("br"));

                const emailText = document.createElement("span");
                emailText.textContent = `An email confirmation has been sent to ${email}.`;
                thankYouText.appendChild(emailText);
            }
        } else {
            alert("Please fill in all the required fields.");
        }
    });
});

// Handle payment method change
document.getElementById("payment").addEventListener("change", function() {
    const paymentMethod = this.value;
    const cardDetails = document.getElementById("card-details");

    if (paymentMethod === "card") {
        cardDetails.style.display = "block";
    } else {
        cardDetails.style.display = "none";
    }
});
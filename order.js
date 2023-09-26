document.addEventListener('DOMContentLoaded', function () {
    const foodMenuList = document.getElementById('food-menu-list');
    const beverageMenuList = document.getElementById('beverage-menu-list');
    const orderNowButton = document.getElementById('order-now');
    const orderForm = document.getElementById('order-form');

    let orderDetails = {};

    function updateOrder(itemElement, action) {
        const item = itemElement.getAttribute('data-item');
        const quantityElement = itemElement.querySelector('.quantity');
        const priceElement = itemElement.querySelector('.price');

        let quantity = parseInt(quantityElement.textContent);
        const price = parseFloat(priceElement.textContent.replace('$', ''));

        if (action === 'add') {
            quantity += 1;
        } else if (action === 'subtract' && quantity > 0) {
            quantity -= 1;
        }

        quantityElement.textContent = quantity;

        if (quantity > 0) {
            orderDetails[item] = {
                quantity,
                price,
            };
        } else {
            delete orderDetails[item];
        }
    }

    foodMenuList.addEventListener('click', function (event) {
        if (event.target.classList.contains('order-button')) {
            const itemElement = event.target.parentElement;
            updateOrder(itemElement, event.target.getAttribute('data-action'));
        }
    });

    beverageMenuList.addEventListener('click', function (event) {
        if (event.target.classList.contains('order-button')) {
            const itemElement = event.target.parentElement;
            updateOrder(itemElement, event.target.getAttribute('data-action'));
        }
    });

    function showLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.style.opacity = '1';
    }
    function hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.style.opacity = '0';
    }
    document.getElementById('order-now').addEventListener('click', function () {
        // Show the loading overlay when the button is clicked
        showLoadingOverlay();
    
        // Simulate a delay (e.g., 2 seconds) before redirecting to the invoice page
        setTimeout(function () {
            const orderForm = document.getElementById('order-form');
            orderForm.submit(); // Submit the form to go to the invoice page
        }, 2000); // Adjust the delay as needed
    }); 

    orderNowButton.addEventListener('click', function () {
        if (Object.keys(orderDetails).length === 0) {
            alert('Please select items to order.');
        } else {
            const items = [];
            let totalPrice = 0;

            for (const item in orderDetails) {
                const { quantity, price } = orderDetails[item];
                const itemTotal = quantity * price;
                items.push(`${item}: ${quantity} x $${price.toFixed(2)} = $${itemTotal.toFixed(2)}`);
                totalPrice += itemTotal;
            }

            const taxRate = 0.1; // 10% tax rate (adjust as needed)
            const taxAmount = totalPrice * taxRate;
            const grandTotal = totalPrice + taxAmount;

            items.push(`Tax (10%): $${taxAmount.toFixed(2)}`);
            items.push(`Total: $${grandTotal.toFixed(2)}`);

            // Set the order details as a JSON string in the hidden form field
            document.querySelector('input[name="orderDetails"]').value = JSON.stringify(orderDetails);

            // Redirect to the invoice page with order details as query parameters
            const queryParams = encodeURIComponent(JSON.stringify(orderDetails));
            window.location.href = `invoice.html?orderDetails=${queryParams}`;
            
            // Reset order details
            orderDetails = {};

            // Clear quantities on the page
            const quantityElements = [...foodMenuList.querySelectorAll('.quantity'), ...beverageMenuList.querySelectorAll('.quantity')];
            quantityElements.forEach(function (element) {
                element.textContent = '0';
            });
        }
    });
});

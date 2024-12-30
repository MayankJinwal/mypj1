document.addEventListener('DOMContentLoaded', function () {
    const orderButtons = document.querySelectorAll('.order-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const servicesSection = document.querySelector('.services');
    const authSection = document.querySelector('.auth');
    let cart = [];

    // Track user authentication state
    let isAuthenticated = false; // User is not authenticated initially


    // Function to update the cart display
    function updateCart() {
        cartItemsContainer.innerHTML = ''; // Clear previous cart items
        let totalPrice = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} (₹${item.price})</span>
                <div class="quantity-controls">
                    <button class="decrease-btn" data-name="${item.name}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increase-btn" data-name="${item.name}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        totalPriceContainer.textContent = `Total: ₹${totalPrice}`;
    }

    // Add event listeners to all "Order Now" buttons
    orderButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (!isAuthenticated) {
                alert('Please log in or sign up to access services.');
                return;
            }

            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseInt(menuItem.getAttribute('data-price'));

            const existingItem = cart.find(item => item.name === itemName);

            if (existingItem) {
                // If item is already in the cart, increase the quantity
                existingItem.quantity += 1;
            } else {
                // If item is not in the cart, add it with initial quantity 1
                cart.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: 1
                });
            }

            // Update the cart display
            updateCart();
        });
    });

    // Event delegation for quantity controls
    cartItemsContainer.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('increase-btn') || target.classList.contains('decrease-btn')) {
            const itemName = target.getAttribute('data-name');
            const item = cart.find(item => item.name === itemName);
            
            if (target.classList.contains('increase-btn')) {
                item.quantity += 1;
            } else if (target.classList.contains('decrease-btn')) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart = cart.filter(cartItem => cartItem.name !== itemName);
                }
            }
            
            updateCart();
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Dummy validation for login (replace with actual backend validation)
        if (username === 'user' && password === 'password') {
            alert('Login successful!');
            isAuthenticated = true;
            authSection.style.display = 'none'; // Hide auth section after login
            servicesSection.style.display = 'block'; // Show services section after login
        } else {
            alert('Invalid credentials!');
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        // Dummy signup validation (replace with actual backend validation)
        if (username && password) {
            alert('Signup successful! Please log in.');
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        } else {
            alert('Please fill out both fields.');
        }
    });
});

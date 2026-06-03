// Authentication Guard and Global Logic for Sparkle
document.addEventListener('DOMContentLoaded', () => {
    const isRegistered = localStorage.getItem('sparkle_authenticated');
    const currentPage = window.location.pathname.split('/').pop();

    const protectedPages = [
        'products.html',
        'nivia-spiral.html',
        'cosco-volley.html',
        'mikasa-gt18.html',
        'vector-x.html',
        'senston-spansyon.html',
        'jj-jonex.html',
        'nivia-g2020.html'
    ];

    if (protectedPages.includes(currentPage) && !isRegistered) {
        alert('Please register to access this page.');
        window.location.href = 'register.html';
    }

    // Update Navbar if logged in
    if (isRegistered) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.querySelector('.btn-logout')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.className = 'btn-logout';
            logoutLink.innerText = 'Logout';
            logoutLink.style.color = '#ff4444';
            logoutLink.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('sparkle_authenticated');
                window.location.href = 'index.html';
            };
            navLinks.appendChild(logoutLink);
        }
    }

    // Cart Logic Initialization
    updateCartDisplay();
    if (currentPage === 'cart.html') {
        renderCart();
    }
});

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('sparkle_cart') || '[]');
        cartCount.innerText = cart.length;
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cart = JSON.parse(localStorage.getItem('sparkle_cart') || '[]');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="3" class="empty-cart-msg">Your cart is empty. <br><br> <a href="products.html" class="back-link" style="margin-top:0">Start Shopping</a></td></tr>';
        if (cartTotalElement) cartTotalElement.innerText = '₹0';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <tr>
                <td class="cart-item-name">${item.name}</td>
                <td>₹${item.price.toLocaleString()}</td>
                <td><button class="remove-btn" onclick="removeFromCart(${index})">Remove</button></td>
            </tr>
        `;
    }).join('');

    if (cartTotalElement) cartTotalElement.innerText = `₹${total.toLocaleString()}`;
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('sparkle_cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('sparkle_cart', JSON.stringify(cart));
    updateCartDisplay();
    renderCart();
}

function addToCart(productName, price) {
    const isRegistered = localStorage.getItem('sparkle_authenticated');
    if (!isRegistered) {
        alert('Please register to add items to your cart.');
        window.location.href = 'register.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('sparkle_cart') || '[]');
    cart.push({ name: productName, price: price });
    localStorage.setItem('sparkle_cart', JSON.stringify(cart));
    updateCartDisplay();
    alert(productName + ' added to cart!');
}

function registerUser(event) {
    event.preventDefault();
    const form = event.target;
    // Specifically looking for the password fields
    const passwords = form.querySelectorAll('input[type="password"]');
    const password = passwords[0].value;
    const confirmPassword = passwords[1].value;
    const phone = form.querySelector('input[type="tel"]').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (phone.length < 10) {
        alert('Please enter a valid 10-digit contact number.');
        return;
    }

    // Simulate registration
    localStorage.setItem('sparkle_authenticated', 'true');
    alert('Registration Successful! Welcome to Sparkle.');
    window.location.href = 'products.html';
}

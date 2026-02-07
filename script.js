// Cart array to store items
let cart = [];

// Get all "Agregar al carrito" buttons
const addToCartButtons = document.querySelectorAll('.btn-comprar');

// Add event listener to each button
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Get the product information from the card
        const card = this.closest('.card');
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.precio').textContent;
        const image = card.querySelector('img').src;
        
        // Create product object
        const product = {
            id: Date.now(),
            title: title,
            price: parseFloat(price.replace('$', '')),
            image: image,
            quantity: 1
        };
        
        // Add to cart
        addToCart(product);
        
        // Show feedback to user
        this.textContent = '✓ Agregado';
        this.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            this.textContent = 'Agregar al carrito';
            this.style.backgroundColor = '';
        }, 1500);
    });
});

// Function to add item to cart
function addToCart(product) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.title === product.title);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }
    
    console.log('Carrito actualizado:', cart);
    updateCartDisplay();
    saveCart();
}

// Function to update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotalDiv.innerHTML = '';
        return;
    }
    
    let cartHTML = '<table class="cart-table"><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr>';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        cartHTML += `
            <tr>
                <td>${item.title}</td>
                <td>$${item.price}</td>
                <td>
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button class="remove-btn" onclick="removeFromCart(${index})">Eliminar</button></td>
            </tr>
        `;
    });
    
    cartHTML += '</table>';
    cartItemsDiv.innerHTML = cartHTML;
    
    cartTotalDiv.innerHTML = `<div class="cart-summary"><h3>Total: $${total.toFixed(2)}</h3></div>`;
}

// Function to change quantity
function changeQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        removeFromCart(index);
    }
    updateCartDisplay();
    saveCart();
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    saveCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart when page loads
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Load cart when page loads
loadCart();

// Checkout button
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
        } else {
            alert('Proceeding to checkout with $' + getTotalPrice().toFixed(2));
        }
    });
}

// Function to get total price
function getTotalPrice() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
const products = [
    {
        id: 1,
        name: "Camiseta Oficial Penya Sitges (Blava)",
        price: 15.00,
        type: "camiseta",
        image: "camiseta-1.png"
    },
    {
        id: 2,
        name: "Camiseta Oficial Penya Sitges (Grana)",
        price: 15.00,
        type: "camiseta",
        image: "camiseta-2.png"
    },
    {
        id: 3,
        name: "Polo Oficial Penya Sitges (Blava)",
        price: 20.00,
        type: "camiseta",
        image: "polo-1.png"
    },
    {
        id: 4,
        name: "Polo Oficial Penya Sitges (Grana)",
        price: 20.00,
        type: "camiseta",
        image: "polo-2.png"
    },
    {
        id: 5,
        name: "Gorra PB Sitges (Negre)",
        price: 10.00,
        type: "gorra",
        image: "gorra-negra.png"
    },
    {
        id: 6,
        name: "Gorra PB Sitges (Grana)",
        price: 10.00,
        type: "gorra",
        image: "gorra-grana.png"
    },
    {
        id: 7,
        name: "Gorra PB Sitges (Blava)",
        price: 10.00,
        type: "gorra",
        image: "gorra-blava.png"
    }

];

let cart = [];

// Initialize Grids
function renderProducts() {
    const camisetesGrid = document.getElementById('camisetes-grid');
    const gorresGrid = document.getElementById('gorres-grid');

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group";
        
        let selectorsHtml = '';
        if (product.type === 'camiseta') {
            selectorsHtml = `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Talla</label>
                    <select id="size-${product.id}" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fcb-blue">
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="relative overflow-hidden h-64 bg-gray-100 cursor-zoom-in" onclick="openLightbox('${product.image}')">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg font-bold text-fcb-grana text-sm">
                    ${product.price.toFixed(2)}€
                </div>
            </div>
            <div class="p-5">
                <h4 class="font-bold text-gray-800 mb-4 h-12 flex items-center">${product.name}</h4>
                ${selectorsHtml}
                <div class="mb-4">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Quantitat</label>
                    <input type="number" id="qty-${product.id}" value="1" min="1" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fcb-blue">
                </div>
                <button onclick="addToCart(${product.id})" class="w-full bg-fcb-blue text-white font-bold py-3 rounded-xl hover:bg-fcb-grana transition-colors flex items-center justify-center gap-2">
                    Seleccionar
                </button>
            </div>
        `;

        if (product.type === 'camiseta') {
            camisetesGrid.appendChild(card);
        } else {
            gorresGrid.appendChild(card);
        }
    });
}

// Cart Logic
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const qty = parseInt(document.getElementById(`qty-${productId}`).value);
    const size = product.type === 'camiseta' ? document.getElementById(`size-${productId}`).value : null;

    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ ...product, qty, size });
    }

    updateCartUI();
    
    // Simple toast animation could go here
};

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const totalPriceEl = document.getElementById('total-price');
    const cartCountSidebar = document.getElementById('cart-count-sidebar');
    const cartCountMobile = document.getElementById('cart-count-mobile');

    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.appendChild(emptyMsg);
        totalPriceEl.textContent = '0.00€';
        cartCountSidebar.textContent = '0 items';
        cartCountMobile.classList.add('hidden');
    } else {
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += item.price * item.qty;
            count += item.qty;

            const itemEl = document.createElement('div');
            itemEl.className = "flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 relative group";
            itemEl.innerHTML = `
                <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <img src="${item.image}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <h5 class="text-sm font-bold text-gray-800 leading-tight">${item.name}</h5>
                    <p class="text-xs text-gray-500">${item.size ? 'Talla: ' + item.size : ''}</p>
                    <div class="flex justify-between items-center mt-2">
                        <div class="flex items-center gap-2">
                            <button onclick="changeQty(${index}, -1)" class="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100">-</button>
                            <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                            <button onclick="changeQty(${index}, 1)" class="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100">+</button>
                        </div>
                        <span class="font-bold text-fcb-grana text-sm">${(item.price * item.qty).toFixed(2)}€</span>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        totalPriceEl.textContent = `${total.toFixed(2)}€`;
        cartCountSidebar.textContent = `${count} items`;
        cartCountMobile.textContent = count;
        cartCountMobile.classList.remove('hidden');
    }
}

window.changeQty = function(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// Form Submission
document.getElementById('order-form').onsubmit = function(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('La cistella està buida!');
        return;
    }
    
    const name = document.getElementById('nom').value;
    const cartDetails = cart.map(item => `- ${item.name} (${item.qty} unitats)${item.size ? ', Talla: ' + item.size : ''}`).join('\n');
    const total = document.getElementById('total-price').textContent;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Enviant...
    `;

    // Inject cart data into hidden fields for the native submission
    let cartInput = document.getElementById('hidden-comanda');
    if (!cartInput) {
        cartInput = document.createElement('input');
        cartInput.type = 'hidden';
        cartInput.id = 'hidden-comanda';
        cartInput.name = 'Comanda';
        e.target.appendChild(cartInput);
    }
    cartInput.value = cartDetails;
    
    let totalInput = document.getElementById('hidden-total');
    if (!totalInput) {
        totalInput = document.createElement('input');
        totalInput.type = 'hidden';
        totalInput.id = 'hidden-total';
        totalInput.name = 'Total';
        e.target.appendChild(totalInput);
    }
    totalInput.value = total;

    // Show Success Modal after a short delay (simulation of submission)
    setTimeout(() => {
        const modal = document.getElementById('success-modal');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.children[0].classList.remove('scale-90');
        }, 10);

        // Reset Form and Cart state locally
        cart = [];
        updateCartUI();
        e.target.reset();
        
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }, 1500);

    console.log('Processant comanda a través de iframe...');
    // The form will now submit naturally to the hidden iframe thanks to the 'target' attribute in HTML
};

// Modal Close
document.getElementById('close-modal').onclick = function() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('opacity-0');
    modal.children[0].classList.add('scale-90');
    setTimeout(() => {
        modal.classList.add('hidden');
        window.location.reload(); // Reset the page completely
    }, 300);
};

// Lightbox Logic
window.openLightbox = function(imgSrc) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    img.src = imgSrc;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        img.classList.remove('scale-90');
    }, 10);
};

window.closeLightbox = function() {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    modal.classList.add('opacity-0');
    img.classList.add('scale-90');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

document.getElementById('lightbox-modal').onclick = closeLightbox;
document.getElementById('close-lightbox').onclick = (e) => {
    e.stopPropagation();
    closeLightbox();
};

// Mobile Scroll for sticky sidebar
window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

// Mobile Cart Toggle
document.getElementById('cart-toggle').onclick = function() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.scrollIntoView({ behavior: 'smooth' });
};

const products = [
    {
        id: 1,
        name: "Camiseta Oficial 1a Equipació",
        price: 45.00,
        type: "camiseta",
        image: "https://images.unsplash.com/photo-1540910419892-f0c059497e74?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 2,
        name: "Camiseta Entrenament Sitges",
        price: 30.00,
        type: "camiseta",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 3,
        name: "Polo Penya Blaugrana",
        price: 35.00,
        type: "camiseta",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 4,
        name: "Camiseta Retro 1980",
        price: 50.00,
        type: "camiseta",
        image: "https://images.unsplash.com/photo-1516257984411-1bb161743d52?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 5,
        name: "Gorra Clàssica PB Sitges",
        price: 15.00,
        type: "gorra",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 6,
        name: "Gorra Plana 'SITGES'",
        price: 18.00,
        type: "gorra",
        image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 7,
        name: "Visera Estiu Blaugrana",
        price: 12.00,
        type: "gorra",
        image: "https://images.unsplash.com/photo-1576850058072-55d9443899f0?auto=format&fit=crop&q=80&w=500"
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
            <div class="relative overflow-hidden h-48 bg-gray-100">
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                    </svg>
                    Afegir
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
    const email = document.getElementById('email').value;
    const phone = document.getElementById('telefon').value;

    console.log('Simulant enviament de comanda...', { name, email, phone, cart });

    // Show Modal
    const modal = document.getElementById('success-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.children[0].classList.remove('scale-90');
    }, 10);

    // Reset Form and Cart
    cart = [];
    updateCartUI();
    e.target.reset();
};

// Modal Close
document.getElementById('close-modal').onclick = function() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('opacity-0');
    modal.children[0].classList.add('scale-90');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
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

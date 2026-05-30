// Товары в магазине
const products = [
    // iPhone
    {
        id: 1,
        name: 'iPhone 15 Pro Max',
        category: 'iphone',
        price: 159999,
        description: '256GB, Space Black, новейшая модель',
        icon: '🍎',
        rating: 5
    },
    {
        id: 2,
        name: 'iPhone 15 Pro',
        category: 'iphone',
        price: 129999,
        description: '256GB, Gold, A17 Pro',
        icon: '🍎',
        rating: 5
    },
    {
        id: 3,
        name: 'iPhone 15',
        category: 'iphone',
        price: 89999,
        description: '128GB, Blue, Bionic',
        icon: '🍎',
        rating: 4.8
    },
    {
        id: 4,
        name: 'iPhone 14',
        category: 'iphone',
        price: 69999,
        description: '128GB, Midnight, A15',
        icon: '🍎',
        rating: 4.7
    },
    {
        id: 5,
        name: 'iPhone 14 Pro',
        category: 'iphone',
        price: 99999,
        description: '256GB, Silver, Pro Camera',
        icon: '🍎',
        rating: 4.9
    },
    // Dyson
    {
        id: 6,
        name: 'Dyson V15 Detect',
        category: 'dyson',
        price: 189999,
        description: 'Лучшая беспроводная модель с фильтром',
        icon: '🌪️',
        rating: 5
    },
    {
        id: 7,
        name: 'Dyson V12 Detect Slim',
        category: 'dyson',
        price: 129999,
        description: 'Компактная и мощная модель',
        icon: '🌪️',
        rating: 4.8
    },
    {
        id: 8,
        name: 'Dyson V11 Absolute',
        category: 'dyson',
        price: 109999,
        description: 'Универсальная модель для всех поверхностей',
        icon: '🌪️',
        rating: 4.7
    },
    {
        id: 9,
        name: 'Dyson Pure Hot+Cool',
        category: 'dyson',
        price: 79999,
        description: 'Воздухоочиститель 3-в-1',
        icon: '🌪️',
        rating: 4.6
    },
    {
        id: 10,
        name: 'Dyson Supersonic',
        category: 'dyson',
        price: 49999,
        description: 'Профессиональный фен для волос',
        icon: '🌪️',
        rating: 4.9
    }
];

// Корзина
let cart = [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupFilters();
    loadCart();
});

// Отображение товаров
function displayProducts(productsToDisplay) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px; font-size: 1.1rem;">Товары не найдены</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <span class="product-category">${product.category === 'iphone' ? 'iPhone' : 'Dyson'}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}
                </div>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Добавить
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

// Фильтры
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const priceRange = priceFilter.value;

        let filtered = products.filter(product => {
            const matchSearch = product.name.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);
            const matchCategory = !selectedCategory || product.category === selectedCategory;
            
            let matchPrice = true;
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(Number);
                matchPrice = product.price >= min && (max === undefined || product.price <= max);
            }

            return matchSearch && matchCategory && matchPrice;
        });

        displayProducts(filtered);
    };

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
}

// Добавить в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    
    // Показать уведомление
    showNotification(`${product.name} добавлен в корзину!`);
}

// Удалить из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Изменить количество
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Обновить UI корзины
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        cartTotal.textContent = '0 ₽';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div class="cart-remove" onclick="removeFromCart(${item.id})">Удалить</div>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = formatPrice(total);
    }
}

// Переключить видимость корзины
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

// Оформить заказ
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    toggleCart();
    openModal();
}

// Модальное окно
function openModal() {
    document.getElementById('checkoutModal').classList.add('show');
}

function closeModal() {
    document.getElementById('checkoutModal').classList.remove('show');
}

// Отправить заказ
function submitOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const orderData = {
        name: form.elements[0].value,
        email: form.elements[1].value,
        phone: form.elements[2].value,
        address: form.elements[3].value,
        comment: form.elements[4].value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toLocaleString('ru-RU')
    };

    // Сохранить заказ в localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Показать сообщение об успехе
    showNotification('✅ Заказ успешно оформлен! Спасибо за покупку!');
    
    // Очистить корзину
    cart = [];
    saveCart();
    updateCartUI();
    
    // Закрыть модальное окно
    closeModal();
    form.reset();

    // Отправить на email (имитация)
    console.log('Заказ отправлен:', orderData);
}

// Сохранить и загрузить корзину
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Закрыть корзину при клике вне её
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});

// Закрыть модальное окно при клике вне её
window.addEventListener('click', (e) => {
    const modal = document.getElementById('checkoutModal');
    if (e.target === modal) {
        closeModal();
    }
});
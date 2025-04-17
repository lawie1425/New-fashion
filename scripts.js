// DEMO DATA STORAGE
let products = JSON.parse(localStorage.getItem('products')) || [];
let dealers = JSON.parse(localStorage.getItem('dealers')) || [];

// CUSTOMER FUNCTIONALITY
if (document.getElementById('searchInput')) {
  // Real-time search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
  });

  // Initial product load
  renderProducts(products);
}

function renderProducts(items) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = items.map(item => `
    <div class="product-card">
      <img src="https://via.placeholder.com/300x400?text=${encodeURIComponent(item.name)}">
      <h3>${item.name}</h3>
      <p>$${item.price}</p>
    </div>
  `).join('');
}

// DEALER FUNCTIONALITY
if (document.getElementById('loginScreen')) {
  function handleDealerLogin() {
    const email = document.getElementById('dealerEmail').value;
    const password = document.getElementById('dealerPassword').value;
    
    // Authentication check
    const dealer = dealers.find(d => d.email === email && d.password === password);
    
    if (dealer) {
      if (dealer.subscribed) {
        showUploadScreen();
      } else {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('subscriptionScreen').style.display = 'block';
      }
    } else {
      alert('Invalid dealer credentials!');
    }
  }

  function selectPlan(plan) {
    const dealer = dealers.find(d => d.email === document.getElementById('dealerEmail').value);
    dealer.subscribed = true;
    dealer.plan = plan;
    localStorage.setItem('dealers', JSON.stringify(dealers));
    showUploadScreen();
  }

  function showUploadScreen() {
    document.getElementById('subscriptionScreen').style.display = 'none';
    document.getElementById('uploadScreen').style.display = 'block';
  }

  function uploadItem() {
    const newItem = {
      name: document.getElementById('itemName').value,
      price: document.getElementById('itemPrice').value,
      dealer: document.getElementById('dealerEmail').value,
      category: 'Clothes' // Should come from dealer profile
    };
    
    products.push(newItem);
    localStorage.setItem('products', JSON.stringify(products));
    alert('Item added to marketplace!');
  }
}
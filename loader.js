// Load navigation
fetch('/components/nav.html')
    .then(res => res.text())
    .then(text => {
        const oldElem = document.querySelector("script#replace_with_nav");
        const newElem = document.createElement("div");
        newElem.innerHTML = text;
        oldElem.parentNode.replaceChild(newElem, oldElem);
        initializeCartCounter();
    });

// Load footer
fetch('/components/footer.html')
    .then(res => res.text())
    .then(text => {
        const oldElem = document.querySelector("script#replace_with_footer");
        const newElem = document.createElement("footer");
        newElem.innerHTML = text;
        oldElem.parentNode.replaceChild(newElem, oldElem);
    });

function initializeCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.cart-counter').forEach(el => {
        el.textContent = cart.length;
    });
}
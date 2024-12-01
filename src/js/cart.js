const { response } = require("express");
import { arrayProducts } from "../server";

const cart = [];

// funcion addToCart
const addToCart = (productId) => {
    const selectedProduct = arrayProducts.find((product) => product.id === productId);
    if(selectedProduct){
        cart.push(selectedProduct);
        renderCart();
    }
}

// renderizar el carrito
const renderCart = () => {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';

   cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.textContent = `${item.name} - $${item.price}`;
    cartContainer.appendChild(cartItem);
   });

   // mostramos el total
   const total = cart.reduce((sum, item) => sum + item.price, 0);
   const totalElement = document.createElement('div');
   totalElement.textContent = `Total: ${total}`;
   cartContainer.appendChild(totalElement);
}
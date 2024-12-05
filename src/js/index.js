const socketClient = io(); // Conectar con el servidor WebSocket
const inputName = document.getElementById("inputName");
const inputDescription = document.getElementById("inputDescription");
const inputStock = document.getElementById("inputStock");
const inputPrice = document.getElementById("inputPrice");
const productList = document.getElementById("productList");
const btn = document.getElementById('btn');

// Escuchar la lista actualizada de productos desde el servidor
socketClient.on("arrayProducts", (products) => {
  productList.innerHTML = ""; // Limpiar la lista existente

  products.forEach((product) => {
    const listItem = document.createElement("div");
    listItem.classList.add("card");
    listItem.innerHTML = `
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">Descripción: ${product.description}</p>
      <p class="card-text">Stock: ${product.stock}</p>
      <p class="card-text">Precio: $${product.price}</p>
    `;
    productList.appendChild(listItem);
  });
});

btn.addEventListener('click', async (event) => {
  event.preventDefault();

  const name = inputName.value.trim();
  const description = inputDescription.value.trim();
  const stock = inputStock.value.trim();
  const price = inputPrice.value.trim();

  if (!name || !description || !stock || !price) {
    alert('Por favor, completa todos los campos del formulario.');
    return;
  }

  const newProduct = { name, description, stock, price };

  try {
    const response = await fetch('/api/products/addProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Producto agregado correctamente.');
      socketClient.emit("newProd", result.product); 
    } else {
      console.error(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("Error al enviar el producto:", error.message);
    console.error("No se pudo agregar el producto.");
  }

  inputName.value = "";
  inputDescription.value = "";
  inputStock.value = "";
  inputPrice.value = "";
});


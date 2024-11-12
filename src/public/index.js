import fs from 'fs';

const formulario = document.getElementById('productForm');

const processAll = (event) => {
  event.preventDefault();
  const datos = new FormData(event.target);

 const dataComplete = Object.fromEntries(datos.entries());

  const product = JSON.stringify(dataComplete);
  
  fs.writeFileSync('../public/products.json', JSON.stringify(product, null, 2));

 }


 formulario.addEventListener('submit', processAll);
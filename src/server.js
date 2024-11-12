import express from "express";
import path from "path";
import fs from 'fs'
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js"
import mainRouter from "./routes/main.router.js"
import getProductsRouter from "./routes/getproducts.router.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(process.cwd(), "src", "./public")));
app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src/views"));

app.use('/', mainRouter);
app.use('/products', productsRouter);
app.use('/getproducts', getProductsRouter);

const httpServer = app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});

const socketServer = new Server(httpServer);

export const arrayProducts = [];

socketServer.on('updateProducts', (products) => {
  const productList = document.getElementById('productList');
  productList.innerHTML = products.map(product => `<li>${product.name} - $${product.price}</li>`).join('');
});

function writeProducts(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  }

socketServer.on('connection', (socket)=>{
    console.log(`Usuario conectado: ${socket.id}`);
    // console.log(socket);
    socket.on('disconnect', ()=>{
        console.log('usuario desconectado');
    });

    socket.emit('saludoDesdeBack', 'Bienvenido a websockets')

    socket.on('respuestaDesdeFront', (message)=>{
        console.log(message);
    })

    socketServer.emit('arrayProducts', arrayProducts);

    socket.on('newProd', (prod) => {
        arrayProducts.push(prod);           // Agrega el producto al arreglo
        writeProducts(arrayProducts);       // Guarda la lista actualizada en products.json
        socketServer.emit('arrayProducts', arrayProducts); // Emite la lista actualizada
    });
})

export default app;
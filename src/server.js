import express from "express";
import path from "path";
import fs from "fs/promises";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import mainRouter from "./routes/main.router.js";
import getProductsRouter from "./routes/getproducts.router.js";
import carrito from './routes/cart.router.js'
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const productsFilePath = path.join(process.cwd(), "src/public", "products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(process.cwd(), "src", "./public")));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src/views"));

app.use("/", mainRouter);
app.use("/products", productsRouter);
app.use("/realtimeProducts", getProductsRouter);
app.use("/carrito", carrito)

const httpServer = app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});

const socketServer = new Server(httpServer);

 export let arrayProducts = [];

// --- Función para leer productos del archivo JSON ---
async function readProducts() {
  try {
    const data = await fs.readFile(productsFilePath, "utf-8");
    arrayProducts = JSON.parse(data);
  } catch (error) {
    console.error("Error al leer productos:", error.message);
    arrayProducts = [];
  }
}

// --- Función para escribir productos al archivo JSON ---
async function writeProducts(products) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error al escribir productos:", error.message);
  }
}

// Leer productos al iniciar el servidor
await readProducts();

// WebSocket para manejar la conexión y los eventos
socketServer.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Emitir los productos actuales al cliente que se conecta
  socket.emit("arrayProducts", arrayProducts);

  // Cuando un cliente desconecta, solo mostramos un log
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// Ruta para agregar productos desde el frontend (sin necesidad de recargar la página)
app.post("/api/products/addProduct", async (req, res) => {
  try {
    const { name, description, stock, price } = req.body;

    // Validar los datos recibidos
    if (!name || !description || !stock || !price) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Crear un nuevo producto
    const newProduct = {
      id: Date.now(),
      name,
      description,
      stock: Number(stock),
      price: Number(price),
    };

    // Agregar el nuevo producto al array y guardarlo en el archivo
    arrayProducts.push(newProduct);
    await writeProducts(arrayProducts);

    // Emitir la lista de productos actualizada a todos los clientes conectados
    socketServer.emit("arrayProducts", arrayProducts);

    // Responder al cliente que envió la solicitud
    res.status(201).json({ message: "Producto agregado correctamente", product: newProduct });
  } catch (error) {
    console.error("Error al agregar producto:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default app;

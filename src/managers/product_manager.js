// src/managers/product.manager.js
import fs from "fs";
import path from "path";

class ProductManager {
  constructor() {
    this.path = path.join(process.cwd(), "src/public/", "products.json");
    console.log("Ruta configurada para products.json:", this.path);
  }

  async getAll() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products);
      } else {
        console.log("Archivo no encontrado, devolviendo array vacío.");
        return [];
      }
    } catch (error) {
      console.error("Error al leer los productos:", error.message);
      throw new Error("Error al leer los productos: " + error.message);
    }
  }
}

export default ProductManager;

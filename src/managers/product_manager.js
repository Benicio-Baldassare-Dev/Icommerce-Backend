import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
      console.error("Error al leer los productos:", error.product);
      throw new Error("Error al leer los productos: " + error.product);
    }
  }

   async create(obj) {
    try {
      const product = {
      id: uuidv4(),
        ...obj,
      };
      const products = await this.getAll();
      const msgExist = products.find((p) => p.id === product.id);
      if (msgExist) throw new Error("product already exists");
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id) {
    try {
      const obj = await this.getById(id);
      const messages = await this.getAll();
      const newArray = messages.filter((obj) => obj.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(newArray));
      return obj;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      const products = await this.getAll();
      if (!products.length > 0) throw new Error("products is empty");
      await fs.promises.unlink(this.path);
    } catch (error) {
      throw new Error(error);
    }
  }


}

export default ProductManager;

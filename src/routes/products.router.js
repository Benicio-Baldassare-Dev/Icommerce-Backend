// src/routes/home.router.js
import { Router } from "express";
import ProductManager from "../controllers/product_controller.js";
import path from "path";

const router = Router();
const productManager = new ProductManager(path.join(process.cwd(), "src", "products.json"));

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render("products", { products });
  } catch (error) {
    res.status(500).send("Error al obtener los productos.");
  }
});

export default router;

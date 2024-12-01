import { ModelProduct } from "./mongoose.model.js";
import { initMongoDB }  from "./mong.connect.js";

const mongoTest = async () =>{
    try {
      await initMongoDB();

      const product = {
        name: 'Harina',
        stock: 20,
        category: 'Ingrediente',
        precio: 2000
      };

      return await ModelProduct.create(product);

    } catch (error) {
      console.error(error.message);
    }
  }
  
  mongoTest();
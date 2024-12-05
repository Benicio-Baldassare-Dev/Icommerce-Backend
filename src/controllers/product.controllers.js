import { ModelProduct } from "../models/product.mode.js";

class ProductDao{
    async getAllProducts(){
        try {
            return await this.model.find({});
        } catch (error) {
            throw new Error(error);
        }
    }

    async getProductById(id){
        try {
            return await this.model.findById(id)
        } catch (error) {
            throw new Error(error);
        }
    }

    async createProduct(){
        try {
            return await this.model.create(obj)
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProduct(id, obj){
        try {
            return await this.model.findByIdAndUpdate(id, obj, { new: true });
        } catch (error) {
            throw new Error(error);
        }
    }

    async removeProduct(id){
        try {
            return await this.model.findByIdAndDelete(id)
        } catch (error) {
            throw new Error(error);
        }
    }
}

export const ProductDao = new ProductDaoMongo(ModelProduct);
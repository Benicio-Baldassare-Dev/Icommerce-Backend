import { connect } from "mongoose";

const Mongo_URL = process.env.Mongo_URL;

export const initMongoDB = async() => {
    try {
        await connect(Mongo_URL);
        console.log('conectado a mongoDB')
    } catch (error) {
        throw new Error(error);
    }
}


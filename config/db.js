import mongoose from "mongoose";

export const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;
        connection.on("connected",()=>{
            console.log("connection successful")
        })
        connection.on("error",()=>{
            console.log("error while connecting")
        })
    } catch (error) {
        console.log("something went wrong")
        console.log(error);
    }
}

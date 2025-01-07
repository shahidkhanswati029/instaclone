import mongoose from "mongoose";
const connectDb = () => {
    try {
        mongoose.connect("mongodb+srv://shahidkhan13501:12345@cluster0.l6sw2.mongodb.net/")
        console.log("db is connected")
    } catch (error) {
        console.log("error in db connection", error)
    }
}
export default connectDb;
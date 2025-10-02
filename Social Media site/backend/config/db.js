import mongoose from 'mongoose';
const connectdb=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected");

    }
    catch{
        console.log("Db error");

    }

}
export default connectdb;
const mongoose = require("mongoose");

const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("DB connected :", connect.connection.host, connect.connection.name);
        return true;
    }catch(err){
        console.log("Database connection error:", err.message);
        console.log("App will continue running without database connection");
        return false;
    }
}

module.exports = connectDb;
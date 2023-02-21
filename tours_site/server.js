const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./starter/config.env"}); 

const app = require("./app");

DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false 
    })
    .then(function(){
        console.log("DB connection successful!");
    });
    
    
// console.log(process.env);



const port = process.env.PORT || 8000;
app.listen(port, function(){
    console.log("server started on port " + port);
    });
// test
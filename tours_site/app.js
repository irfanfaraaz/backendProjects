const fs = require("fs");
const express = require("express");
const app = express();
const morgan = require("morgan");
const https = require("https");
const bodyParser = require("body-parser");
const { create } = require("domain");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");
app.use(bodyParser.urlencoded({extended: true}));
//middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.static(__dirname + "/public"))

console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
    
}



app.use(function(req, res, next) {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});



//Routes




app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server`
    // });
    const err = new Error(`Can't find ${req.originalUrl} on this server`);
    err.status = "fail";
    err.statusCode = 404;
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
    



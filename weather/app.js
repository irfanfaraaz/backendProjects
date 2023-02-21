const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const { workerData } = require("worker_threads");
const { query } = require("express");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
       
    

});
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apikEY= "03114bb9b08e79bd232698d77b83059b";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units=metric&appid="+apikEY;
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const icon = weatherData.weather[0].icon;
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const imageUrl = "http://openweathermap.org/img/wn/"+ icon+ "@2x.png";
            res.write("<p>the weather is "+ weatherDescription+"</p>") ;
            res.write("<h1>temperature is</h1> "+temp);  
            
            res.write("<img src="+ imageUrl +">");
            res.send();
        })
    }); 
    
})


app.listen(3001, function(){
    console.log("server started on port 3001");
});


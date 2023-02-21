// 8f971fbe2b5b93b7e9b98cc7b29e2bd6-us21 api key
// 2cdb0d265c id
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const { url } = require("inspector");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req, res) {
res.sendFile(__dirname+ "/signup.html");
});

app.post("/",function (req, res) {
    const firstName=req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData= JSON.stringify(data );
    const url="https://us21.api.mailchimp.com/3.0/lists/2cdb0d265c";
    const options = {
        method: "POST",
        auth: "irfan:8f971fbe2b5b93b7e9b98cc7b29e2bd6-us21"
    }
    const request = https.request(url,options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.listen(3000, function(){
console.log("server started on port 3000");
});
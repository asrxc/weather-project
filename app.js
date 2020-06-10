const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    let query = req.body.query;
    const apiKey = "8c1882139d037b59c86c1e77e2f44db6";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units=metric";
    query = query.charAt(0).toUpperCase()+query.slice(1);
    https.get(url,function(response){
        response.on("data",function(data){
            const parsedData = JSON.parse(data);
            const temperature  = parsedData.main.feels_like;
            const desc = parsedData.weather[0].description;
            const icon = parsedData.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            const message = response.statusCode;
            res.writeHeader(200, {"Content-Type": "text/html"});  
            res.write("<image src=" +imgUrl+ ">");
            res.write("<h2>Description: "+desc.charAt(0).toUpperCase()+desc.slice(1)+"</h2>");
            res.write("<h2>The temperature of "+query+" is "+temperature+" C</h2>");
            res.write("<h4>(Response code: "+message+" )</h4>");
            res.end();
        });
    });
});

app.listen(2000,function(){
    console.log("Server running on port 2000");
});
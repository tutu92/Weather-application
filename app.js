var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/temperatures", {useMongoClient: true});

app.locals.moment = require("moment");

// Schema setup
var temperatureSchema = new mongoose.Schema({
    temperature: Number,
    createdAt: { type: Date, default: Date.now }
});

var AmsterdamTemp = mongoose.model("AmsterdamTemp", temperatureSchema);
var TokioTemp = mongoose.model("TokioTemp", temperatureSchema);
var NewyorkTemp = mongoose.model("NewyorkTemp", temperatureSchema);
var DubaiTemp = mongoose.model("DubaiTemp", temperatureSchema);
var HelsinkiTemp = mongoose.model("HelsinkiTemp", temperatureSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


// GET ROUTES

// LANDING PAGE

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX PAGE

app.get("/weatherapp", function(req, res){
    res.render("index");
});

// TOKIO

app.get("/weatherapp/Tokio", function(req, res){
    TokioTemp.find({}).sort({"_id": -1}).limit(1).exec(function(err, temper){
         if(err){
            console.log(err);
        } else {
             TokioTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": -1}).limit(1).exec(function(err, maxtemper){
         if(err){
            console.log(err);
        } else {
                   TokioTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": 1}).limit(1).exec(function(err, mintemper){
         if(err){
            console.log(err);
        } else {
             res.render("tokio", {temper: temper, maxtemper: maxtemper, mintemper: mintemper});
                        }
                    });
                }
            });
        }
    });
});

// HELSINKI

app.get("/weatherapp/Helsinki", function(req, res){
    HelsinkiTemp.find({}).sort({"_id": -1}).limit(1).exec(function(err, temper){
         if(err){
            console.log(err);
        } else {
             HelsinkiTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": -1}).limit(1).exec(function(err, maxtemper){
         if(err){
            console.log(err);
        } else {
                   HelsinkiTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": 1}).limit(1).exec(function(err, mintemper){
         if(err){
            console.log(err);
        } else {
             res.render("helsinki", {temper: temper, maxtemper: maxtemper, mintemper: mintemper});
                        }
                    });
                }
            });
        }
    });
});

// NEW YORK

app.get("/weatherapp/NewYork", function(req, res){
    NewyorkTemp.find({}).sort({"_id": -1}).limit(1).exec(function(err, temper){
         if(err){
            console.log(err);
        } else {
             NewyorkTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": -1}).limit(1).exec(function(err, maxtemper){
         if(err){
            console.log(err);
        } else {
                   NewyorkTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": 1}).limit(1).exec(function(err, mintemper){
         if(err){
            console.log(err);
        } else {
             res.render("newyork", {temper: temper, maxtemper: maxtemper, mintemper: mintemper});
                        }
                    });
                }
            });
        }
    });
});

// AMSTERDAM

app.get("/weatherapp/Amsterdam", function(req, res, next){
    AmsterdamTemp.find({}).sort({"_id": -1}).limit(1).exec(function(err, temper){
         if(err){
            console.log(err);
        } else {
             AmsterdamTemp.find({"createdAt":{$gt:new Date(Date.now()- 22 * 60 * 60 * 1000)}}).sort({"temperature": -1}).limit(1).exec(function(err, maxtemper){
         if(err){
            console.log(err);
        } else {
                   AmsterdamTemp.find({"createdAt":{$gt:new Date(Date.now()- 22 * 60 * 60 * 1000)}}).sort({"temperature": 1}).limit(1).exec(function(err, mintemper){
         if(err){
            console.log(err);
        } else {
             res.render("amsterdam", {temper: temper, maxtemper: maxtemper, mintemper: mintemper});
                        }
                    });
                }
            });
        }
    });
});

// DUBAI

app.get("/weatherapp/Dubai", function(req, res){
    DubaiTemp.find({}).sort({"_id": -1}).limit(1).exec(function(err, temper){
         if(err){
            console.log(err);
        } else {
             DubaiTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": -1}).limit(1).exec(function(err, maxtemper){
         if(err){
            console.log(err);
        } else {
                   DubaiTemp.find({"createdAt":{$gt:new Date(Date.now() - 22*60*60 * 1000)}}).sort({"temperature": 1}).limit(1).exec(function(err, mintemper){
         if(err){
            console.log(err);
        } else {
             res.render("dubai", {temper: temper, maxtemper: maxtemper, mintemper: mintemper});
                        }
                    });
                }
            });
        }
    });
});



// POST ROUTES

// AMSTERDAM

app.post("/weatherapp/Amsterdam/", function(req, res){
request("http://api.openweathermap.org/data/2.5/weather?q=Amsterdam&APPID=2eb62c648633a0363ddd4c58e7f2f737&units=metric",function(error, response, body){
        if(!error && response.statusCode == 200){
        var data = JSON.parse(body);
        console.log(data["main"]["temp"]);
        AmsterdamTemp.create(
            {
            temperature: data["main"]["temp"],
            }, 
             function(err, temperature){
        if(err){
            console.log("something went wrong");
        } else {
            console.log("added temp");
            console.log(temperature);
        }
    }
            );
        res.redirect("/weatherapp/Amsterdam");
        }
    });
});

// NEW YORK

app.post("/weatherapp/NewYork/", function(req, res){
request("http://api.openweathermap.org/data/2.5/weather?q=New+York&APPID=2eb62c648633a0363ddd4c58e7f2f737&units=metric",function(error, response, body){
        if(!error && response.statusCode == 200){
        var data = JSON.parse(body);
        console.log(data["main"]["temp"]);
        NewyorkTemp.create(
            {
            temperature: data["main"]["temp"],
            }, 
             function(err, temperature){
        if(err){
            console.log("something went wrong");
        } else {
            console.log("added temp");
            console.log(temperature);
        }
    }
            );
        res.redirect("/weatherapp/NewYork");
        }
    });
});

// DUBAI

app.post("/weatherapp/Dubai/", function(req, res){
request("http://api.openweathermap.org/data/2.5/weather?q=Dubai&APPID=2eb62c648633a0363ddd4c58e7f2f737&units=metric",function(error, response, body){
        if(!error && response.statusCode == 200){
        var data = JSON.parse(body);
        console.log(data["main"]["temp"]);
        DubaiTemp.create(
            {
            temperature: data["main"]["temp"],
            }, 
             function(err, temperature){
        if(err){
            console.log("something went wrong");
        } else {
            console.log("added temp");
            console.log(temperature);
        }
    }
            );
        res.redirect("/weatherapp/Dubai");
        }
    });
});

// HELSINKI

app.post("/weatherapp/Helsinki/", function(req, res){
request("http://api.openweathermap.org/data/2.5/weather?q=Helsinki&APPID=2eb62c648633a0363ddd4c58e7f2f737&units=metric",function(error, response, body){
        if(!error && response.statusCode == 200){
        var data = JSON.parse(body);
        console.log(data["main"]["temp"]);
        HelsinkiTemp.create(
            {
            temperature: data["main"]["temp"],
            }, 
             function(err, temperature){
        if(err){
            console.log("something went wrong");
        } else {
            console.log("added temp");
            console.log(temperature);
        }
    }
            );
        res.redirect("/weatherapp/Helsinki");
        }
    });
});

// TOKIO

app.post("/weatherapp/Tokio/", function(req, res){
request("http://api.openweathermap.org/data/2.5/weather?q=Tokyo&APPID=2eb62c648633a0363ddd4c58e7f2f737&units=metric",function(error, response, body){
        if(!error && response.statusCode == 200){
        var data = JSON.parse(body);
        console.log(data["main"]["temp"]);
        TokioTemp.create(
            {
            temperature: data["main"]["temp"],
            }, 
             function(err, temperature){
        if(err){
            console.log("something went wrong");
        } else {
            console.log("added temp");
            console.log(temperature);
        }
    }
            );
        res.redirect("/weatherapp/Tokio");
        }
    });
});


// SERVER CONFIG

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("the server has started");
});

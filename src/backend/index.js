//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');//hace un import de expres
var app     = express();
var utils   = require('./mysql-connector');//hace un import

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//Ejercicio 3
var datos = require("./datos.json");


//Ejercicio 4
app.get('/devices/', function(req, res, next) {
    //res.send(datos);
    res.json(datos);    
    //res.send(JSON.stringify(devices)).status(200);
});

//Ejercicio 5
//Espera una consulta al endpoint Ej /divices/1
//Parametro id = el id del dispositivo a buscar
//devuelve el dispositivo con el id que viene del parametro
app.get('/devices/:id', function(req, res, next) {//el : que se pone antes de ID es para decirle que se espera cuialquie cosa ya que en php se escribe devices/?id=1
    //pero tambien podria ser /devices/1
    //map filter, reduce
    let datosFiltrados = datos.filter(item=> item.id == req.params.id);
    // esto filter hace un for en busca del parametro id

    res.json(datosFiltrados[0]);//se lo paso con [0] para que lo pase como objeto
    //res.send(JSON.stringify(devices)).status(200);
});

//Ejercicio 6
//espera recibir {id:1,state:1/0}
app.post('/devices/', function(req, res) {
    let datosFiltrados = datos.filter(item => item.id == req.body.id);
    if (datosFiltrados.length > 0) {
        datosFiltrados[0].state = req.body.state;
        //res.send("Todo ok");
    }
    res.json(datosFiltrados);
    //res.send("Todo ok");
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================

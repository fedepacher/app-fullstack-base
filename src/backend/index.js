//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');//hace un import de expres
var app     = express();
var db_mysql   = require('./mysql-connector');//hace un import

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));


/*Codigo de practica en clase*/
/*
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
    }
    res.json(datosFiltrados);
    //res.send("Recibido ok");
});
*/


/**
 * @brief Metodo post para instertar y/o actualizar un dispositivo 
 */
app.post('/device_insert_update/', function(req, res){
    if(req.body.id == ""){
        console.log("Insert new element");
        db_mysql.query('insert into Devices (name,description,state,type) values(?,?,?,?)', [req.body.name, req.body.description, req.body.state, req.body.type], function(err, respuesta){
            if(err){
                console.log("Insert error")
                res.send(err).status(400);
            }
            res.send("New item inserted succesfully");
        });
    }
    else
    {
        console.log("Update element");
        db_mysql.query('update Devices set name=?, description=?, type=? where id=?', [req.body.name, req.body.description, req.body.type, req.body.id], function(err, respuesta){
            if(err){
                console.log("Update error")
                res.send(err).status(400);
            }
            res.send("Item updated succesfully");
        });
    }
});

/**
 * @brief Metodo post para actualizar un dispositivo 
 */
app.post('/device_update/', function(req, res){
    let id_arr = req.body.id.split("_");
    let id = id_arr[1]; 
    //res.send(id);
    db_mysql.query('update Devices set state=? where id=?', [req.body.status, id], function(err, respuesta){
        if(err){
            console.log("Update error")
            res.send(err).status(400);
        }
        res.send("Item updated succesfully");
    });
});

/**
 * @brief Metodo post para eliminar un dispositivo 
 */
app.post('/device_delete/', function(req, res){
    db_mysql.query('delete from Devices where id=?', [req.body.id], function(err, respuesta){
        if(err)
        {
            console.log("Delete error")
            res.send(err).status(400);
        }
        res.send(respuesta);
    });
});

/**
 * @brief Metodo post para mostrar un dispositivo 
 */
app.post('/devices_show/', function(req, res){
    db_mysql.query("Select * from Devices", function(err, respuesta){
        if(err)
        {
            console.log("Show error")
            res.send(err).status(400);
        }
        res.send(respuesta);
    });
    
});


/**
 * @brief Metodo listen que se ejecuta al iniciar el servicio backend 
 */
app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================

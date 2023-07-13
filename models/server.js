let express = require("express");
let sha1 = require ("sha1");
let session = require ("express-session")
let cookie = require ( "cookie-parser")

class server {
    constructor (){
        this.app = express();
        this.port = process.env.PORT;

        this.middlewares();
        this.routers();
    }

    middlewares(){
        //paginas estaticas
        this.app.use(express.static('public'));
        //View engine
        this.app.set('view engine', 'ejs');

        this.app.use(cookie());

        this.app.use(session({
          secret:'amar',
          saveUninitialized:true,
          resave:true
        }));

    }

    routers(){
        this.app.get("/hola",(req, res) =>  {
                    //session
                    if (req.session.user){
                      if (req.session.user.rol == 'admin'){
                        res.send("<h1 style='color: blue;'>Iniciaste como administrador</h1>");
                      }
                      else if(req.sesion.user.rol = 'cliente'){ 
                        res.send("<h1 style='color: blue, '>Iniciaste como cliente</h1>");
                      }
          
                    }
                    else {
                      res.send("<h1 style='color: blue;'>ERROR NO HAS INICIADO SESION!!!</h1>");
                    }
                  });
            

        

        // ruta login
        this.app.get('/login ', (req, res)=> {
          let usuario = req.query.usuario;
          let contrasena = req.query.contrasena;

          // cifrado hah sha1
          let passSha1 = sha1 (contrasena);
          let mysql = require('mysql');
          let con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "abcde",
            database: "escuela"
          });
          
          con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            let sql = "select * from usuarios where nombre_usuario = '" + usuario + "'";
            con.query(sql, function (err, result) {
              if (err) throw err;
                 if (result.length  > 0 )
                     if (result[0].contrasena == passSha1){
                      ///////////////////session////////////
                      let user = {
                        nam: usuario, 
                        psw: contrasena,
                        rol: result[0].roll
                      };
                      req.session.user = user;
                      req.session.save();
                      /////////////////////////////////////////////               
                        res.render("inicio", {nombre: result[0].nombre_usuario,
                        rol:result[0].rol
                      } );
                    }
                      else
                        res.render( "inicio", {  nombre: result[0].usuario,rol: result[0].rol});
                  else
                      res.render("Login" , {error: "contraseña incorrecta!!!"});
            });
          });
          


        });

// RUTA DAR DE BAJA ALUMNOS

 


// RUTA REGISTRAR

        this.app.get("/registrar", (req, res) => {

            let mat = req. query. matricula;
            let nombre = req.query. nombre;
            let cuatri = req. query. cuatrimestre;   
            let mysql = require('mysql');



let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcde",
  database: "escuela"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO alumno VALUES ("+ mat +",'" + nombre+"','"+ cuatri+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("registrado", {mat: mat ,nombre:nombre,cuatri:cuatri});
    console.log("1 record inserted");
  });
});     
                
        });
        this.app.get("/registrarcurso", (req, res) => {

            let id_curso = req. query. id_curso;
            let nombre = req.query. nombre  
            let mysql = require('mysql');


// conexion MySQL
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcde",
  database: "escuela"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO curso VALUES ('" + id_curso+"','"+ nombre+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("cursoregistrado", {id_curso: id_curso ,nombre:nombre});
    console.log("1 record inserted");
  });
});     
                
        });
  
        this.app.get("/inscribir", (req, res) => {

          let matricula = req. query. matricula;
          let id_curso = req.query. id_curso 
          let mysql = require('mysql');



let con = mysql.createConnection({
host: "localhost",
user: "root",
password: "abcde",
database: "escuela"
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
let sql = "INSERT INTO inscrito VALUES ("+ matricula+","+ id_curso+")";
con.query(sql, function (err, result) {
  if (err) throw err;
  res.render("inscrito", {matricula: matricula ,id_curso:id_curso});
  console.log("1 record inserted");
});
});     
              
      });

        
    }

    listen(){
        this.app.listen (this.port, () => {
            console.log("http://127.0.0.1:" + this.port);
        });
    
    }
}
module.exports = server;

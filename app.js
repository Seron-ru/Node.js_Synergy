const mysql = require("mysql2");
const express = require('express');
var crypto = require("crypto");
var algorithm = "aes-192-cbc"; //algorithm to use
var password = "Hello darkness";
var app = express();


//создание парсеров
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = express.json();
const key = crypto.scryptSync(password, 'salt', 24); //create key
//парсирование
app.get("/register", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/views/register.html");
});
app.post("/register", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    var data = request.body;
    var arr = JSON.parse(JSON.stringify(data));



    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "mydbnp",
        password: "tubgtn2011"
    });
    // тестирование подключений
    connection.connect(function (err) {
        if (err) {
            return console.error("Ошибка: " + err.message);
        }
        else {
            console.log("Подключение к серверу MySQL отлично установился");
        }
    });



    const sqlCreate = `create table if not exists usersnp(
    id int primary key auto_increment,
    userLogin varchar(300),
    userSurname varchar(300),
    userName varchar(300),
    userPatron varchar(300) ,
    userPassSer int,
    userPassNum int
  )`;





    //создание таблицы
    connection.query(sqlCreate, function (err, results) {
        if (err) console.log(err);
        else console.log("Таблица создана");
    });

    const user = [arr.userLogin, arr.userSurname, arr.userName, arr.userPatron, arr.userPassSer, arr.userPassNum];

    const sql1 = "INSERT INTO usersnp(userLogin, userSurname, userName, UserPatron, userPassSer, userPassNum) VALUES(?, ?, ?, ?, ?, ?)";
    connection.query(sql1, user, function (err, result) {
        if (err) console.log(err);
        else console.log("Данные добавились");
    });

    // завершение подключения
    connection.end(function (err) {
        if (err) {
            return console.log("Ошибочка: " + err.message);
        }
        console.log("Подключение остановлено");
    });
});
app.listen(3000);

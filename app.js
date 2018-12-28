var express = require('express');
var bodyParser = require("body-parser")
var fs = require('fs')
var server = express();

server.use(bodyParser.urlencoded())
server.use(bodyParser.json())
server.use(express.static('./frontend'))

var users = ['Mudassir', "Rizwan", 'shoaib']

server.get('/getAllUsers', (req, res)=>{
    res.send(users)
})

server.post('/addUser', (req, res)=>{

    // users.push('Raheel') without name field
    
    users.push(req.body.username)
    
    res.end('User is added')
})


server.get('/createFile', (req, res)=>{
    fs.writeFile('myNewfile.txt', "Hello Everyone", function (err){
        if(err) throw err;
        res.send('File successfully created')
    });
})




server.get('/', (req, res)=>{

    res.send("My server is Ready to use")

}).listen(4000, ()=>{console.log("Server is successfully started")})
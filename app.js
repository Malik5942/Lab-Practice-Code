var express = require('express');
var bodyParser = require("body-parser");
var multer = require('multer');
var customConfig = multer.diskStorage({
    destination: function(req, res, next){
       
        next(null, './uploads')
    },
    filename: function(req, file, next){
        // var filename = Date.now();
        // switch(file.mimetype) {
        //     case 'image/png':
        //     filename = filename + '.png';
        //     break;
        //     case 'image/jpeg':
        //     filename = filename + '.jpeg';
        //     break;
        //     default:
        //     break;
        // }
        next(null, Math.random() +'-' +  file.originalname)
    }
})

var upload = multer({storage: customConfig})

var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('Passport-local').Strategy

var server = express();

server.use(express.static('./frontend'))
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())


server.use(session({ secret: "secret-word" }));
server.use(passport.initialize());
server.use(passport.session());


var users = [
    { id: 1, username: "umar", password: 'abcd1234' },
    { id: 2, username: "test", password: '1234' },
]

passport.use(new LocalStrategy(
    function (username, password, next) {

        var user = users.find( (user) => {
            return user.username === username && user.password === password;
        })

        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }

    }
));


passport.serializeUser(function (user, next) {
    next(null, user.id);
});

passport.deserializeUser(function (id, next) {
    var user = users.find((user) => {
        return user.id === id;
    })

    next(null, user);
});

server.post('/login', passport.authenticate('local'), function (req, res) {
    
    
    res.redirect('/dashboard');

    
});


server.get('/dashboard', function (req, res) {

    if (!req.isAuthenticated()) {
        res.send("Login Required to visit this page")
        res.sendFile(__dirname + '/Login.html')
    } else {
        res.sendFile(__dirname + '/dashboard.html')
        // res.send("Yes you're logged in, and your data is available here: " + req.user.username   )
    }

});
 
server.post('/addUser', (req, res)=>{

    
    let newUser = {username: req.body.username, password: req.body.password} 
    users.push(newUser)
    res.end('User is added')
})

server.post('/profile', upload.single('profilePicture'), function(req, res, next){
     console.log(req.file)
     res.send('files is successfully uploaded')
})


server.get('/', (req, res)=>{

    res.send("My server is Ready to use")

}).listen(4050, ()=>{console.log("Server is successfully started on port 4050")})
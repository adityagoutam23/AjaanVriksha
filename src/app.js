const express = require("express");
const path = require("path");
const app = express();
// const html = require("html");
const hbs = require("hbs");
var cons = require('consolidate');
const { requires } = require("consolidate");

require("./db/conn");
const Register = require("./models/registers");
const { ifError } = require("assert");

const port = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path))
app.engine("html", cons.swig)
app.set("view engine", "html");
app.set("views", templates_path);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async(req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        // console.log(`${username} and password is ${password}`)

       const username1 = await Register.findOne({email:username});
    //    res.send(username1.password);
    //    console.log(username1)

    if(username1.password === password){
        res.status(201).render("indexlog");
    }else{
        res.send("Invalid login details");
    }

    }catch(error){
        res.status(400).send("invalid login details")
    }
});

app.post("/register", async(req, res) => {
    try {
        // console.log(req.body.firstname);
        // res.send(req.body.firstname);

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password===cpassword){

            const registerStudent = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword,
                role: req.body.role
            })

            const registered = await registerStudent.save();
            res.status(201).render("index");

        }else{
            res.send("passsword is not matching")
        }

    }catch(error){
        res.status(400).send(error);
    }
});

app.listen(port, () =>{
    console.log(`Server is running port no ${port}`);
})
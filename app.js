require('dotenv').config()
const mongoose = require("mongoose");
const path = require('path');
const express= require('express');
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipes");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'uploads')));

app.use((req, res, next) =>{  // To remove CROS (cross-resource-origin-platform) problem 
  res.setHeader('Access-Control-Allow-Origin',"*"); // to allow all client we use *
  res.setHeader('Access-Control-Allow-Methods',"OPTIONS,GET,POST,PUT,PATCH,DELETE"); //these are the allowed methods 
  res.setHeader('Access-Control-Allow-Headers', "*"); // allowed headers (Auth for extra data related to authoriaztiom)
  next();
})

app.use("/auth", authRoutes);
app.use("/recipe", recipeRoutes);
app.use("/user", userRoutes); 

mongoose
  .connect( 'mongodb+srv://admin:qwertydogg@cluster0.icuea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
      , {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    let port = process.env.PORT || 8000;
    app.listen(port);
    console.log("Server up and running on port " + port);
  })
  .catch((err) => {
    console.log(err);
  });


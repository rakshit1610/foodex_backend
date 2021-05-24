const express = require("express");
const router = express.Router();
const multer = require('multer');

// const isAuth=require('../middleware/authguard');

const recipeController = require("../controllers/recipes");

const imageStorage = multer.diskStorage({ //for multer storage
    //these are two functions which are called by multer for incoming file
    destination: (req, file, cb)=> {
        cb(null,'uploads'); // null tells the call backs that its ok to store the file because that place is for error
    },
    filename:(req, file, cb)=> {
        cb(null,new Date().toDateString() + "-" + file.originalname);
    }
});

const imageFilter = (req, file, cb) => { //For filtering the type of file
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true);  //if we want to store that file
    }
    else{
        cb(null,false); //if we dont want to store that file
        console.log("wrong file type");
    }
};

const imageMulter = multer({storage:imageStorage,fileFilter:imageFilter}).single('img');


router.get('/getRecipes', recipeController.getRecipes)

router.post('/addRecipe', recipeController.addRecipe)

// router.post('/addRecipe', recipeController.addRecipe)

// router.get('/showRecipe',  recipeController.showRecipe)

router.put('/edit', recipeController.editRecipe)

router.delete('/delete/:id/:ownerId', recipeController.deleteRecipe)

router.post('/search', recipeController.search)

router.post('/sort', recipeController.sort)

router.get('/read/:id/:readerId', recipeController.readRecipe)

router.get('/guestread/:id/', recipeController.guestRead)

router.get('/list/:userId', recipeController.myrecipelist);

router.get('/categories/:type', recipeController.getCategory)

router.put('/like', recipeController.likes)

router.put('/bookmark', recipeController.bookmark)

router.put('/bookmarkcheck', recipeController.bookmarkcheck)

module.exports = router;



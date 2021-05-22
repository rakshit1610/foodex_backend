const express = require("express");
const router = express.Router();
const multer = require('multer');

const userController = require("../controllers/user");

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

const imageMulter = multer({storage:imageStorage,fileFilter:imageFilter}).single('image_user');


router.get('/myprofile/:userId', userController.profiledetails);

router.get('/bookmarklist/:userId', userController.bookmarklist);

router.get('/profile/:celebId/:fanId', userController.otheruser);

router.put('/changeimg/:userId', imageMulter, userController.profilepicture)

router.put('/follow', userController.followToggle)

router.get('/followinglist/:userId', userController.getFollowing)

router.get('/followerlist/:userId', userController.getFollowers)


module.exports = router;
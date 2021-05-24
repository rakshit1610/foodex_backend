const User= require('../models/user')
const Otp = require("../models/otp");

const bcrypt= require('bcryptjs')
const otpGenerator = require("otp-generator");
const Emailsender=require("../utils/email");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendgridTRansport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
    sendgridTRansport({
      auth: {
        api_key: process.env.API_KEY
      }
    })
  );

exports.postSignup= (req,res,next)=>{
    const email= req.body.email;
    const password= req.body.password;
    const name= req.body.name;
    const confirmPassword= req.body.confirmPassword;
    User.findOne({email: email})
    .then(userDoc=>{
        if(userDoc){
            return res.status(400).json({"message": "user already exists"});
        }
                
        bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            console.log("password hashed");
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name,
                isverified:'false',
                followers:[],
                followings:[],
                post_count:0,
                image_user: 'https://nodebackendfoodex.herokuapp.com/defaultuser.png',
                bookmarks:[]
            });
            
            user.save();
            console.log('saved user ')

            const OTP = otpGenerator.generate(4, {
            upperCase: false,
            specialChars: false,
            alphabets: false,
          });

          const otp = new Otp({
            otp: OTP,
            email: email,
          });

          otp.save()
        .then((result) => {
          console.log("Otp saved in database");
        })
        .catch((err) => {
          res.json("Otp not Saved in database");
        });

        res.status(200).json({"message":"otp_sent"});

        return Emailsender.sendemail(email,OTP);

        })

    })
    .catch(err=>{
        console.log(err);
    })
};

exports.postLogin= (req,res,next)=>{
    const email= req.body.email;
    const password= req.body.password;
    const confirmPassword= req.body.confirmPassword;
    User.findOne({email: email})
    .then(user=>{
        if(!user){
          res.status(401).json({
            detail: "user doesn't exist"
          });  

        }
        bcrypt.compare(password, user.password)
        .then(passEqual=>{
            if(passEqual){

                const accessToken = JWT.sign(
                  {
                    email: user.email,
                    userId: user._id.toString(),
                  },
                  'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
                  { expiresIn: "12h" }
                );
    
                  console.log(accessToken)

                  res.json({
                    message: "logged in",
                    access: accessToken,
                    userId:user._id
                  });

            }
            else{
                res.status(401).json({
                  detail: "wrong pass"
                });
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(400).send('something went wrong')
        })
    })

};

exports.checkOTP = (req, res, next) => {
    console.log("here at OTP check");
    const email = req.body.email;
    const checkOtp = req.body.otp;
    console.log("1" + email + checkOtp);
    Otp.findOne({ email: email })
      .then((otpResult) => {
        console.log("2");
        if (otpResult.otp === checkOtp) {
          console.log("3");
          User.findOne({ email: email })
            .then((user) => {
              user.isverified = "true";
              console.log(user.email)
              user.save();
 
  
              const accessToken = JWT.sign(
                {
                  email: user.email,
                  userId: user._id.toString(),
                },
                'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
                { expiresIn: "12h" }
              );
  
                console.log(accessToken)
  
              res.json({
                message: "Otp Verified",
                accessToken: accessToken,
                userId:user._id
              });

            })
            .catch((err) => {
              res.json({ message: "Provide a registered Email" })
              console.log(err)
            });
        } else {
          res.status(401).json("otp Entered is incorrect");
        }
      })
      .catch((err) => {
        res.status(403).json("Otp expire, Please resend the email");
      });
  };

  exports.resendOTP = (req, res, next) => {
  
    const email = req.body.email;
  
    let OTP = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
  
    Otp.findOneAndDelete({ email: email })
      .then((result) => {
        console.log("OTP Doc Deleted");
        const otp = new Otp({
          otp: OTP,
          email: email,
        });
  
        otp
          .save()
          .then((result) => {
            res.json("OTP sent to your Email");
            return Emailsender.sendemail(email,OTP);
          })
          .catch((err) => {
            console.log("Otp not Saved in database");
          });
        //   return Emailsender.sendemail(email,OTP);
      })
      .catch((err) => {
        res.json("Something went wrong");
      });
  };

  exports.sendResetOtp= (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//     const error = new Error('Email not registered');
//     error.statusCode = 422;
//     error.data = {
//       message:"Email not registered"
//     }
//     throw error;
//   }

  
    const email = req.body.email;
   console.log(email);
   let OTP = otpGenerator.generate(4, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  const otp = new Otp({
    otp: OTP,
    email: email,
  });

  otp
    .save()
    .then((result) => {
      res.json({ message: "OTP Send,Check Your Email" });
    })
    .catch((err) => {
      console.log(err)
      res.json({ message: "Otp not saved ", error: err });
    });
   
  return Emailsender.sendemail(email,OTP);

}

exports.checkResetOtp = (req, res, next) => {
    const otp = req.body.otp;
    const email = req.body.email;
    console.log(otp);
    Otp.findOne({ email: email }).then((data) => {
      if (!(data.otp === otp)) {
        res.status(400).json("Otp incorrect");
      } else {
        res.status(200).json("Otp correct");
      }
    });
  };

  exports.resetPassword=(req,res,next)=>{
  
    const email = req.body.email;
    const newPassword = req.body.password;
  
     bcrypt.hash(newPassword, 12).then((hashedPass) => {
  
       User.findOne({email:email}).then(user => {
         
         user.password = hashedPass;
  
         user.save().then(result => {
           res.json({messsage:"new password saved",updatedUser:result})
         }).catch(err => {
           res.json(err);
         });
       }
       ).catch(err => {
         res.json({error:err,message:"password not saved"});
       });

     });
   }
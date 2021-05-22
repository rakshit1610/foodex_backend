const User = require("../models/user")
const Recipe = require("../models/recipes")


exports.profiledetails = (req, res, next) => {

    const userid= req.params.userId

    User.findById(userid)
    .then(result=>{

        const response={
            name: result.name,
            post_count: result.post_count,
            follower: result.followers.length,
            following: result.followings.length,
            image_user: result.image_user,
            id: result._id
        }

        res.json(response);
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.bookmarklist = (req, res, next) => {

    const userid= req.params.userId

    User.findById(userid)
    .populate('bookmarks')
    .then(result=>{
        res.json(result);
    })
    .catch(err=>{
        console.log(err)
    })
}


exports.otheruser = (req, res, next) => {

    const celebId= req.params.celebId
    const fanId= req.params.fanId

    var recipeposts=[];

    Recipe.find({ownerId: celebId})
        .then((result) => {

            recipeposts= result

          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
    })

    User.findById(fanId)
        .then(fan=>{
            if(fan.followings.some(following=> following.toString()=== celebId )){
                console.log('already following')

    User.findById(celebId)
    .then(result=>{

        const response={
            name: result.name,
            post_count: result.post_count,
            follower: result.followers.length,
            following: result.followings.length,
            image_user: result.image_user,
            id: result._id,
            alreadyfollowed: true,
            recipes: recipeposts
        }

        res.json(response);
    })
    .catch(err=>{
        console.log(err)
    })

            }

            else{
                User.findById(celebId)
                .then(result=>{
            
                    const response={
                        name: result.name,
                        post_count: result.post_count,
                        follower: result.followers.length,
                        following: result.followings.length,
                        image_user: result.image_user,
                        id: result._id,
                        alreadyfollowed: false,
                        recipes: recipeposts

                    }
            
                    res.json(response);
                })
                .catch(err=>{
                    console.log(err)
                })
            }

        })
        .catch(err=>{
            console.log(err)
        })

    
}

exports.profilepicture = (req, res, next) => {

    const userid= req.params.userId

    User.findById(userid)
    .then(result=>{

        result.image_user= 'https://nodebackendfoodex.herokuapp.com/'+req.file.filename;

        res.json(result);
        return result.save()
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.getFollowing = (req, res, next) => {

    const userid= req.params.userId

    User.findById(userid)
    .populate('followings')
    .then(result=>{

        res.json(result);
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.getFollowers = (req, res, next) => {

    const userid= req.params.userId

    User.findById(userid)
    .populate('followers')
    .then(result=>{

        res.json(result);
    })
    .catch(err=>{
        console.log(err)
    })
}

    exports.followToggle=(req,res,next)=>{

        const fanId= req.body.fanId
        const celebId= req.body.celebId

        console.log(fanId, celebId)

        User.findById(fanId)
        .then(fan=>{
            if(fan.followings.some(following=> following.toString()=== celebId )){
        User.findByIdAndUpdate(celebId,{
        $pull:{followers:fanId}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(fanId,{
          $pull:{followings:celebId}
          
      },{new:true}).then(result=>{
          res.json(result)

          console.log("unfollowed")
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
    }

    else{

        User.findByIdAndUpdate(celebId,{
            $push:{followers:fanId}
        },{
            new:true
        },(err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
          User.findByIdAndUpdate(fanId,{
              $push:{followings:celebId}
              
          },{new:true}).then(result=>{
              res.json(result)

            console.log("followed")
          }).catch(err=>{
              return res.status(422).json({error:err})
          })
    
        }
        )

    }
})
.catch(err=>console.log(err))




}
        
            

        



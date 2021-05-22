const Recipe = require("../models/recipes")
const User= require('../models/user')


exports.getRecipes = (req, res, next) => {
    Recipe.find()
    .then(recipe=>{
        res.json(recipe);
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.addRecipe = (req, res, next) => {

    const recipeimg = req.file.filename;
    var recipeowner;
    const ownerId= req.body.ownerId;

    User.findOne({_id: ownerId})
    .then((result) => {
        recipeowner= result.name

        const recipe= new Recipe({
            title: req.body.title,
            content: req.body.content,
            veg: req.body.veg,
            img: 'http://localhost:8000/'+recipeimg,
            read_time: Math.floor(req.body.content.length / 275),
            cook_time: req.body.cook_time,
            category: req.body.category,
            ingredients: req.body.ingredients,
            ownerId: req.body.ownerId,
            owner: recipeowner
        })
    
        console.log(recipeimg);
        console.log(recipeowner)


        User.findById(req.body.ownerId)
    .then(result=>{

        result.post_count = result.post_count + 1

        console.log(result.post_count)
        return result.save()
    })
    .catch(err=>{
        console.log(err)
    })
    
        

        recipe.save().then(result =>{
            console.log(result);
            res.status(201).json({message:'Recipe Created',newRecipe: result})
        }).catch(err => {
            console.log(err);
        });

      })
      .catch((err) => {
        console.log(err)
    })

    // const recipe= new Recipe({
    //     title: req.body.title,
    //     content: req.body.content,
    //     veg: req.body.veg,
    //     img: 'http://localhost:8000/'+recipeimg,
    //     read_time: Math.floor(req.body.content.length / 275),
    //     cook_time: req.body.cook_time,
    //     category: req.body.category,
    //     ingredients: req.body.ingredients,
    //     owner: recipeowner
    // })

    // console.log(recipeimg);
    // console.log(recipeowner)

    // recipe.save().then(result =>{
    //     console.log(result);
    //     res.status(201).json({message:'Recipe Created',newRecipe: result})
    // }).catch(err => {
    //     console.log(err);
    // });
}

exports.showRecipe = (req, res, next) => {
    const recipeId = req.body.recipeId

    Recipe.findOne({_id: recipeId})
    .then(recipe=>{
        res.json(recipe);
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.getCategory = (req, res, next) => {
    const recipetype = req.params.type

    // console.log("nodeeeee",recipetype)

    Recipe.find({category: recipetype})
    .then(recipe=>{
        // console.log(recipe)
        res.json(recipe);
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.editRecipe=(req,res,next)=>{
    const recipeId=req.body.recipeId;
    // console.log(req.body)


    // const recipeimg = req.file.filename;
    var recipeowner;
    
    Recipe.findOne({_id: recipeId})
    .then(data=>{

            data.title= req.body.title;
            data.content= req.body.content;
            data.veg= req.body.veg;
            
            if(req.file){
            data.img= 'http://localhost:8000/'+req.file.filename;
            }

            data.read_time= Math.floor(req.body.content.length / 275);
            data.cook_time= req.body.cook_time;
            data.category= req.body.category;
            data.ingredients= req.body.ingredients;

          res.status(200).json({message:'Recipe edited'})
          return data.save()
          

    })
    .catch(err=>{
        console.log(err)
    })

}

exports.deleteRecipe = (req, res, next) => {
    const recipeId = req.params.id;

    User.findById(req.params.ownerId)
    .then(result=>{

        result.post_count = result.post_count - 1

        console.log("delete ho gyi post ct ghata")
        return result.save()
    })
    .catch(err=>{
        console.log(err)
    })

    Recipe.findOneAndDelete({_id:recipeId})
    .then((ans) => {
        res.status(200).json({
          msg: "recipe deleted",
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
})

}

exports.readRecipe = (req, res, next) => {
    const recipeId = req.params.id;
    console.log(recipeId)
    console.log(req.params.readerId)

    var liked= false;

    Recipe.findById(recipeId)
    .then(post=>{
        if(post.likes.some(like=> like.toString()=== req.params.readerId )){
            liked= true;
        }

       result={ title: post.title,
                ingredients: post.ingredients,
                content: post.content,
                img: post.img,
                cook_time: post.cook_time,
                owner: post.owner,
                category: post.category,
                veg: post.veg,
                ownerId: post.ownerId,
                points: post.likes.length,
                like_is: liked,
       }

        if(req.params.readerId==post.ownerId){
            result={
                ...result,
                "ownit" : "true"
            }
        }
        console.log(result)
        res.json(result);
        
        
    })
    .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
})


//     Recipe.findOne({_id:recipeId})
//     .then((result) => {
//         if(req.params.readerId==result.ownerId){
//             result={
//                 // ...result,
//                 title: result.title,
//                 ingredients: result.ingredients,
//                 content: result.content,
//                 img: result.img,
//                 cook_time: result.cook_time,
//                 owner: result.owner,
//                 category: result.category,
//                 veg: result.veg,
//                 ownerId: result.ownerId,
//                 ownit: true,
//                 points: result.likes.length
//             }
//         }
//         console.log(result)
//         res.json(result);
//       })
//       .catch((err) => {
//         if (!err.statusCode) {
//           err.statusCode = 500;
//         }
//         next(err);
// })

}



exports.search = (req, res, next) => {
    const keyword = req.body.search;
    
    Recipe.find({title: {$regex: keyword, $options: '$i'} })
    .then((result) => {

        res.json(result);
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
})

}

// exports.like = (req,res, next)=>{

//     const recipeId= req.body.recipeId
//     const userId= req.body.userId

//     Recipe.findByIdAndUpdate(recipeId,{
//         $push:{likes:userId}
//     },{
//         new:true
//     })
//     .then(result=>{
//         res.json(result)
//     })
//     .catch((err) => {
//         if (!err.statusCode) {
//           err.statusCode = 500;
//         }
//         next(err);
// })

// }

exports.likes = (req,res, next)=>{

    const recipeId= req.body.recipeId
    const userId= req.body.userId

    Recipe.findById(recipeId)
    .then(post=>{
        if(post.likes.some(like=> like.toString()=== userId )){

            Recipe.findOneAndUpdate({_id:recipeId},{
                $pull:{ likes:userId}
            },{new:true}).then(data => {
                console.log(data);
                res.json("unliked");
            }).catch(err => {
                res.json("Unlike fail");
            })

        }

        else{
            Recipe.findOneAndUpdate({_id:recipeId},{
                $addToSet:{ likes:userId} // addToSet add new value only if it is not present in array
            },{new:true}).then(data => {
                console.log(data);
                res.json('liked');
            }).catch(err => {
                res.json("Not liked");
            })
        }
    
    })
    .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
})

}

exports.bookmark = (req,res, next)=>{

    const recipeId= req.body.recipeId
    const userId= req.body.userId

    User.findById(userId)
    .then(user=>{
        if(user.bookmarks.some(bookmark=> bookmark.toString()=== recipeId )){

            User.findOneAndUpdate({_id:userId},{
                $pull:{bookmarks:recipeId}
            },{new:true}).then(data => {
                console.log(data);
                res.json("unbookmarked");
            }).catch(err => {
                res.json("Unlike fail");
            })

        }

        else{
            User.findOneAndUpdate({_id:userId},{
                $addToSet:{bookmarks:recipeId} // addToSet add new value only if it is not present in array
            },{new:true}).then(data => {
                console.log(data);
                res.json('bookmarked');
            }).catch(err => {
                res.json("Not liked");
            })
        }
    
    })
    .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
})

}


exports.bookmarkcheck = (req,res, next)=>{

    const recipeId= req.body.recipeId
    const userId= req.body.userId

    User.findById(userId)
    .then(user=>{
        if(user.bookmarks.some(bookmark=> bookmark.toString()=== recipeId )){

        res.json({bookmark_is: true})

        }

        else{
        res.json({bookmark_is: false})
         
        }
    })
    .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
})

}


exports.sort = (req, res, next) => {
    const keyword = req.body.search;
    const para = req.body.data;
    const isveg = req.body.veg;

    if(isveg=="all"){
        if(para=="new"){
            Recipe.find({title: {$regex: keyword, $options: '$i'} })
            .sort({
                _id: -1
            })
            .then((result) => {

                res.json(result);
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
        })
        }
        else{
        Recipe.find({title: {$regex: keyword, $options: '$i'} })
        .then((result) => {

            res.json(result);
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
    })
}
    }

    else{

        if(para=="new"){
            Recipe.find({$and: [{veg: isveg},
                {title: {$regex: keyword, $options: '$i'} }
                ]})
                .sort({
                    _id: -1
                })
                .then((result) => {
    
                    res.json(result);
                  })
                  .catch((err) => {
                    if (!err.statusCode) {
                      err.statusCode = 500;
                    }
                    next(err);
            })
        }

        else{
        Recipe.find({$and: [{veg: isveg},
            {title: {$regex: keyword, $options: '$i'} }
            ]})
            .then((result) => {

                res.json(result);
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
        })
    }
}


}


exports.myrecipelist = (req, res, next) => {
    
        const userId= req.params.userId

        Recipe.find({ownerId: userId})
        .then((result) => {

            res.json(result);
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
    })

}
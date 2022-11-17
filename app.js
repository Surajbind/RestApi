const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const { urlencoded } = require('body-parser');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))



mongoose.connect("mongodb://localhost:27017/moviesDB");


const movieSchema ={
    name:String,
    img:String,
    summary:String
}

const Movie = mongoose.model("Movie",movieSchema);

app.use(express.static("public"));


//All  Movies

app.get("/",function(req,res){
    res.send("Server is Set");
});

app.route("/movies")

.get(function(req,res){
    Movie.find(function(err,foundMovies){
        
        if(!err)
        {
            res.send(foundMovies);   
        }
        else
        {
            res.send(err);  
        }
    })
})

.post(function (req,res){ 
    const newMovie = new Movie({
         name:req.body.name,
         img:req.body.img,
         summary:req.body.summary
    })
    
    newMovie.save(function(err){
        if(!err)
        {
            res.send("Successfully Added new Movie");
        }
        else
        {
            res.send(err);
        }
    });
    
    })

.delete(function(req,res){
    Movie.deleteMany(function(err){  
        if(!err)
        {
            res.send("Successfully delted All Movies");
        }
        else
        {
            res.send(err);
        }
    })
});


//Every Movies


app.route("/movies/:nameMovie")

.get(function(req,res){
  Movie.findOne({name:req.params.nameMovie}, function(err,foundMovie){
    if(foundMovie)
    {   
        res.send(foundMovie);
    }
    else
    {
        res.send("Nothng Found");
    }
  })
})

.patch(function(req,res){
    Movie.updateOne(
        {name:req.body.name},
        {summary:req.body.summary},
        {$set:req.body.summary},
        function(err)
        {
            if(!err)
            {
              res.send("Successfully Updated");  
            }
        }
    )
})

.delete(function(req,res){
    Movie.deleteOne(
        {name:req.body.name},
        function(err)
        {
            if(!err)
            {
              res.send("Successfully deleted");  
            }
        }
    )
});

app.listen('3000', function(){
    console.log("Server is Online");
});
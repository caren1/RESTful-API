//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

let articles = [];

/// ALL ARTICLES ///

app.route("/articles")
  .get(function(req, res){
    Article.find(function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }
    });
  })

  .post(function(req, res){

    const newArticle = new Article ({
      title : req.body.title,
      content : req.body.content
    });

    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added a new article");
      }else{
        res.send(err);
      }
    });
  })

  .delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
          res.send("Successfully deleted all articles.");
        }else{
          res.send(err);
        }
      }
    );
  });

/// SPECIFIC ARTICLE //

//GETTING A SINGLE ARTICLE//

  app.route("/articles/:articleTitle")
   .get(function(req, res){
     const requestedTitle = req.params.articleTitle;
     // const requestedTitleId = req.params.articleId;
     Article.findOne({title: requestedTitle}, function(err, foundArticle){
       if(foundArticle){
         res.send(foundArticle);
       }else{
         res.send("No articles matching that title was found");
       }
     });
   })

   .put(function(req, res){
     const requestedTitle = req.params.articleTitle;
     Article.update(
       {title: requestedTitle}, //condition
       {title: req.body.title, content: req.body.content}, //what is it to be updated?
       {overwrite:true},
      function(err){
        if(!err){
          res.send("Successfully updated an article");
        }
     });
   })

   .patch(function(req, res){
     Article.update(
       {title: req.params.articleTitle},
       {$set: req.body},
       function(err){
         if(!err){
           res.send("Successfully updated an article");
         }else{
           res.send(err);
         }
       }
     );
   });

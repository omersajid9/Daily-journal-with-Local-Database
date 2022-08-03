//jshint esversion:6

console.clear();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://127.0.0.1:27017/journal", {ssl:false}).then(()=>console.log("Connected to Database")).catch(error=>console.log("Connection denied: " + error));
mongoose.connect("mongodb://127.0.0.1:27017/test", {ssl:false}).then(()=>console.log("Connected to Database")).catch(error=>console.log("Connection denied: " + error));


// const postSchema = new mongoose.Schema({
//   Title: String,
//   Text: String
// });

 postArray = [];


const postSchema = new mongoose.Schema({
  Title: String,
  Text: String
});

async function findPosts(){
  await Post.find().then(posts=> {
    postArray = posts;
    console.log("Posts: " + posts);
  }).catch(err=>console.log(err));
}

// const Post = mongoose.model("Post", postSchema);
const Post = mongoose.model("Post", postSchema);

findPosts();

// post_array = [];
// post_names = [];

app.get("/", (req, res)=>{
  findPosts();

  // Post.find((err, posts)=>{
  //   if(err){
  //     console.log(err);
  //   }else {
  //     postArray = posts;
  //     console.log("Posts: "+ posts);
  //   }
  // });

  res.render("home" ,{content: homeStartingContent});
});

app.get("/about", (req,res)=>{
  res.render("about", {content: aboutContent});
});

app.get("/contact", (req,res)=>{
  res.render("contact", {content: contactContent});
});

app.get("/compose", (req,res)=>{
  res.render("compose");
});

app.post("/compose", (req,res)=>{

  const instance = new Post({
    Title: req.body.title,
    Text: req.body.post
  });
  saveInstance(instance);
  res.redirect('/');
});

async function saveInstance(instance){
  await instance.save().then(()=>console.log("Instance saved")).catch(err=>console.log("Error in saving instance"));
};

app.post('/delete', (req, res)=>{
    Post.deleteOne({Title: req.body.delete}).then(()=>console.log("Record deleted")).catch(err=>console.log("Error :" + err));
    res.redirect('/');
});

app.get('/posts/:param1', (req, res) => {
    postArray.forEach(element=>{
    // console.log(element.Title);
      if(element.Title == req.params.param1){
        res.render("message", {title: element.Title, content: element.Text});
      }

  })
  // res.send("Try again");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

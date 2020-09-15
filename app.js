const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRouter = require('./Routes/postsRouter');
const userRouter = require('./Routes/userRouter');
const app = express();


dotenv.config({path:'./config.env'});dotenv.config({path:'./config.env'});
// connecting to the Database
mongoose.connect(`mongodb+srv://absar:${process.env.PASSWORD}@cluster0.elica.mongodb.net/posts`,
{ useNewUrlParser: true ,useUnifiedTopology: true ,useFindAndModify: false,useCreateIndex:true })
.then(()=>console.log('connected to DB'))
.catch(()=>console.log('Error occured during connecting to the db!'));

// express Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
     res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Accept,Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS");
   next();
});

app.use("/images",express.static(path.join(__dirname,`/images`)));

app.use('/api/posts',postRouter);
app.use('/api/users',userRouter);

module.exports = app;

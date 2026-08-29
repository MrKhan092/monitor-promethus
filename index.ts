import express from "express";
import { middleware } from "./middleware";

const app=express();
app.use(middleware);
app.get('/cpu',(req,res)=>{
    for( let i=0;i<10000;i++){
        Math.random();
    }
    res.json({
        message:"CPU intensive task completed"
    })
});
app.get('/users',(req,res)=>{
    res.json({
        message:"users"
    })
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
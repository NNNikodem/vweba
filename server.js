const express = require("express");
const {json} = require("body-parser");
require("express-async-errors");

const app = express();
app.use(json());

app.use("/restiky", require("./src/routes/restaurant.route"));



app.use((error, req, res, next) =>
{
    res.status(error.code || 500);
    res.send({message: error.message || "An unknown error occured!"});
}
)
app.use((req,res, next)=>{
    res.status(404).send({message:"No route found!"});
})
app.listen(3000, ()=>{
    console.log("Up and listening on port 3000.");
})
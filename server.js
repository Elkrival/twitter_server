require('dotenv').config()
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const PORT = process.env.PORT || 8000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json())

app.use("/api/v1", require("./controller/twitter_controller"));
app.use(async(err, req, res, next) =>{
    console.error(err)
    res.json({ error: err.message })
})
app.listen(PORT, async function(){
    console.log(PORT)
})
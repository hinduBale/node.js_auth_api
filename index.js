const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
//Importing Routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

//Connecting to the DB
mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log("Connected to the DB!!")
)

//Middlewares
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

app.listen(3000, () => {
    console.log("Server up and running")
});
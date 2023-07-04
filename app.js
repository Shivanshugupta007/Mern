const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT;

require('./db/conn');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

 if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("/*", function(req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
      }); }

app.use(require('./router/auth'));

app.listen(PORT, () => {
    console.log(`Backend Run At ${PORT}`);
});

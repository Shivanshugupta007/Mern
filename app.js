const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT;

require('./db/conn');

app.use(express.json());

app.use(require('./router/auth'));

app.listen(PORT, () => {
    console.log(`Backend Run At ${PORT}`);
});
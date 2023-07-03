const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
    console.log(`DB Connected`);
}).catch((err) => {
    console.log("DB Not Connected");
    console.log(err);
}); 
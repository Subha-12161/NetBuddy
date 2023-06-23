const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString).then(() => {
    console.log("Db connected");
}).catch((err) => {
    console.log(`db error ${err}`);
})
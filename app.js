require('dotenv').config();
require('./db/conn');

const express = require('express');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const app = express();

const userRoutes = require('./routes/user');

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send("NetBuddy Server running."));
app.use('/api/user', userRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
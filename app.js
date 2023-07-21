require('dotenv').config();
require('./db/conn');
const authenticate = require('./middleware/auth');
const axios = require('axios');


const express = require('express');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const app = express();

const userRoutes = require('./routes/user');
const complaintsRoutes = require('./routes/complaintsRoute');
const preUserRoutes = require('./routes/preUserRoute');

const path = require('path');

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/user', userRoutes);
app.use('/api/admin/complaints', complaintsRoutes);
app.use('/api/preuser', preUserRoutes);
app.use('/api/complaint', complaintsRoutes);


// Rendering pages
app.get('/register', function (req, res, next) {
    res.render('user/register');
});

app.get('/login', function (req, res, next) {
    res.render('user/login');
});

app.get('/resetpass', function (req, res, next) {
    res.render('user/forgetPassword');
});

app.get('/', authenticate.Authenticate, (req, res) => {
    if (!req.rootUser) {
        res.render('user/login');
    } else {
        res.render('pages/homepage', { rootUser: req.rootUser });
    }
});

// Complaint page
app.get('/complaintDetails', authenticate.Authenticate, async (req, res) => {
    try {
        if (!req.rootUser) {
            return res.render('user/login');
        }
        // All complaints
        if (!req.query.id) {
            let page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 100;

            const response = await axios.get(`http://localhost:7573/api/admin/complaints/view-complaint?page=${page}&limit=${limit}`);
            const complaints = response.data;

            res.render('admin/complaintDetails', { complaints: complaints });

        } else {
            // single complaint
            const response = await axios.get(`http://localhost:7573/api/admin/complaints/view-single-complaint/${req.query.id}`);
            const complaints = response.data;
            res.render('admin/singleComplaint', { complaints: complaints });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to fetch the complaints data.');
    }
});

// logout
app.get("/logout", (req, res) => {
    res.clearCookie("JWT");
    res.redirect("/");
});

app.get('/abc', authenticate.userAuthenticate, (req, res) => {
    if (!req.rootUser) {
        res.send('Unauthorized');
    } else {
        res.json({ rootUser: req.rootUser });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
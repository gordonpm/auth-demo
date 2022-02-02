const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authdemo', 
    { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Mongo connection open!")
    })
    .catch(err => {
        console.log("Mongo connection error!");
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'thisisasessiontest',
    resave: false,
    saveUninitialized: true
}));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next()
}

app.get('/', (req, res) => {
    res.send('HOME PAGE');
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const {username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    });
    await user.save();
    req.session.user_id = user._id; // _id comes from mongodb
    res.redirect('/secret')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
            req.session.user_id = user._id; // _id comes from mongodb
            console.log('user_id from session = ' + req.session.user_id);
            //res.send("Welcome " + username)
            res.redirect('/secret');
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')
});

app.post('/logout', (req, res) => {
    //req.session.user_id = null  // only destroys user_id in session
    req.session.destroy() // in case you want to destroy all values in session
    res.redirect('login')
})

app.listen(3000, () => {
    console.log('Server is running');
});
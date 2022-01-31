const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');

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
    res.redirect('/')
})

app.get('/secret', (req, res) => {
    res.send('THIS IS SECRET!');
});

app.listen(3000, () => {
    console.log('Server is running');
});
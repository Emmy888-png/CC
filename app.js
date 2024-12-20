// 1. Import the libraries
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const { restart } = require('nodemon')
const mongoose = require('mongoose')
require('dotenv/config')

const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

const Post = require('./models/Post');

app.use(bodyParser.json())

// 2. Middleware
app.use('/api/post', postsRoute)
app.use('/api/user', authRoute)

// 3. Create a route
app.get('/', (req, res) => {
    res.send('You are in your home page!')
})

mongoose.connect(process.env.DB_CONNECTOR).then(() => {
        console.log('Your mongoDB is now connected...')
    }).catch((err) => {
        console.log(err)
    })

// 4. Start the server
app.listen(3000, () => {
    console.log('Server is up and running...')
})

async function updateDatabase() {
    try {
        Post.updateStatus;
        console.log('Status updated');
    } catch (err) {
        console.error('Error updating database');
    }
}

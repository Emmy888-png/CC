const mongoose = require('mongoose');

// Define Comment Schema
const CommentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who posted the comment
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

// Define Post schema
const PostSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    topic:{
        type: [String],
        required: true,
        enum: ['Health', 'Politics', 'Sport', 'Tech']
    },
    message:{
        type: String,
        required: true,
        max: 280
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    expiresAt:{
        type: Date
    },
    status:{
        type: String,
        enum: ['Live', 'Expired'],
        default: 'Live'
    },
});

PostSchema.virtual('remainingTime').get(function() {
    const now = new Date();
    const remainingTime = this.expiresAt - now;

    if (remainingTime <= 0) {
        res.send('Expired');
    }

    const seconds = Math.floor((remainingTime / 1000) % 60);
    const minutes = Math.floor((remainingTime / 1000/60) % 60);

    res.send(`${minutes} minutes, ${seconds} seconds`);

});

PostSchema.pre('save', function (next) {
    // Automatically set expiration time of post to 5 minutes
    if (!this.expiresAt) {
        this.expiresAt = new Date(this.createdAt.getTime() + 5 * 60 * 1000);
    }
    next();
});

PostSchema.methods.updateStatus = function() {
    const currentTime = new Date();
    if (currentTime > this.expiresAt) {
        this.status = 'Expired';
    } else {
        this.status = 'Live';
    }
};

module.exports = mongoose.model('Comment', CommentSchema);
module.exports = mongoose.model('posts', PostSchema);
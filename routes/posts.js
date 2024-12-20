const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const Comment = require('../models/Post');

const verifyToken = require('../verifyToken');

// POST (Create data)
router.post('/', verifyToken, async (req, res) => {

    const postData = new Post({
        userId:req.body.userId,
        user:req.body.user,
        title:req.body.title,
        topic:req.body.topic,
        message:req.body.message
    });

    // try to insert...
    try{
        const postToSave = await postData.save();
        res.send(postToSave);
    }catch(err){
        res.send({message:err});
    }
});

// GET ALL POSTS (Read all)
router.get('/', verifyToken, async (req, res) => {
    try{
        const getPosts = await Post.find().limit(10);
        res.send(getPosts);
    }catch(err){
        res.status(400).send({message:err});
    }
});

// GET ONE POST (Read by ID)
router.get('/:postId', verifyToken, async (req, res) => {
    try{
        const getPostById = await Post.findById(req.params.postId);
        res.send(getPostById);
    }catch(err){
        res.send({message:err});
    }
});

// GET POSTS BY TOPIC (Read by Topic)
router.get('/topic/:postTopic', verifyToken, async (req, res) => {
    try{
        const getPostByTopic = await Post.find( { topic: req.params.postTopic } );
        res.send(getPostByTopic);
    }catch(err){
        res.send({message:err});
    }
});

// PATCH (Update)
router.patch('/:postId', verifyToken, async (req, res) => {

    // try to update...
    try{
        const currentTime = new Date();
        console.log(currentTime);

        const checkPost = await Post.findById(req.params.postId);
        console.log(checkPost.expiresAt);

        if (currentTime > checkPost.expiresAt) {
            throw new Error;
        }

        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                userId:req.body.userId,
                user:req.body.user,
                title:req.body.title,
                topic:req.body.topic,
                message:req.body.message
                }
            }
        )
       res.send(updatePostById)
    } catch(err){
        res.send({message:"Post cannot be edited after expiration"})
    }
})

// DELETE (Delete)
router.delete('/:postId', verifyToken, async (req, res) => {
    try {
        const deletePostById = await Post.deleteOne({_id:req.params.postId})
        res.send(deletePostById)
    }catch(err){
        res.send({message:err})
    }
})

// Like a post
router.put('/:postId/:userId/like', async (req, res) => {
    try {
      // Find the post
      const post = await Post.findById(req.params.postId);
  
        if (!post) {
            res.send('Post not found');
            throw new Error;
        }

        // Check if the user is the author of the post
        if (post.userId.toString() === req.params.userId.toString()) {
            return res.status(400).send('You cannot like your own post');
        }


        // Check if the user has already liked the post
        if (post.likes.includes(req.params.userId)) {
            res.send('You have already liked this post');
            throw new Error;
        }
  
        // Add the user to the likes array
        post.likes.push(req.params.userId);
  
        // Save the post with the updated likes
        await post.save();
  
        res.send('Post liked successfully');
        } catch (err) {
        res.status(400);
        }
  })

// Unlike a post
router.put('/:postId/:userId/unlike', async (req, res) => {
    try {
      // Find the post
      const post = await Post.findById(req.params.postId);
  
      if (!post) {
        res.send('Post not found');
        throw new Error;
      }
  
      // Remove the user from the likes array
      const index = post.likes.indexOf(req.params.userId);
      if (index === -1) {
        res.send('You have not liked this post');
        throw new Error;
      }
  
      post.likes.splice(index, 1);
  
      // Save the post with the updated likes
      await post.save();
  
      res.send('Post unliked successfully');
    } catch (err) {
      res.status(400);
    }
  })

  // Dislike a post
  router.put('/:postId/:userId/dislike', async (req, res) => {
      try {
        // Find the post
        const post = await Post.findById(req.params.postId);
    
          if (!post) {
              res.send('Post not found');
              throw new Error;
          }
  
          // Check if the user is the author of the post
          if (post.userId.toString() === req.params.userId.toString()) {
              return res.status(400).send('You cannot dislike your own post');
          }
  
  
          // Check if the user has already disliked the post
          if (post.dislikes.includes(req.params.userId)) {
              res.send('You have already disliked this post');
              throw new Error;
          }

          if (currentTime > checkPost.expiresAt) {
            res.send('Post expired');
            throw new Error;
        }

          // Add the user to the dislikes array
          post.dislikes.push(req.params.userId);
    
          // Save the post with the updated dislikes
          await post.save();
    
          res.send('Post disliked successfully');
          } catch (err) {
          res.status(400);
          }
    })

// Undislike a post
router.put('/:postId/:userId/undislike', async (req, res) => {
    try {
      // Find the post
      const post = await Post.findById(req.params.postId);
  
      if (!post) {
        res.send('Post not found');
        throw new Error;
      }
  
      // Remove the user from the dislikes array
      const index = post.dislikes.indexOf(req.params.userId);
      if (index === -1) {
        res.send('You have not disliked this post');
        throw new Error;
      }
  
      post.dislikes.splice(index, 1);
  
      // Save the post with the updated likes
      await post.save();
  
      res.send('Post undisliked successfully');
    } catch (err) {
      res.status(400);
    }
  })

/

// Add a comment to a post
router.put('/:postId/:userId/comment', async (req, res) => {

    // Step 1: Create a new comment
    const commentData = new Comment({
        user:req.body.user,
      content:req.body.content
    });
    
    // Save the comment to the database
    await comment.save();
  
    // Step 2: Find the post by ID and add the comment's ID to the comments array
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
  
    post.comments.push(comment._id);
    await post.save();
  
    console.log('Comment added to post successfully');
  })

module.exports = router
const fs = require('fs');
const path = require('path');
const Post = require('../models/post')

// Exported functions

// get all posts
const getAllPosts = function (req) {
  return Post.find()
};

// get post by id
const getPostById = function (req) {
  return Post.findById(req.params.id)
}

// add post
// returns a new Post object
const addPost = function (req) {
  let date = Date.now();
  // Set dates for this new post
  req.body.create_date = date;
  req.body.modified_date = date;
  return new Post(req.body);
};

// delete post
// returns a query
const deletePost = function (id) {
  return Post.findByIdAndRemove(id)
}

// update post
// returns a query
const updatePost = function (req) {
  req.body.modified_date = Date.now();
  // use new:true to return the updated post rather than the original post when the query is executed
  return Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
};

const addComment = async (req) => {
  let postId = req.params.postId;
  let post =  await Post.findById(postId);
  let comment = {
    username: req.body.username,
    comment: req.body.comment
  }
  post.comments.push(comment)
  return Post.findByIdAndUpdate(postId, post, {new: true});
}

const updateComment = async (req) => {
  let commentId = req.params.commentId;
  let postId = req.params.postId;
  let post =  await Post.findById(postId);
  // Article.find( {author.id: req.params.id} )
  // console.log("inside update Comment")
  // console.log(typeof(post.comments[0]._id))
  // console.log(typeof(commentId))
  // console.log("original ", post.comments[0]._id)
  // console.log("in params", commentId)
  let index = post.comments.findIndex((com) => {
    // console.log (String(com._id) == String(commentId))
    return String(com._id) == String(commentId);
  })
  // console.log(index)
  // console.log(post.comments)
  post.comments[index] = {
    username: req.body.username,
    comment: req.body.comment
  };
  console.log(post.comments)
  return Post.findByIdAndUpdate(postId, post, {new: true});
}


const deleteComment = async (req) => {
  let commentId = req.params.commentId;
  let postId = req.params.postId;
  let post =  await Post.findById(postId);
  // Article.find( {author.id: req.params.id} )
  // console.log("inside update Comment")
  // console.log(typeof(post.comments[0]._id))
  // console.log(typeof(commentId))
  // console.log("original ", post.comments[0]._id)
  // console.log("in params", commentId)
  let index = post.comments.findIndex((com) => {
    // console.log (String(com._id) == String(commentId))
    return String(com._id) == String(commentId);
  })
  // console.log(index)
  // console.log(post.comments)
  post.comments = post.comments.filter((com) => {
    return String(com._id) != String(commentId);
  });
  console.log(post.comments)
  return Post.findByIdAndUpdate(postId, post, {new: true});
}


// Local helper functions

function filter(queryParams) {
  let filteredPosts = {};
  if (queryParams.category && queryParams.category.length > 0) {
    for (let post in blogPosts) {
      if (blogPosts[post].category === queryParams.category)
        Object.assign(filteredPosts, blogPosts[post]);
    }
  } else filteredPosts = blogPosts;

  return filteredPosts;
}

module.exports = {
  getAllPosts,
  getPostById,
  addPost,
  deletePost,
  updatePost,
  addComment,
  updateComment,
  deleteComment
}
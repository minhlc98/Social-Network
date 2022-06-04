'use strict';

import mongoose from "mongoose";
const PostModel = mongoose.model("Post");

const PostControllers = {};

PostControllers.get = async (req, res, next) => {
  if (!req.session.user) {
    return res.json([]);
  }
  const user = req.session.user;

  const posts = await PostModel.find({ created_by_user: user._id }).populate("created_by_user", "name avatar_url").sort({ created_at: -1 }).lean(true);

  return res.json(posts);
}

PostControllers.create = async (req, res, next) => {
  try {
    const user = req.session.user;
    const data = req.body;

    const post = new PostModel({ 
      content: data.content,
      created_by_user: user._id
    });

    await post.save();
  } catch (e) {
    return next(e);
  }
}

export default PostControllers;
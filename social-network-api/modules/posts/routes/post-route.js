import PostControllers from "../controllers/post-controller.js";

export default (app) => {
  app.route("/api/posts")
    .get(PostControllers.get)
    .post(PostControllers.create);
};
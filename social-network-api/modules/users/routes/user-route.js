import UserControllers from "../controllers/user-controller.js";

export default (app) => {
  app.post("/api/users/register", UserControllers.register);
  app.post("/api/users/login", UserControllers.login);
  app.post("/api/users/logout", UserControllers.logout);
};
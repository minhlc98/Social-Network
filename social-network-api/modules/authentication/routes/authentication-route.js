import AppAuthenticationMiddleware from "../middlewares/app-authentication-middleware.js";

export default (app) => {
  app.all("/api/*", AppAuthenticationMiddleware.AppAuth);
};
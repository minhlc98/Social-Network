const AppAuthenticationMiddleware = {};

AppAuthenticationMiddleware.AppAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  const POST = "POST";
  const request_method = req.method;

  const list_by_pass_apis = [
    {
      method: POST,
      url: "/api/users/register"
    },
    {
      method: POST,
      url: "/api/users/login"
    },
    {
      method: POST,
      url: "/api/users/logout"
    }
  ];

  const original_url = req.originalUrl;
  const is_by_pass = list_by_pass_apis.some(api => original_url.startsWith(api.url) && request_method === api.method);
  if (is_by_pass) return next();

  return res.status(401).send();
};

export default AppAuthenticationMiddleware;
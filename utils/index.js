function getToken(req) {
  let token = req.headers.authorization
    ? req.headers.authorization.replace("bearer", "")
    : null;
  return token && token.length ? token : null;
}
module.exports = {
  getToken,
};

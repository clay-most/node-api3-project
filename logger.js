function logger(req, res, next) {
  console.log(`${req.method} to url: ${req.url} at ${Date()}`);
  next();
}

module.exports = logger;

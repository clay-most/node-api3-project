const express = require("express");
const logger = require("./logger.js");
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

const server = express();
const port = 6000;

server.use(express.json());
server.use(logger);

server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

server.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

module.exports = server;
